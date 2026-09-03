/**
 * Infra collector publish entrypoint.
 *
 * Runs the live collector, projects the result through the sanitizer, and writes
 * the public snapshot to a Kubernetes ConfigMap in the murakams namespace. The
 * murakams web deployment mounts that ConfigMap and reads it at request time.
 *
 * Exit codes: 0 on success, non-zero on failure (the CronJob records the failed
 * run but does not affect the web deployment; the web pod keeps serving the last
 * mounted snapshot).
 *
 * Environment:
 * - SNAPSHOT_CONFIGMAP:  ConfigMap name (default murakams-infra-snapshot)
 * - SNAPSHOT_NAMESPACE:  ConfigMap namespace (default murakams)
 * - SNAPSHOT_KEY:        data key (default snapshot.json)
 * - K8S_API:             in-cluster API base (default https://kubernetes.default.svc)
 * - K8S_TOKEN_FILE:      SA token (default /var/run/secrets/kubernetes.io/serviceaccount/token)
 * - K8S_CA_FILE:         SA CA (default /var/run/secrets/kubernetes.io/serviceaccount/ca.crt)
 * - ...plus ARGOCD_* / collector env (see src/infra/collector.ts)
 */

import https from "node:https";
import { readFileSync } from "node:fs";
import { collectInfrastructure } from "../src/infra/collector";
import { sanitizeSnapshot } from "../src/infra/sanitizer";

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

function patchConfigMap(
  apiBase: string,
  token: string,
  ca: Buffer,
  namespace: string,
  name: string,
  body: Record<string, unknown>,
): Promise<void> {
  const url = `${apiBase}/api/v1/namespaces/${encodeURIComponent(namespace)}/configmaps/${encodeURIComponent(name)}`;
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "PATCH",
        agent: new https.Agent({ ca }),
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/strategic-merge-patch+json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`PATCH ${url} -> ${res.statusCode}: ${data.slice(0, 300)}`));
          }
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(15000, () => req.destroy(new Error(`PATCH ${url} timed out`)));
    req.write(payload);
    req.end();
  });
}

async function main(): Promise<void> {
  const raw = await collectInfrastructure();
  const snapshot = sanitizeSnapshot(raw);
  const json = JSON.stringify(snapshot);

  const k8sApi = env("K8S_API", "https://kubernetes.default.svc");
  const token = readFileSafe(env("K8S_TOKEN_FILE", "/var/run/secrets/kubernetes.io/serviceaccount/token"));
  const ca = readFileSafe(env("K8S_CA_FILE", "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"));
  if (!token) throw new Error("K8s service account token not found");

  const namespace = env("SNAPSHOT_NAMESPACE", "murakams");
  const configMap = env("SNAPSHOT_CONFIGMAP", "murakams-infra-snapshot");
  const key = env("SNAPSHOT_KEY", "snapshot.json");

  await patchConfigMap(
    k8sApi,
    token,
    ca ? Buffer.from(ca) : Buffer.alloc(0),
    namespace,
    configMap,
    { data: { [key]: json } },
  );

  const summary = snapshot.summary;
  console.error(
    `infra-collector: wrote ${snapshot.applications.length} applications ` +
      `(${summary.healthy} healthy, ${summary.degraded} degraded, ${summary.unhealthy} unhealthy, ${summary.unknown} unknown) ` +
      `to ${namespace}/${configMap} at ${snapshot.generatedAt}`,
  );
}

main().catch((err: unknown) => {
  console.error(`infra-collector: failed: ${(err as Error).message}`);
  process.exit(1);
});
