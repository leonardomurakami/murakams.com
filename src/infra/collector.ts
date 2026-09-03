/**
 * Live collector — queries ArgoCD and the in-cluster Kubernetes API and emits
 * the raw `CollectorSnapshot` defined in collector-contract.ts.
 *
 * This is the private side of the sanitization boundary. It MUST NOT be imported
 * by frontend or API/cache code; only the standalone publish entrypoint uses it.
 * The sanitizer (sanitizer.ts) projects its output down to the public schema.
 *
 * Runtime environment:
 * - ARGOCD_SERVER:        e.g. https://argocd-server.argocd:443
 * - ARGOCD_TOKEN:         ArgoCD account token (read from env or token file)
 * - ARGOCD_TOKEN_FILE:    path to a mounted token file (default /var/run/secrets/argocd/token)
 * - ARGOCD_PROJECT_FILTER: comma-separated project names to include (default "workloads"); "*" for all
 * - K8S_API:              in-cluster API base (default https://kubernetes.default.svc)
 * - K8S_TOKEN_FILE:       SA token (default /var/run/secrets/kubernetes.io/serviceaccount/token)
 * - K8S_CA_FILE:          SA CA (default /var/run/secrets/kubernetes.io/serviceaccount/ca.crt)
 *
 * ArgoCD is reached over an in-cluster HTTPS connection with TLS verification
 * disabled (the in-cluster cert is not valid for the service DNS and the
 * connection never leaves the cluster). The Kubernetes API is verified with the
 * mounted service account CA.
 */

import https from "node:https";
import { readFileSync } from "node:fs";
import type {
  CollectorFn,
  CollectorSnapshot,
  RawApplication,
  RawService,
  RawWorkload,
} from "./collector-contract";
import type { HealthState, SyncState, WorkloadKind } from "./public-schema";

// --- ArgoCD API shapes (only the fields consumed) ---------------------------

interface ArgoResource {
  kind?: string;
  name?: string;
  namespace?: string;
  health?: { status?: string } | null;
  syncStatus?: string;
}

interface ArgoApplication {
  metadata?: { name?: string; creationTimestamp?: string };
  spec?: { project?: string; destination?: { namespace?: string } };
  status?: {
    health?: { status?: string };
    sync?: { status?: string };
    reconciledAt?: string;
    operationState?: { finishedAt?: string; message?: string } | null;
    resources?: ArgoResource[];
  };
}

interface ArgoApplicationList {
  items?: ArgoApplication[];
}

// --- Kubernetes API shapes (only the fields consumed) ----------------------

interface K8sWorkloadStatus {
  spec?: { replicas?: number | null };
  status?: {
    readyReplicas?: number;
    desiredNumberScheduled?: number;
    numberReady?: number;
  };
}

interface K8sServiceSpec {
  spec?: { ports?: { port?: number; protocol?: string }[] };
}

interface K8sList<T> {
  items?: T[];
}

// --- helpers ----------------------------------------------------------------

const WORKLOAD_KINDS = new Map<string, WorkloadKind>([
  ["Deployment", "deployment"],
  ["StatefulSet", "statefulset"],
  ["DaemonSet", "daemonset"],
]);

function env(name: string, fallback = ""): string {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

function readFileSafe(path: string): string {
  try {
    return readFileSync(path, "utf8").trim();
  } catch {
    return "";
  }
}

/** HTTPS GET returning parsed JSON, with a caller-supplied agent. */
function getJson<T>(url: string, token: string, agent: https.Agent): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        agent,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`GET ${url} -> ${res.statusCode}: ${body.slice(0, 200)}`));
            return;
          }
          try {
            resolve(JSON.parse(body) as T);
          } catch (err) {
            reject(new Error(`GET ${url} -> invalid JSON: ${(err as Error).message}`));
          }
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(15000, () => req.destroy(new Error(`GET ${url} timed out`)));
  });
}

