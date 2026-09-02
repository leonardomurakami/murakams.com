import { StatusLabel } from "@/components/primitives";
import type { InfraFetchStatus } from "@/infra/api";
import type { HealthState, PublicInfrastructureSnapshot, SyncState } from "@/infra/public-schema";
import {
  formatUtcTimestamp,
  healthCopy,
  syncCopy,
  type InfraApplicationView,
  type ReadinessView,
} from "@/features/infra/infra-selectors";

const healthLabel: Record<HealthState, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  unhealthy: "Unhealthy",
  unknown: "Unknown",
};

const syncLabel: Record<SyncState, string> = {
  synced: "Synced",
  out_of_sync: "Out of sync",
  unknown: "Unknown",
};

const healthExplanation: Record<HealthState, string> = {
  healthy: "Running normally.",
  degraded: "Running, but something needs attention.",
  unhealthy: "Not running correctly right now.",
  unknown: "Status couldn't be determined.",
};

const healthSignalClass: Record<HealthState, string> = {
  healthy: "border-[#173d8f] bg-[#173d8f] text-[#fffaf0]",
  degraded: "border-[#173d8f] bg-[#f4eddf] text-[#173d8f]",
  unhealthy: "border-[#a83232] bg-[#a83232] text-white",
  unknown: "border-[#5f5a50] bg-[#5f5a50] text-white",
};

const syncSignalClass: Record<SyncState, string> = {
  synced: "border-[#173d8f] bg-[#e0e7f3] text-[#173d8f]",
  out_of_sync: "border-[#173d8f] bg-[#f4eddf] text-[#173d8f]",
  unknown: "border-[#5f5a50] bg-[#ede6d8] text-[#3e3a33]",
};

const fetchStateCopy: Record<InfraFetchStatus, string> = {
  fresh: "Snapshot available",
  stale: "Cached snapshot",
  degraded: "Source error",
};

export function InfraSummary({ snapshot }: { snapshot: PublicInfrastructureSnapshot }) {
  const { summary } = snapshot;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
      <span className="text-foreground">{summary.total} applications</span>
      <StatusLabel status="healthy" label={`${summary.healthy} healthy`} />
      {summary.degraded > 0 && (
        <StatusLabel status="degraded" label={`${summary.degraded} degraded`} />
      )}
      {summary.unhealthy > 0 && (
        <StatusLabel status="unhealthy" label={`${summary.unhealthy} unhealthy`} />
      )}
      {summary.unknown > 0 && <StatusLabel status="unknown" label={`${summary.unknown} unknown`} />}
    </div>
  );
}

function HealthSignal({ health }: { health: HealthState }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-colors motion-reduce:transition-none ${healthSignalClass[health]}`}
    >
      {healthCopy[health].label}
    </span>
  );
}

function SyncSignal({ sync }: { sync: SyncState }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] transition-colors motion-reduce:transition-none ${syncSignalClass[sync]}`}
    >
      {syncCopy[sync].label}
    </span>
  );
}

