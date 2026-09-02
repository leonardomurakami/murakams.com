import type {
  HealthState,
  PublicApplication,
  PublicInfrastructureSnapshot,
  SyncState,
  WorkloadKind,
} from "@/infra/public-schema";

export const healthCopy: Record<HealthState, { label: string; explanation: string }> = {
  healthy: {
    label: "Healthy",
    explanation: "Operating normally based on the published checks.",
  },
  degraded: {
    label: "Needs attention",
    explanation: "Running, but at least one published check needs attention.",
  },
  unhealthy: {
    label: "Unavailable",
    explanation: "Not operating correctly in this published snapshot.",
  },
  unknown: {
    label: "Not determined",
    explanation: "The published checks could not determine a health state.",
  },
};

export const syncCopy: Record<SyncState, { label: string; explanation: string }> = {
  synced: {
    label: "Configuration matched",
    explanation:
      "The declared and running application states matched when this snapshot was generated.",
  },
  out_of_sync: {
    label: "Configuration differs",
    explanation:
      "The declared and running application states did not match when this snapshot was generated.",
  },
  unknown: {
    label: "Match not determined",
    explanation:
      "The snapshot could not determine whether the declared and running states matched.",
  },
};

const workloadKindLabel: Record<WorkloadKind, string> = {
  deployment: "Deployment",
  statefulset: "Stateful set",
  daemonset: "Daemon set",
};

export interface ReadinessView {
  readonly desired: number;
  readonly ready: number;
  readonly unavailable: number;
  readonly percentage: number;
  readonly complete: boolean;
  readonly label: string;
  readonly explanation: string;
}

export interface InfraWorkloadView {
  readonly name: string;
  readonly kind: WorkloadKind;
  readonly kindLabel: string;
  readonly desiredReplicas: number;
  readonly readyReplicas: number;
  readonly health: HealthState;
  readonly healthLabel: string;
  readonly healthExplanation: string;
  readonly readiness: ReadinessView;
}

export interface InfraServiceView {
  readonly name: string;
  readonly port: number;
  readonly protocol: "TCP" | "UDP";
}

export interface InfraApplicationView {
  readonly id: string;
  readonly name: string;
  readonly health: HealthState;
  readonly healthLabel: string;
  readonly healthExplanation: string;
  readonly sync: SyncState;
  readonly syncLabel: string;
  readonly syncExplanation: string;
  readonly statusSummary: string;
  readonly updatedAt: string;
  readonly readiness: ReadinessView;
  readonly workloads: readonly InfraWorkloadView[];
  readonly services: readonly InfraServiceView[];
}

export function describeReadiness(desired: number, ready: number): ReadinessView {
  const unavailable = Math.max(desired - ready, 0);
  const percentage =
    desired > 0 ? Math.min(100, Math.max(0, Math.round((ready / desired) * 100))) : 0;

  if (desired <= 0) {
    return {
      desired,
      ready,
      unavailable,
      percentage,
      complete: false,
      label: "No replicas requested",
      explanation: "This snapshot does not list any requested workload replicas.",
    };
  }

  if (ready >= desired) {
    return {
      desired,
      ready,
      unavailable,
      percentage,
      complete: true,
      label: `${ready} / ${desired} ready`,
      explanation: `All ${desired} requested ${desired === 1 ? "replica is" : "replicas are"} ready to serve work.`,
    };
  }

  if (ready <= 0) {
    return {
      desired,
      ready,
      unavailable,
      percentage,
      complete: false,
      label: `${ready} / ${desired} ready`,
      explanation: `None of the ${desired} requested ${desired === 1 ? "replica is" : "replicas are"} ready to serve work.`,
    };
  }

  return {
    desired,
    ready,
    unavailable,
    percentage,
    complete: false,
    label: `${ready} / ${desired} ready`,
    explanation: `${ready} of ${desired} requested replicas are ready; ${unavailable} ${unavailable === 1 ? "is" : "are"} still waiting.`,
  };
}

function projectApplication(app: PublicApplication): InfraApplicationView {
  const workloads = app.workloads.map((workload) => ({
    name: workload.name,
    kind: workload.kind,
    kindLabel: workloadKindLabel[workload.kind],
    desiredReplicas: workload.desiredReplicas,
    readyReplicas: workload.readyReplicas,
    health: workload.health,
    healthLabel: healthCopy[workload.health].label,
    healthExplanation: healthCopy[workload.health].explanation,
    readiness: describeReadiness(workload.desiredReplicas, workload.readyReplicas),
  }));
  const services = app.services.map((service) => ({
    name: service.name,
    port: service.port,
    protocol: service.protocol,
  }));
  const desired = workloads.reduce((total, workload) => total + workload.desiredReplicas, 0);
  const ready = workloads.reduce((total, workload) => total + workload.readyReplicas, 0);

  return {
    id: app.id,
    name: app.name,
    health: app.health,
    healthLabel: healthCopy[app.health].label,
    healthExplanation: healthCopy[app.health].explanation,
    sync: app.sync,
    syncLabel: syncCopy[app.sync].label,
    syncExplanation: syncCopy[app.sync].explanation,
    statusSummary: app.statusSummary,
    updatedAt: app.updatedAt,
    readiness: describeReadiness(desired, ready),
    workloads,
    services,
  };
}

export function selectInfrastructureApplications(
  snapshot: PublicInfrastructureSnapshot,
): readonly InfraApplicationView[] {
  return snapshot.applications.map(projectApplication);
}

export function selectApplication(
  applications: readonly InfraApplicationView[],
  selectedId: string,
): InfraApplicationView | undefined {
  return applications.find((application) => application.id === selectedId) ?? applications[0];
}

export function formatUtcTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(date);

  return `${formatted} UTC`;
}