export function mapHealth(value: string | undefined): HealthState {
  switch (value) {
    case "Healthy":
      return "healthy";
    case "Degraded":
    case "Missing":
      return "unhealthy";
    case "Progressing":
      return "degraded";
    case "Suspended":
    case "Unknown":
    default:
      return "unknown";
  }
}

export function mapSync(value: string | undefined): SyncState {
  switch (value) {
    case "Synced":
      return "synced";
    case "OutOfSync":
      return "out_of_sync";
    default:
      return "unknown";
  }
}

export function healthFromReplicas(desired: number, ready: number): HealthState {
  if (desired <= 0) return "unknown";
  if (ready >= desired) return "healthy";
  if (ready <= 0) return "unhealthy";
  return "degraded";
}

function projectFilter(): Set<string> | null {
  const raw = env("ARGOCD_PROJECT_FILTER", "workloads");
  if (raw === "*") return null;
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

// --- Kubernetes resource lookup --------------------------------------------

interface WorkloadRecord {
  kind: WorkloadKind;
  desired: number;
  ready: number;
}

interface K8sLookup {
  workloads: Map<string, WorkloadRecord>;
  services: Map<string, { port: number; protocol: "TCP" | "UDP" }>;
}

async function readK8sLookup(namespaces: Set<string>, k8sApi: string, token: string, ca: Buffer): Promise<K8sLookup> {
  const agent = new https.Agent({ ca, keepAlive: true });
  const workloads = new Map<string, WorkloadRecord>();
  const services = new Map<string, { port: number; protocol: "TCP" | "UDP" }>();

  await Promise.all(
    [...namespaces].map(async (ns) => {
      // List workloads + services in this namespace in parallel. Each list item
      // carries metadata.name alongside its status/spec.
      const [deploys, statefuls, daemons, svcList] = await Promise.all([
        getJson<K8sList<K8sWorkloadStatus & { metadata?: { name?: string } }>>(`${k8sApi}/apis/apps/v1/namespaces/${ns}/deployments`, token, agent).catch(() => ({ items: [] }) as K8sList<K8sWorkloadStatus & { metadata?: { name?: string } }>),
        getJson<K8sList<K8sWorkloadStatus & { metadata?: { name?: string } }>>(`${k8sApi}/apis/apps/v1/namespaces/${ns}/statefulsets`, token, agent).catch(() => ({ items: [] }) as K8sList<K8sWorkloadStatus & { metadata?: { name?: string } }>),
        getJson<K8sList<K8sWorkloadStatus & { metadata?: { name?: string } }>>(`${k8sApi}/apis/apps/v1/namespaces/${ns}/daemonsets`, token, agent).catch(() => ({ items: [] }) as K8sList<K8sWorkloadStatus & { metadata?: { name?: string } }>),
        getJson<K8sList<K8sServiceSpec & { metadata?: { name?: string } }>>(`${k8sApi}/api/v1/namespaces/${ns}/services`, token, agent).catch(() => ({ items: [] }) as K8sList<K8sServiceSpec & { metadata?: { name?: string } }>),
      ]);
      for (const item of deploys.items ?? []) {
        const name = item.metadata?.name;
        if (!name) continue;
        workloads.set(`${ns}/${name}`, {
          kind: "deployment",
          desired: item.spec?.replicas ?? 1,
          ready: item.status?.readyReplicas ?? 0,
        });
      }
      for (const item of statefuls.items ?? []) {
        const name = item.metadata?.name;
        if (!name) continue;
        workloads.set(`${ns}/${name}`, {
          kind: "statefulset",
          desired: item.spec?.replicas ?? 1,
          ready: item.status?.readyReplicas ?? 0,
        });
      }
      for (const item of daemons.items ?? []) {
        const name = item.metadata?.name;
        if (!name) continue;
        workloads.set(`${ns}/${name}`, {
          kind: "daemonset",
          desired: item.status?.desiredNumberScheduled ?? 0,
          ready: item.status?.numberReady ?? 0,
        });
      }
      for (const item of svcList.items ?? []) {
        const name = item.metadata?.name;
        if (!name) continue;
        const first = item.spec?.ports?.[0];
        if (!first) continue;
        services.set(`${ns}/${name}`, {
          port: first.port ?? 0,
          protocol: first.protocol === "UDP" ? "UDP" : "TCP",
        });
      }
    }),
  );

  return { workloads, services };
}

// --- collector ---------------------------------------------------------------

export const collectInfrastructure: CollectorFn = async (): Promise<CollectorSnapshot> => {
  const argoServer = env("ARGOCD_SERVER", "https://argocd-server.argocd:443");
  const argoToken = env("ARGOCD_TOKEN") || readFileSafe(env("ARGOCD_TOKEN_FILE", "/var/run/secrets/argocd/token"));
  if (!argoToken) throw new Error("ARGOCD_TOKEN or ARGOCD_TOKEN_FILE not provided");

  const k8sApi = env("K8S_API", "https://kubernetes.default.svc");
  const k8sToken = readFileSafe(env("K8S_TOKEN_FILE", "/var/run/secrets/kubernetes.io/serviceaccount/token"));
  const k8sCa = readFileSafe(env("K8S_CA_FILE", "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"));
  if (!k8sToken) throw new Error("K8s service account token not found");

  const argoAgent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });
  const filter = projectFilter();

  const list = await getJson<ArgoApplicationList>(
    `${argoServer}/api/v1/applications`,
    argoToken,
    argoAgent,
  );

  // Gather the set of namespaces referenced by managed resources so we can batch
  // Kubernetes list calls.
  const namespaces = new Set<string>();
  for (const app of list.items ?? []) {
    const destNs = app.spec?.destination?.namespace;
    if (destNs) namespaces.add(destNs);
    for (const r of app.status?.resources ?? []) {
      if (r.namespace) namespaces.add(r.namespace);
    }
  }

  const ca = k8sCa ? Buffer.from(k8sCa) : Buffer.alloc(0);
  const lookup = await readK8sLookup(namespaces, k8sApi, k8sToken, ca);

  const applications: RawApplication[] = [];
  for (const app of list.items ?? []) {
    const name = app.metadata?.name;
    if (!name) continue;
    if (filter && app.spec?.project && !filter.has(app.spec.project)) continue;

    const resources = app.status?.resources ?? [];
    const workloads: RawWorkload[] = [];
    const services: RawService[] = [];

    for (const r of resources) {
      const kind = WORKLOAD_KINDS.get(r.kind ?? "");
      const ns = r.namespace ?? app.spec?.destination?.namespace ?? "";
      const key = `${ns}/${r.name ?? ""}`;
      if (kind && r.name) {
        const rec = lookup.workloads.get(key);
        const desired = rec?.desired ?? 0;
        const ready = rec?.ready ?? 0;
        const health = r.health?.status
          ? mapHealth(r.health.status)
          : healthFromReplicas(desired, ready);
        workloads.push({
          name: r.name,
          kind,
          desiredReplicas: desired,
          readyReplicas: ready,
          health,
        });
      } else if (r.kind === "Service" && r.name) {
        const svc = lookup.services.get(key);
        if (svc) {
          services.push({ name: r.name, port: svc.port, protocol: svc.protocol });
        }
      }
    }

    const sync = mapSync(app.status?.sync?.status);
    const health = mapHealth(app.status?.health?.status);
    const updatedAt =
      app.status?.operationState?.finishedAt ??
      app.status?.reconciledAt ??
      app.metadata?.creationTimestamp ??
      new Date().toISOString();
    const opMessage = app.status?.operationState?.message?.trim();
    const readyTotal = workloads.reduce((s, w) => s + w.readyReplicas, 0);
    const desiredTotal = workloads.reduce((s, w) => s + w.desiredReplicas, 0);
    const statusSummary = opMessage
      ? opMessage
      : `${readyTotal}/${desiredTotal} replicas ready; sync ${app.status?.sync?.status ?? "Unknown"}.`;

    applications.push({
      name,
      health,
      sync,
      workloads,
      services,
      statusSummary,
      updatedAt,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    applications,
  };
};