function ReadinessGauge({
  readiness,
  unhealthy,
}: {
  readiness: ReadinessView;
  unhealthy: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-sm font-bold text-[#202018]">{readiness.label}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
          Workload readiness
        </span>
      </div>
      {readiness.desired > 0 && (
        <div
          className="mt-3 h-3 border border-[#827765] bg-[#d2c9b8] p-0.5"
          role="progressbar"
          aria-label="Ready workload replicas"
          aria-valuemin={0}
          aria-valuemax={readiness.desired}
          aria-valuenow={readiness.ready}
          aria-valuetext={readiness.label}
        >
          <div
            className={`h-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${unhealthy ? "bg-[#a83232]" : "bg-[#173d8f]"}`}
            style={{ width: `${readiness.percentage}%` }}
          />
        </div>
      )}
      <p className="mt-3 text-sm leading-6 text-[#514b40]">{readiness.explanation}</p>
    </div>
  );
}

export function SnapshotSummary({
  snapshot,
  fetchStatus,
  fetchNote,
}: {
  snapshot: PublicInfrastructureSnapshot;
  fetchStatus: InfraFetchStatus;
  fetchNote: string;
}) {
  const { summary } = snapshot;

  return (
    <section
      className="border-2 border-[#817765] bg-[#f4eddf]"
      aria-labelledby="snapshot-summary-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#817765] bg-[#173d8f] px-4 py-3 text-[#fffaf0] sm:px-6">
        <h2 id="snapshot-summary-heading" className="text-base font-bold tracking-tight">
          Snapshot summary
        </h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em]">
          {fetchStateCopy[fetchStatus]}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <dl className="flex flex-1 flex-wrap divide-x divide-[#b8ad98] border-b border-[#b8ad98] lg:border-r lg:border-b-0">
          <div className="min-w-28 flex-1 px-4 py-4 sm:px-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
              Applications
            </dt>
            <dd className="mt-1 text-2xl font-bold text-[#173d8f]">{summary.total}</dd>
          </div>
          <div className="min-w-28 flex-1 px-4 py-4 sm:px-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
              Operating normally
            </dt>
            <dd className="mt-1 text-2xl font-bold text-[#173d8f]">{summary.healthy}</dd>
          </div>
          <div className="min-w-28 flex-1 px-4 py-4 sm:px-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
              Needs attention
            </dt>
            <dd className="mt-1 text-2xl font-bold text-[#173d8f]">{summary.degraded}</dd>
          </div>
          <div className="min-w-28 flex-1 px-4 py-4 sm:px-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
              Unavailable
            </dt>
            <dd
              className={`mt-1 text-2xl font-bold ${summary.unhealthy > 0 ? "text-[#a83232]" : "text-[#173d8f]"}`}
            >
              {summary.unhealthy}
            </dd>
          </div>
          <div className="min-w-28 flex-1 px-4 py-4 sm:px-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
              Not determined
            </dt>
            <dd className="mt-1 text-2xl font-bold text-[#173d8f]">{summary.unknown}</dd>
          </div>
        </dl>
        <div className="flex min-w-64 flex-col justify-center px-4 py-4 sm:px-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
            Generated
          </p>
          <time
            className="mt-1 font-mono text-sm font-bold text-[#202018]"
            dateTime={snapshot.generatedAt}
          >
            {formatUtcTimestamp(snapshot.generatedAt)}
          </time>
          <p className="mt-2 text-xs leading-5 text-[#625a4c]">
            Read-only published data. No activity is simulated between snapshots.
          </p>
        </div>
      </div>
      {fetchNote && (
        <p
          className={`border-t border-[#b8ad98] px-4 py-3 text-sm sm:px-6 ${fetchStatus === "degraded" ? "text-[#a83232]" : "text-[#514b40]"}`}
        >
          {fetchNote}
        </p>
      )}
    </section>
  );
}

