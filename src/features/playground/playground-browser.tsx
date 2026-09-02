import Link from "next/link";
import type {
  PlaygroundCatalogStatus,
  PlaygroundEntry,
  PlaygroundPresentation,
} from "@/content/playground/schema";
import { getPlaygroundIframePolicy } from "@/content/playground/registry";
import styles from "./playground.module.css";

type Presentation = {
  label: string;
  description: string;
  actionLabel: string;
};

export const playgroundPresentation = {
  embedded: {
    label: "Embedded program",
    description: "Runs inside an isolated page frame",
    actionLabel: "Open embedded program",
  },
  fullscreen: {
    label: "Full-screen program",
    description: "Uses a large, focused player",
    actionLabel: "Open full-screen program",
  },
} satisfies Record<PlaygroundPresentation, Presentation>;

export function getPlaygroundLaunchTarget(entry: PlaygroundEntry) {
  return {
    href: `/playground/${entry.slug}`,
    opensExternalSite: false,
    opensNewTab: false,
  };
}

function ProgramRecord({ entry }: { entry: PlaygroundEntry }) {
  const presentation = playgroundPresentation[entry.presentation];
  const target = getPlaygroundLaunchTarget(entry);

  return (
    <Link className={styles.programLink} href={target.href}>
      <span className={styles.programIdentity}>
        <span className={styles.fileMark} aria-hidden="true" />
        <span>
          <span className={styles.programTitle}>{entry.title}</span>
          <span className={styles.programDescription}>{entry.description}</span>
          <span className={styles.tags} aria-label="Topics">
            {entry.tags.map((tag) => (
              <span className={styles.tag} key={tag}>
                {tag}
              </span>
            ))}
          </span>
        </span>
      </span>
      <span className={styles.mode}>
        <span className={styles.modeName}>{presentation.label}</span>
        <span className={styles.modeDescription}>{presentation.description}</span>
      </span>
      <span className={styles.location}>
        <span className={styles.locationText}>{entry.host}</span>
        <span className={styles.actionText}>{presentation.actionLabel}</span>
      </span>
    </Link>
  );
}

export function PlaygroundBrowser({
  entries,
  status,
  note,
}: {
  entries: readonly PlaygroundEntry[];
  status: PlaygroundCatalogStatus;
  note: string | null;
}) {
  const isEmpty = entries.length === 0;

  return (
    <section className={styles.directory} aria-labelledby="program-directory-title">
      <header className={styles.directoryHeader}>
        <h2 className={styles.directoryTitle} id="program-directory-title">
          Program directory
        </h2>
        <p className={styles.directoryPath}>
          /playground · {entries.length} {entries.length === 1 ? "record" : "records"}
        </p>
      </header>
      {status === "stale" && (
        <p className={styles.catalogStatus} role="status">
          {note ?? "Showing the last verified Labs catalog."}
        </p>
      )}
      {isEmpty ? (
        <div className={styles.notice} role={status === "unavailable" ? "alert" : "status"}>
          <div className={styles.noticeInner}>
            <h3 className={styles.noticeTitle}>
              {status === "unavailable"
                ? "The Labs catalog is temporarily unavailable."
                : "No public experiments yet."}
            </h3>
            <p className={styles.noticeText}>
              {note ??
                "The workbench is ready, but no experiments have been published to MKS Labs yet."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.columnHeader} aria-hidden="true">
            <span>Program file</span>
            <span>Run mode</span>
            <span>Location and action</span>
          </div>
          <ul className={styles.programList}>
            {entries.map((entry) => (
              <li className={styles.programItem} key={entry.slug}>
                <ProgramRecord entry={entry} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function RunnerHeader({ entry, title }: { entry: PlaygroundEntry; title: string }) {
  return (
    <header className={styles.runnerHeader}>
      <div>
        <h2 className={styles.runnerTitle}>{title}</h2>
        <p className={styles.runnerStatus}>
          {playgroundPresentation[entry.presentation].label} · {entry.host}
        </p>
      </div>
      <a
        className={styles.externalAction}
        href={entry.standaloneUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        Open standalone program on MKS Labs in a new tab
      </a>
    </header>
  );
}

export function PlaygroundRunner({ entry }: { entry: PlaygroundEntry }) {
  const isFullscreen = entry.presentation === "fullscreen";
  const iframePolicy = getPlaygroundIframePolicy(entry.capabilities);

  return (
    <section className={styles.runner} aria-label={`${entry.title} player`}>
      <RunnerHeader
        entry={entry}
        title={isFullscreen ? "Full-screen program surface" : "Embedded program surface"}
      />
      <iframe
        src={entry.embedUrl}
        title={`${entry.title} experiment`}
        className={`${styles.frame} ${isFullscreen ? styles.fullscreenFrame : ""}`}
        loading="lazy"
        sandbox={iframePolicy.sandbox}
        allow={iframePolicy.allow}
        allowFullScreen={iframePolicy.allowFullScreen}
      />
    </section>
  );
}
