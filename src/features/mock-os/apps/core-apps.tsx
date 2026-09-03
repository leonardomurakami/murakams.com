"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useInfraSnapshot } from "@/features/infra/use-infra-snapshot";
import {
  selectApplication,
  selectInfrastructureApplications,
} from "@/features/infra/infra-selectors";
import { buildMailtoHref } from "@/features/contact/mailto";
import { getProjectBySlug, projects } from "@/content/projects/projects";
import { getPlaygroundBySlug, getPlaygroundIframePolicy } from "@/content/playground/registry";
import { resume } from "@/content/resume/resume";
import { usePlaygroundCatalog } from "@/features/playground/use-playground-catalog";
import { siteConfig } from "@/design/site-config";
import { useMockOsDesktop } from "../desktop-context";
import { MockOsIcon } from "../icons";
import { useWindowManager } from "../window-manager/adapter";
import { AppEmpty, AppError, AppLoading } from "./app-states";
import styles from "../mock-os.module.css";

function AppButton({
  children,
  primary = false,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.appButton} ${primary ? styles.appButtonPrimary : ""}`}
    >
      {children}
    </button>
  );
}

export function WelcomeApp() {
  const desktop = useMockOsDesktop();
  const { snapshot } = useInfraSnapshot();
  const catalog = usePlaygroundCatalog();

  return (
    <div className={`${styles.appSurface} ${styles.welcome}`}>
      <div className={styles.welcomeMain}>
        <p className={styles.appLabel}>Personal engineering workstation</p>
        <h1 className={styles.welcomeTitle}>Reliable systems, built to stay calm.</h1>
        <p className={styles.welcomeCopy}>
          I&rsquo;m {siteConfig.author.name}, an SRE and software engineer working on platform
          reliability, declarative infrastructure, observability, and the tooling that lets teams
          move without breaking production. MKS/98 is the filing cabinet for my projects,
          experiments, infrastructure, and career so far.
        </p>
        <div className={styles.appActions}>
          <AppButton primary onClick={() => desktop.openApp("projects")}>
            Browse projects
          </AppButton>
          <AppButton onClick={() => desktop.openApp("resume")}>Read resume</AppButton>
          <AppButton onClick={() => desktop.openApp("mail")}>Send mail</AppButton>
        </div>
      </div>
      <aside className={styles.welcomeSide} aria-label="Workstation status">
        <p className={styles.appLabel}>Workbench inventory</p>
        <div className={styles.statusRows}>
          <div className={styles.statusRow}>
            <span>Applications</span>
            <strong>{snapshot.summary.total}</strong>
          </div>
          <div className={styles.statusRow}>
            <span>Healthy</span>
            <span className="inline-flex items-center gap-2">
              <span className={styles.statusLight} />
              {snapshot.summary.healthy}
            </span>
          </div>
          <div className={styles.statusRow}>
            <span>Project files</span>
            <strong>{projects.length}</strong>
          </div>
          <div className={styles.statusRow}>
            <span>Experiments</span>
            <strong>
              {catalog.status === "loading" || catalog.status === "unavailable"
                ? "—"
                : catalog.entries.length}
            </strong>
          </div>
        </div>
        <p className="mt-8 text-sm leading-6 text-[#514b40]">
          Select a tool from the desktop or use the MKS menu. Every application maps to a canonical
          web route.
        </p>
        <button
          type="button"
          onClick={() => desktop.openApp("infra")}
          className="mt-5 font-mono text-xs font-bold text-[#173d8f] underline underline-offset-4"
        >
          Inspect system monitor
        </button>
      </aside>
    </div>
  );
}

export function ErrorApp({ slug }: { windowId?: string; slug?: string }) {
  const desktop = useMockOsDesktop();
  return (
    <AppError
      title="Route not registered"
      detail={`MKS/98 could not map ${slug ?? "this address"} to an installed application.`}
      action={
        <AppButton primary onClick={() => desktop.openApp("welcome")}>
          Open Welcome
        </AppButton>
      }
    />
  );
}

export function ProjectsApp() {
  const desktop = useMockOsDesktop();
  return (
    <div className={`${styles.appSurface} p-7 sm:p-9`}>
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#b8ad98] pb-6">
        <div>
          <p className={styles.appLabel}>Project folder</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.025em]">Engineering projects</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#514b40]">
            Open a project file to read the full case study.
          </p>
        </div>
        <AppButton primary onClick={() => desktop.openApp("programs")}>
          Open programs
        </AppButton>
      </div>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <button
              type="button"
              onClick={() => desktop.openProject(project.slug)}
              className="flex w-full items-center gap-4 border border-[#aaa08c] bg-[#e6dece] p-3 text-left hover:bg-[#f2c84b] focus-visible:outline-2 focus-visible:outline-[#173d8f]"
            >
              <span className="grid h-11 w-11 flex-none place-items-center border-2 border-[#2c2a24] bg-[#273b64] font-mono text-xs font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-sm">{project.title}</strong>
                <span className="mt-1 block truncate font-mono text-[11px] uppercase tracking-[0.08em] text-[#625a4c]">
                  {project.status} · {project.technologies.slice(0, 2).join(" / ")}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const healthColor = {
  healthy: "#3f8f52",
  degraded: "#c18a2d",
  unhealthy: "#a83232",
  unknown: "#6f6758",
} as const;

type MonitorFilter = "all" | "healthy" | "attention";
type MonitorPanel = "overview" | "workloads" | "services";

export function SystemMonitorApp() {
  const { snapshot, status, note } = useInfraSnapshot();
  const applications = useMemo(() => selectInfrastructureApplications(snapshot), [snapshot]);
  const [selectedId, setSelectedId] = useState(applications[0]?.id ?? "");
  const [filter, setFilter] = useState<MonitorFilter>("all");
  const [panel, setPanel] = useState<MonitorPanel>("overview");
  const visibleApplications = applications.filter((application) => {
    if (filter === "healthy") return application.health === "healthy";
    if (filter === "attention") return application.health !== "healthy";
    return true;
  });
  const selected =
    selectApplication(visibleApplications, selectedId) ??
    selectApplication(applications, selectedId);

  function selectFilter(nextFilter: MonitorFilter) {
    setFilter(nextFilter);
    const nextApplications = applications.filter((application) => {
      if (nextFilter === "healthy") return application.health === "healthy";
      if (nextFilter === "attention") return application.health !== "healthy";
      return true;
    });
    if (!nextApplications.some((application) => application.id === selectedId)) {
      setSelectedId(nextApplications[0]?.id ?? "");
    }
  }

  return (
    <div className={`${styles.appSurface} grid h-full grid-rows-[auto_auto_minmax(0,1fr)]`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#a89f8d] bg-[#ded6c7] px-4 py-2.5 font-mono text-[11px]">
        <span>PUBLIC CLUSTER / READ ONLY</span>
        <span>
          snapshot {status} · {new Date(snapshot.generatedAt).toLocaleString()}
        </span>
      </div>
      <div className="grid grid-cols-3 border-b border-[#a89f8d] bg-[#e8e0d1]">
        {(
          [
            ["all", "Applications", snapshot.summary.total],
            ["healthy", "Healthy", snapshot.summary.healthy],
            [
              "attention",
              "Attention",
              snapshot.summary.degraded + snapshot.summary.unhealthy + snapshot.summary.unknown,
            ],
          ] as const
        ).map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            onClick={() => selectFilter(value)}
            aria-pressed={filter === value}
            className="flex min-h-12 items-center justify-between border-r border-[#a89f8d] px-4 text-left last:border-r-0 hover:bg-[#f2c84b] aria-pressed:bg-[#173d8f] aria-pressed:text-white"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.08em]">{label}</span>
            <strong className="text-lg">{count}</strong>
          </button>
        ))}
      </div>
      <div className="grid min-h-0 grid-cols-[minmax(210px,0.42fr)_minmax(0,1fr)] max-sm:grid-cols-1 max-sm:grid-rows-[minmax(150px,0.4fr)_minmax(0,1fr)]">
        <nav
          className="overflow-auto border-r border-[#a89f8d] bg-[#d5ccbc] p-3 max-sm:border-r-0 max-sm:border-b"
          aria-label="Published applications"
        >
          <p className={`${styles.appLabel} px-2 pb-2`}>Application topology</p>
          <div className="space-y-2">
            {visibleApplications.map((application, index) => (
              <button
                key={application.id}
                type="button"
                onClick={() => {
                  setSelectedId(application.id);
                  setPanel("overview");
                }}
                aria-pressed={selected?.id === application.id}
                className="w-full border border-[#aaa08c] bg-[#eee7d8] p-2.5 text-left hover:border-[#173d8f] aria-pressed:border-[#173d8f] aria-pressed:bg-[#173d8f] aria-pressed:text-white"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 flex-none rounded-full border border-[#332f28]"
                    style={{ background: healthColor[application.health] }}
                  />
                  <strong className="min-w-0 flex-1 truncate font-mono text-xs">
                    {String(index + 1).padStart(2, "0")} / {application.name}
                  </strong>
                </span>
                <span className="mt-2 block h-1.5 bg-[#c6bcaa]">
                  <span
                    className="block h-full bg-[#f2c84b] transition-[width] motion-reduce:transition-none"
                    style={{ width: `${application.readiness.percentage}%` }}
                  />
                </span>
                <span className="mt-1.5 flex justify-between gap-2 font-mono text-[10px]">
                  <span>{application.readiness.label}</span>
                  <span>{application.syncLabel}</span>
                </span>
              </button>
            ))}
            {visibleApplications.length === 0 && (
              <p className="border border-dashed border-[#827765] p-3 text-xs text-[#514b40]">
                No applications match this filter.
              </p>
            )}
          </div>
        </nav>
        {selected && (
          <section className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)]">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#a89f8d] px-5 py-4">
              <div>
                <p className={styles.appLabel}>Selected application</p>
                <h2 className="mt-1 text-2xl font-bold">{selected.name}</h2>
              </div>
              <span
                className="border border-[#332f28] px-2 py-1 font-mono text-[10px] font-bold uppercase"
                style={{ background: healthColor[selected.health] }}
              >
                {selected.healthLabel}
              </span>
            </header>
            <div className="flex border-b border-[#a89f8d] bg-[#ded6c7]" role="tablist">
              {(["overview", "workloads", "services"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={panel === value}
                  onClick={() => setPanel(value)}
                  className="min-h-9 border-r border-[#a89f8d] px-4 font-mono text-[10px] font-bold uppercase hover:bg-[#f2c84b] aria-selected:bg-[#173d8f] aria-selected:text-white"
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="overflow-auto p-5" role="tabpanel">
              {panel === "overview" && (
                <div className="grid gap-5">
                  <p className="text-sm leading-6 text-[#514b40]">{selected.statusSummary}</p>
                  <div>
                    <div className="flex justify-between font-mono text-xs font-bold">
                      <span>Replica readiness</span>
                      <span>{selected.readiness.label}</span>
                    </div>
                    <div
                      className="mt-2 h-3 border border-[#827765] bg-[#d2c9b8] p-0.5"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={selected.readiness.desired}
                      aria-valuenow={selected.readiness.ready}
                    >
                      <span
                        className="block h-full bg-[#173d8f] transition-[width] motion-reduce:transition-none"
                        style={{ width: `${selected.readiness.percentage}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#625a4c]">
                      {selected.readiness.explanation}
                    </p>
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-y border-[#b8ad98] py-4 text-xs">
                    <dt className="font-mono text-[#625a4c]">Health</dt>
                    <dd>{selected.healthExplanation}</dd>
                    <dt className="font-mono text-[#625a4c]">Configuration</dt>
                    <dd>{selected.syncExplanation}</dd>
                  </dl>
                  <div className="border border-dashed border-[#827765] p-3">
                    <p className={styles.appLabel}>Public boundary</p>
                    <p className="mt-2 text-xs leading-5 text-[#514b40]">
                      Secrets, node names, internal addresses, credentials, and raw API responses
                      are withheld before this snapshot reaches the monitor.
                    </p>
                  </div>
                </div>
              )}
              {panel === "workloads" && (
                <ul className="space-y-3">
                  {selected.workloads.map((workload) => (
                    <li key={workload.name} className="border border-[#a89f8d] bg-[#e8e0d1] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <strong className="font-mono text-xs">{workload.name}</strong>
                          <p className="mt-1 text-[11px] text-[#625a4c]">{workload.kindLabel}</p>
                        </div>
                        <span className="font-mono text-xs font-bold">
                          {workload.readiness.label}
                        </span>
                      </div>
                      <div className="mt-3 h-2 bg-[#c6bcaa]">
                        <span
                          className="block h-full bg-[#173d8f]"
                          style={{ width: `${workload.readiness.percentage}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {panel === "services" &&
                (selected.services.length > 0 ? (
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-[#ded6c7] font-mono uppercase">
                      <tr>
                        <th className="border border-[#a89f8d] p-2">Service</th>
                        <th className="border border-[#a89f8d] p-2">Protocol</th>
                        <th className="border border-[#a89f8d] p-2 text-right">Port</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.services.map((service) => (
                        <tr key={`${service.name}-${service.port}`}>
                          <th className="border border-[#a89f8d] p-2 font-medium">
                            {service.name}
                          </th>
                          <td className="border border-[#a89f8d] p-2 font-mono">
                            {service.protocol}
                          </td>
                          <td className="border border-[#a89f8d] p-2 text-right font-mono">
                            {service.port}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="border border-dashed border-[#827765] p-4 text-sm text-[#514b40]">
                    No public service labels are published for this application.
                  </p>
                ))}
              {note && <p className="mt-4 text-sm text-[#a83232]">{note}</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ResumeList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section>
      <h3 className={styles.appLabel}>{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-[#49443b]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ResumeApp() {
  const allTechnologies = useMemo(
    () => Array.from(new Set(resume.entries.flatMap((entry) => entry.technologies))).sort(),
    [],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [technology, setTechnology] = useState<string | null>(null);
  const selected = resume.entries[selectedIndex];

  return (
    <div
      className={`${styles.appSurface} grid h-full grid-cols-[250px_minmax(0,1fr)] max-sm:grid-cols-1 max-sm:grid-rows-[auto_minmax(0,1fr)]`}
    >
      <aside className="overflow-auto border-r border-[#a89f8d] bg-[#d5ccbc] p-3 max-sm:max-h-48 max-sm:border-r-0 max-sm:border-b">
        <p className={`${styles.appLabel} px-2 py-2`}>Career index</p>
        {resume.entries.map((entry, index) => {
          const matches = !technology || entry.technologies.includes(technology);
          return (
            <button
              key={`${entry.company}-${entry.role}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-pressed={index === selectedIndex}
              className={`w-full px-2 py-2.5 text-left aria-pressed:bg-[#173d8f] aria-pressed:text-white ${matches ? "opacity-100" : "opacity-35"}`}
            >
              <strong className="block text-sm">{entry.role}</strong>
              <span className="mt-1 block font-mono text-[11px]">
                {entry.company} · {entry.startDate}—{entry.endDate}
              </span>
            </button>
          );
        })}
      </aside>
      <section className="overflow-auto p-6 sm:p-9">
        <div className="border-b border-[#b8ad98] pb-5">
          <p className={styles.appLabel}>
            {selected.startDate} — {selected.endDate}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.025em]">{selected.role}</h2>
          <p className="mt-1 text-[#514b40]">
            {selected.company}
            {selected.location ? ` · ${selected.location}` : ""}
          </p>
          {selected.progression && (
            <p className="mt-4 bg-[#e4dccd] p-3 text-sm text-[#514b40]">{selected.progression}</p>
          )}
        </div>
        <div className="mt-6 grid gap-7">
          <ResumeList title="Engineering work" items={selected.engineeringWork} />
          <ResumeList title="Impact" items={selected.impact} />
          <ResumeList title="Responsibilities" items={selected.responsibilities} />
        </div>
        <div className="mt-7">
          <p className={styles.appLabel}>Filter career by tool</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTechnology(null)}
              aria-pressed={!technology}
              className="border border-[#827765] px-2 py-1 font-mono text-[11px] aria-pressed:bg-[#f2c84b]"
            >
              All
            </button>
            {allTechnologies.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTechnology(item)}
                aria-pressed={technology === item}
                className="border border-[#827765] px-2 py-1 font-mono text-[11px] aria-pressed:bg-[#f2c84b]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProgramsApp() {
  const desktop = useMockOsDesktop();
  const catalog = usePlaygroundCatalog();

  if (catalog.status === "loading") return <AppLoading title="Reading Programs folder" />;
  if (catalog.status === "unavailable")
    return (
      <AppError
        title="Programs catalog unavailable"
        detail={catalog.note ?? "MKS/98 could not reach the verified Labs catalog."}
      />
    );
  if (catalog.entries.length === 0)
    return (
      <AppEmpty
        title="No public programs yet"
        detail="The Programs folder is ready, but MKS Labs has not published an experiment yet."
      />
    );

  return (
    <div className={`${styles.appSurface} ${styles.programFolder}`}>
      <header className={styles.programFolderHeader}>
        <div>
          <p className={styles.appLabel}>C:\Programs</p>
          <h2>Programs</h2>
        </div>
        <p>
          {catalog.entries.length} executables{catalog.status === "stale" ? " · cached" : ""}
        </p>
      </header>
      {catalog.status === "stale" && (
        <p className="border-b border-[#a89f8d] bg-[#f2c84b] px-4 py-2 text-xs" role="status">
          {catalog.note}
        </p>
      )}
      <ul className={styles.programGrid}>
        {catalog.entries.map((entry) => (
          <li key={entry.slug}>
            <button
              type="button"
              className={styles.programExecutable}
              onClick={() => desktop.openExperiment(entry.slug)}
              aria-label={`Run ${entry.title}`}
            >
              <MockOsIcon name="executable" size={48} />
              <span>
                <strong>{entry.slug}.exe</strong>
                <small>{entry.title}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExperimentMaximizer({ windowId }: { windowId: string }) {
  const { maximizeWindow } = useWindowManager();

  useEffect(() => {
    maximizeWindow(windowId);
  }, [maximizeWindow, windowId]);

  return null;
}

export function ExperimentApp({
  windowId,
  slug,
  mobileView = false,
}: {
  windowId: string;
  slug?: string;
  mobileView?: boolean;
}) {
  const catalog = usePlaygroundCatalog();
  const entry = slug ? getPlaygroundBySlug(catalog.entries, slug) : undefined;

  if (catalog.status === "loading") return <AppLoading title="Loading experiment" />;
  if (!entry && catalog.status === "unavailable")
    return (
      <AppError
        title="Programs catalog unavailable"
        detail={catalog.note ?? "MKS/98 could not verify this executable with MKS Labs."}
      />
    );
  if (!entry)
    return (
      <AppError title="Program not found" detail="This executable is not registered in MKS/98." />
    );

  const iframePolicy = getPlaygroundIframePolicy(entry.capabilities);

  return (
    <div className={`${styles.appSurface} grid h-full grid-rows-[auto_minmax(0,1fr)]`}>
      {entry.presentation === "fullscreen" && !mobileView && (
        <ExperimentMaximizer windowId={windowId} />
      )}
      <div className="flex items-center justify-between gap-4 border-b border-[#a89f8d] bg-[#d5ccbc] px-4 py-2">
        <span className="font-mono text-xs">
          {entry.host}
          {catalog.status === "stale" ? " · cached catalog" : ""}
        </span>
        <a
          href={entry.standaloneUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-xs font-bold text-[#173d8f] underline underline-offset-4"
        >
          Open separately
        </a>
      </div>
      <iframe
        src={entry.embedUrl}
        title={entry.title}
        className="h-full w-full bg-white"
        loading="lazy"
        sandbox={iframePolicy.sandbox}
        allow={iframePolicy.allow}
        allowFullScreen={iframePolicy.allowFullScreen}
      />
    </div>
  );
}

export function MailApp() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const mailto = buildMailtoHref({ recipient: siteConfig.author.email, subject, body });
  return (
    <form
      className={`${styles.appSurface} grid h-full grid-rows-[auto_auto_minmax(0,1fr)_auto]`}
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = mailto;
      }}
    >
      <div className="flex items-center gap-3 border-b border-[#a89f8d] bg-[#d5ccbc] p-3">
        <button type="submit" className={`${styles.appButton} ${styles.appButtonPrimary}`}>
          Open email client
        </button>
        <span className="text-xs text-[#625a4c]">
          MKS/98 hands this draft to your email application.
        </span>
      </div>
      <div className="grid grid-cols-[80px_1fr] items-center border-b border-[#b8ad98] bg-[#eee7d8] text-sm">
        <label className="px-4 py-2 font-mono text-xs" htmlFor="mks-mail-to">
          To
        </label>
        <input
          id="mks-mail-to"
          value={siteConfig.author.email}
          readOnly
          className="border-l border-[#b8ad98] bg-white/45 px-3 py-2"
        />
        <label className="px-4 py-2 font-mono text-xs" htmlFor="mks-mail-subject">
          Subject
        </label>
        <input
          id="mks-mail-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="border-l border-t border-[#b8ad98] bg-white/65 px-3 py-2 outline-none focus:bg-white"
        />
      </div>
      <textarea
        aria-label="Message body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Write a note. Nothing is sent or stored by this site."
        className="min-h-48 resize-none bg-[#faf5ea] p-5 leading-7 outline-none"
      />
      <div className="flex flex-wrap gap-4 border-t border-[#b8ad98] bg-[#ded6c7] px-4 py-3 font-mono text-xs">
        <a
          href={siteConfig.social[0].href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#173d8f] underline underline-offset-4"
        >
          GitHub
        </a>
        <a
          href={siteConfig.social[1].href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#173d8f] underline underline-offset-4"
        >
          LinkedIn
        </a>
      </div>
    </form>
  );
}

export function ProjectApp({ slug }: { windowId: string; slug?: string }) {
  const project = slug ? getProjectBySlug(slug) : undefined;
  const desktop = useMockOsDesktop();
  if (!project)
    return (
      <AppError
        title="Project not found"
        detail="The requested project is not registered."
        action={
          <AppButton primary onClick={() => desktop.openApp("projects")}>
            Browse projects
          </AppButton>
        }
      />
    );

  const visual = project.visualMaterial[0];
  return (
    <article className={`${styles.appSurface} h-full overflow-auto`}>
      <header className="border-b border-[#a89f8d] bg-[#ded6c7] px-6 py-7 sm:px-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#625a4c]">
          <span>{project.status}</span>
          <span>{project.technologies.join(" / ")}</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#514b40]">
          {project.shortDescription}
        </p>
        <div className={styles.appActions}>
          <AppButton onClick={() => desktop.openApp("projects")}>Browse all projects</AppButton>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("/") ? undefined : "_blank"}
              rel={link.href.startsWith("/") ? undefined : "noreferrer noopener"}
              className={styles.appButton}
            >
              {link.label}
            </a>
          ))}
        </div>
      </header>
      {visual && (visual.type === "screenshot" || visual.type === "other") && (
        <figure className="mx-auto max-w-5xl px-6 py-9">
          <Image
            src={visual.src}
            alt={visual.alt}
            width={1200}
            height={675}
            className="h-auto w-full"
          />
          {visual.caption && (
            <figcaption className="mt-3 text-sm text-[#625a4c]">{visual.caption}</figcaption>
          )}
        </figure>
      )}
      <div className="mx-auto grid max-w-4xl gap-12 px-6 pb-16 sm:px-10">
        {[
          ["Problem", project.problem],
          ["Architecture", project.architecture],
          ["Implementation", project.implementation],
          ["Challenges", project.challenges],
          ["Decisions & trade-offs", project.tradeoffs],
        ].map(([title, content]) => (
          <section key={title}>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-4 max-w-[70ch] text-base leading-8 text-[#514b40]">{content}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