export function ApplicationTopology({
  applications,
  selectedId,
  onSelect,
}: {
  applications: readonly InfraApplicationView[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="bg-[#e3dac9] p-4 sm:p-5" aria-labelledby="application-topology-heading">
      <h2
        id="application-topology-heading"
        className="text-xl font-bold tracking-tight text-[#202018]"
      >
        Application topology
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#514b40]">
        Choose an application to inspect its published workloads and services.
      </p>
      <ol className="mt-5 space-y-5">
        {applications.map((application, index) => {
          const selected = application.id === selectedId;
          return (
            <li key={application.id} className="border-l border-[#827765] pl-3">
              <button
                type="button"
                onClick={() => onSelect(application.id)}
                aria-pressed={selected}
                aria-controls="application-detail"
                className={`relative w-full border-2 px-3 py-3 text-left transition-colors motion-reduce:transition-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#f2c84b] ${
                  selected
                    ? "border-[#173d8f] bg-[#173d8f] text-[#fffaf0] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#f2c84b]"
                    : "border-[#a89f8d] bg-[#f4eddf] text-[#202018] hover:border-[#173d8f] hover:bg-[#eee7d8]"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span
                      className={`block font-mono text-[10px] uppercase tracking-[0.1em] ${selected ? "text-[#dbe5f7]" : "text-[#625a4c]"}`}
                    >
                      Application {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong className="mt-1 block truncate text-sm">{application.name}</strong>
                  </span>
                  <span className="flex-none font-mono text-[10px] font-bold uppercase tracking-[0.08em]">
                    {application.healthLabel}
                  </span>
                </span>
                <span
                  className={`mt-2 block font-mono text-[11px] ${selected ? "text-[#fffaf0]" : "text-[#514b40]"}`}
                >
                  {application.readiness.label} / {application.syncLabel}
                </span>
              </button>
              <ul className="ml-4 border-l border-dashed border-[#9a907e] pl-4">
                {application.workloads.map((workload) => (
                  <li
                    key={`${workload.kind}-${workload.name}`}
                    className="border-b border-[#c1b7a4] py-2.5 last:border-b-0"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#625a4c]">
                      Workload
                    </span>
                    <span className="mt-0.5 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-[#302d27]">
                      <span>{workload.name}</span>
                      <span className="font-mono">{workload.readiness.label}</span>
                    </span>
                  </li>
                ))}
                {application.services.map((service) => (
                  <li
                    key={`${service.name}-${service.port}-${service.protocol}`}
                    className="border-b border-[#c1b7a4] py-2.5 last:border-b-0"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#625a4c]">
                      Service
                    </span>
                    <span className="mt-0.5 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-[#302d27]">
                      <span>{service.name}</span>
                      <span className="font-mono">
                        {service.protocol} / {service.port}
                      </span>
                    </span>
                  </li>
                ))}
                {application.services.length === 0 && (
                  <li className="py-2.5 font-mono text-[11px] text-[#625a4c]">
                    No public service labels
                  </li>
                )}
              </ul>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ApplicationDetail({ application }: { application: InfraApplicationView }) {
  return (
    <section
      id="application-detail"
      className="p-5 sm:p-7 lg:p-9"
      aria-labelledby="application-detail-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-5 border-b-2 border-[#817765] pb-6">
        <div className="min-w-0">
          <h2
            id="application-detail-heading"
            className="break-words text-3xl font-bold tracking-[-0.025em] text-[#202018] sm:text-4xl"
          >
            {application.name}
          </h2>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#625a4c]">
            Selected application / public fields only
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <HealthSignal health={application.health} />
          <SyncSignal sync={application.sync} />
        </div>
      </div>

      {application.statusSummary && (
        <p className="border-b border-[#b8ad98] py-5 text-base leading-7 text-[#37332c]">
          {application.statusSummary}
        </p>
      )}

      <dl className="border-b border-[#b8ad98] sm:grid sm:grid-cols-2 sm:divide-x sm:divide-[#b8ad98]">
        <div className="py-5 sm:pr-6">
          <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#625a4c]">
            Health in plain language
          </dt>
          <dd className="mt-2 text-sm leading-6 text-[#37332c]">{application.healthExplanation}</dd>
        </div>
        <div className="border-t border-[#b8ad98] py-5 sm:border-t-0 sm:pl-6">
          <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#625a4c]">
            Configuration in plain language
          </dt>
          <dd className="mt-2 text-sm leading-6 text-[#37332c]">{application.syncExplanation}</dd>
        </div>
      </dl>

      <div className="border-b border-[#b8ad98] py-6">
        <ReadinessGauge
          readiness={application.readiness}
          unhealthy={application.health === "unhealthy"}
        />
      </div>

      <section className="border-b border-[#b8ad98] py-6" aria-labelledby="workloads-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="workloads-heading" className="text-xl font-bold tracking-tight text-[#202018]">
            Workloads
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
            {application.workloads.length} published
          </p>
        </div>
        <ul className="mt-4 divide-y divide-[#b8ad98] border-y border-[#b8ad98]">
          {application.workloads.map((workload) => (
            <li key={`${workload.kind}-${workload.name}`} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-mono text-sm font-bold text-[#202018]">{workload.name}</h4>
                  <p className="mt-1 text-xs text-[#625a4c]">{workload.kindLabel}</p>
                </div>
                <HealthSignal health={workload.health} />
              </div>
              <div className="mt-3 sm:grid sm:grid-cols-[minmax(10rem,0.45fr)_minmax(0,1fr)] sm:gap-5">
                <p className="font-mono text-xs font-bold text-[#173d8f]">
                  {workload.readiness.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#514b40] sm:mt-0">
                  {workload.readiness.explanation} {workload.healthExplanation}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-6" aria-labelledby="services-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="services-heading" className="text-xl font-bold tracking-tight text-[#202018]">
            Services
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
            {application.services.length} public{" "}
            {application.services.length === 1 ? "label" : "labels"}
          </p>
        </div>
        {application.services.length > 0 ? (
          <div className="mt-4 overflow-x-auto border-y border-[#b8ad98]">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[#e3dac9] font-mono text-[11px] uppercase tracking-[0.08em] text-[#514b40]">
                <tr>
                  <th scope="col" className="px-3 py-2 font-bold">
                    Public label
                  </th>
                  <th scope="col" className="px-3 py-2 font-bold">
                    Protocol
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-bold">
                    Port
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1b7a4]">
                {application.services.map((service) => (
                  <tr key={`${service.name}-${service.port}-${service.protocol}`}>
                    <th scope="row" className="px-3 py-3 font-medium text-[#202018]">
                      {service.name}
                    </th>
                    <td className="px-3 py-3 font-mono text-xs text-[#514b40]">
                      {service.protocol}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-xs font-bold text-[#173d8f]">
                      {service.port}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 border-y border-[#b8ad98] py-4 text-sm leading-6 text-[#514b40]">
            No public service labels are listed for this application. This does not describe private
            network topology.
          </p>
        )}
      </section>

      <p className="border-t border-[#b8ad98] pt-4 text-xs leading-5 text-[#625a4c]">
        Application update recorded{" "}
        <time dateTime={application.updatedAt}>{formatUtcTimestamp(application.updatedAt)}</time>.
      </p>
    </section>
  );
}

const withheldClasses = [
  "Secrets, credentials, tokens, and environment values",
  "Internal IP addresses, node names, pod names, and private hostnames",
  "Kubernetes manifests, ConfigMap contents, and container image references",
  "Annotations, arbitrary API objects, and raw Kubernetes or Argo CD responses",
] as const;

const publicClasses = [
  "Application names and status summaries",
  "Health and configuration match states",
  "Workload kinds and desired versus ready replica counts",
  "Service labels, ports, and protocols",
  "Snapshot generation and application update times",
] as const;

export function SanitizationBoundary() {
  return (
    <section
      className="border-2 border-[#817765] bg-[#f4eddf]"
      aria-labelledby="sanitization-heading"
    >
      <div className="border-b border-[#817765] bg-[#173d8f] px-5 py-5 text-[#fffaf0] sm:px-7">
        <h2 id="sanitization-heading" className="text-2xl font-bold tracking-tight">
          The public boundary
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#e5ecf8]">
          This monitor explains the data boundary without showing or inferring the private
          infrastructure behind it.
        </p>
      </div>
      <ol className="flex flex-col lg:flex-row">
        <li className="flex-1 border-b border-[#b8ad98] p-5 lg:border-r lg:border-b-0 sm:p-7">
          <span className="font-mono text-xs font-bold text-[#173d8f]">01</span>
          <h3 className="mt-2 text-lg font-bold text-[#202018]">Private collection</h3>
          <p className="mt-2 text-sm leading-6 text-[#514b40]">
            Source responses remain inside the private environment. This view receives no private
            topology.
          </p>
        </li>
        <li className="flex-1 border-b border-dashed border-[#173d8f] bg-[#e3dac9] p-5 lg:border-r lg:border-b-0 sm:p-7">
          <span className="font-mono text-xs font-bold text-[#173d8f]">02</span>
          <h3 className="mt-2 text-lg font-bold text-[#202018]">Explicit allowlist</h3>
          <p className="mt-2 text-sm leading-6 text-[#514b40]">
            A sanitizer selects approved public fields. Every other data class is withheld by
            default.
          </p>
        </li>
        <li className="flex-1 p-5 sm:p-7">
          <span className="font-mono text-xs font-bold text-[#173d8f]">03</span>
          <h3 className="mt-2 text-lg font-bold text-[#202018]">Public snapshot</h3>
          <p className="mt-2 text-sm leading-6 text-[#514b40]">
            The API and cache layer deliver the small public model used by this page and nothing
            more.
          </p>
        </li>
      </ol>
      <div className="grid border-t border-[#817765] lg:grid-cols-2 lg:divide-x lg:divide-[#817765]">
        <div className="p-5 sm:p-7">
          <h3 className="text-lg font-bold text-[#202018]">Fields permitted here</h3>
          <ul className="mt-3 divide-y divide-[#c1b7a4] border-y border-[#c1b7a4]">
            {publicClasses.map((item) => (
              <li key={item} className="py-2.5 text-sm leading-6 text-[#514b40]">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <details className="group p-5 sm:p-7" open>
          <summary className="cursor-pointer text-lg font-bold text-[#202018] marker:text-[#173d8f] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#f2c84b]">
            Data classes withheld
          </summary>
          <p className="mt-2 text-sm leading-6 text-[#514b40]">
            These classes are stripped before the public model and never reach this interface.
          </p>
          <ul className="mt-3 divide-y divide-[#c1b7a4] border-y border-[#c1b7a4]">
            {withheldClasses.map((item) => (
              <li key={item} className="py-2.5 text-sm leading-6 text-[#514b40]">
                {item}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}

export { healthLabel, syncLabel, healthExplanation };
