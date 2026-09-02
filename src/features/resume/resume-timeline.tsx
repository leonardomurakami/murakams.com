"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { ResumeEntry } from "@/content/resume/schema";
import styles from "./resume-timeline.module.css";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type ResumeExplorerState = {
  selectedIndex: number;
  technology: string | null;
};

export type ResumeExplorerAction =
  | { type: "select-role"; index: number }
  | { type: "filter-technology"; technology: string | null };

export function formatResumeDate(value: string): string {
  if (value === "present") return "Present";
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  const monthName = monthNames[monthIndex];
  return monthName ? `${monthName} ${year}` : value;
}

export function formatResumePeriod(start: string, end: string): string {
  return `${formatResumeDate(start)} — ${formatResumeDate(end)}`;
}

export function getResumeTechnologies(entries: readonly ResumeEntry[]): string[] {
  return Array.from(new Set(entries.flatMap((entry) => entry.technologies))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function entryMatchesTechnology(entry: ResumeEntry, technology: string | null): boolean {
  return technology === null || entry.technologies.includes(technology);
}

export function updateResumeExplorer(
  entries: readonly ResumeEntry[],
  state: ResumeExplorerState,
  action: ResumeExplorerAction,
): ResumeExplorerState {
  if (action.type === "select-role") {
    const selectedIndex = Math.min(Math.max(action.index, 0), Math.max(entries.length - 1, 0));
    return { ...state, selectedIndex };
  }

  if (action.technology === null) {
    return { ...state, technology: null };
  }

  const firstMatch = entries.findIndex((entry) => entryMatchesTechnology(entry, action.technology));

  return {
    technology: action.technology,
    selectedIndex: firstMatch >= 0 ? firstMatch : state.selectedIndex,
  };
}

export function getRoleNavigationIndex(
  key: string,
  currentIndex: number,
  roleCount: number,
): number | null {
  if (roleCount <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return roleCount - 1;
  if (key === "ArrowDown" || key === "ArrowRight") {
    return Math.min(currentIndex + 1, roleCount - 1);
  }
  if (key === "ArrowUp" || key === "ArrowLeft") {
    return Math.max(currentIndex - 1, 0);
  }
  return null;
}

function roleId(index: number): string {
  return `resume-role-${index + 1}`;
}

function roleKey(entry: ResumeEntry): string {
  return `${entry.company}-${entry.role}-${entry.startDate}`;
}

export function ResumeTimeline({
  summary,
  entries,
}: {
  summary: string;
  entries: readonly ResumeEntry[];
}) {
  const technologies = useMemo(() => getResumeTechnologies(entries), [entries]);
  const [explorer, setExplorer] = useState<ResumeExplorerState>({
    selectedIndex: 0,
    technology: null,
  });
  const roleButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const roleArticles = useRef<Array<HTMLElement | null>>([]);
  const matchingRoleCount = entries.filter((entry) =>
    entryMatchesTechnology(entry, explorer.technology),
  ).length;

  function revealRole(index: number) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleArticles.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  function selectRole(index: number, moveFocus = false) {
    const next = updateResumeExplorer(entries, explorer, { type: "select-role", index });
    setExplorer(next);
    if (moveFocus) roleButtons.current[next.selectedIndex]?.focus();
    revealRole(next.selectedIndex);
  }

  function filterByTechnology(technology: string | null) {
    const next = updateResumeExplorer(entries, explorer, {
      type: "filter-technology",
      technology,
    });
    setExplorer(next);
    if (technology !== null) revealRole(next.selectedIndex);
  }

  function navigateRoles(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const nextIndex = getRoleNavigationIndex(event.key, currentIndex, entries.length);
    if (nextIndex === null) return;
    event.preventDefault();
    selectRole(nextIndex, true);
  }

  return (
    <article className={styles.page} aria-labelledby="resume-title">
      <header className={styles.intro}>
        <div className={styles.introCopy}>
          <h1 id="resume-title" className={styles.title}>
            A career in progress.
          </h1>
          <p className={styles.summary}>{summary}</p>
          <p className={styles.chronologyNote}>Chronological record, newest role first.</p>
        </div>
        <div className={styles.introSide}>
          <dl className={styles.inventory}>
            <div>
              <dt>Roles</dt>
              <dd>{entries.length}</dd>
            </div>
            <div>
              <dt>Technologies</dt>
              <dd>{technologies.length}</dd>
            </div>
          </dl>
          <button className={styles.printButton} type="button" onClick={() => window.print()}>
            Print resume
          </button>
        </div>
      </header>

      <section className={styles.filters} aria-labelledby="technology-filter-title">
        <div className={styles.filterHeading}>
          <div>
            <h2 id="technology-filter-title">Trace work by technology</h2>
            <p>Matching roles are brought forward without removing the rest of the chronology.</p>
          </div>
          <p className={styles.filterStatus} aria-live="polite">
            {explorer.technology
              ? `${matchingRoleCount} of ${entries.length} roles match ${explorer.technology}.`
              : `Showing all ${entries.length} roles.`}
          </p>
        </div>
        <div className={styles.filterControls} role="group" aria-label="Technology filters">
          <button
            type="button"
            aria-pressed={explorer.technology === null}
            data-selected={explorer.technology === null}
            onClick={() => filterByTechnology(null)}
          >
            Show all roles
          </button>
          {technologies.map((technology) => (
            <button
              key={technology}
              type="button"
              aria-pressed={explorer.technology === technology}
              data-selected={explorer.technology === technology}
              onClick={() => filterByTechnology(technology)}
            >
              {technology}
            </button>
          ))}
        </div>
      </section>

      <div className={styles.explorer}>
        <nav className={styles.roleNavigation} aria-labelledby="role-navigation-title">
          <div className={styles.navigationHeading}>
            <h2 id="role-navigation-title">Role progression</h2>
            <p>Select a role to bring its complete record into focus.</p>
          </div>
          <ol>
            {entries.map((entry, index) => {
              const matches = entryMatchesTechnology(entry, explorer.technology);
              const selected = explorer.selectedIndex === index;
              return (
                <li key={roleKey(entry)}>
                  <button
                    ref={(node) => {
                      roleButtons.current[index] = node;
                    }}
                    type="button"
                    aria-controls={roleId(index)}
                    aria-pressed={selected}
                    data-match={matches}
                    data-selected={selected}
                    onClick={() => selectRole(index)}
                    onKeyDown={(event) => navigateRoles(event, index)}
                  >
                    <span className={styles.roleSequence}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.roleNavigationCopy}>
                      <strong>{entry.role}</strong>
                      <span>{entry.company}</span>
                      <span>{formatResumePeriod(entry.startDate, entry.endDate)}</span>
                      {explorer.technology && (
                        <span className={styles.matchLabel}>
                          {matches ? `${explorer.technology} match` : "Outside current filter"}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className={styles.keyboardHint}>
            Use arrow keys, Home, and End to move between roles.
          </p>
        </nav>

        <ol className={styles.timeline} aria-label="Career chronology, newest role first">
          {entries.map((entry, index) => {
            const matches = entryMatchesTechnology(entry, explorer.technology);
            const selected = explorer.selectedIndex === index;
            return (
              <li
                key={roleKey(entry)}
                className={styles.timelineItem}
                data-match={matches}
                data-selected={selected}
              >
                <span className={styles.timelineNode} aria-hidden="true" />
                <article
                  id={roleId(index)}
                  ref={(node) => {
                    roleArticles.current[index] = node;
                  }}
                  className={styles.roleCard}
                  aria-labelledby={`${roleId(index)}-title`}
                >
                  <header className={styles.roleHeader}>
                    <div>
                      <p className={styles.period}>
                        <time dateTime={entry.startDate}>{formatResumeDate(entry.startDate)}</time>
                        <span aria-hidden="true"> — </span>
                        <time dateTime={entry.endDate === "present" ? undefined : entry.endDate}>
                          {formatResumeDate(entry.endDate)}
                        </time>
                      </p>
                      <h2 id={`${roleId(index)}-title`}>{entry.role}</h2>
                      <p className={styles.company}>
                        {entry.company}
                        {entry.location ? `, ${entry.location}` : ""}
                      </p>
                    </div>
                    <div className={styles.roleSignals}>
                      <span>Role {String(index + 1).padStart(2, "0")}</span>
                      {explorer.technology && (
                        <span data-match={matches}>
                          {matches ? `Matches ${explorer.technology}` : "Retained for context"}
                        </span>
                      )}
                    </div>
                  </header>

                  {entry.progression && (
                    <aside className={styles.progression} aria-label="Career progression">
                      <h3>Progression</h3>
                      <p>{entry.progression}</p>
                    </aside>
                  )}

                  <div className={styles.evidenceGrid}>
                    <ResumeList title="Measurable impact" items={entry.impact} emphasized />
                    <ResumeList title="Engineering work" items={entry.engineeringWork} />
                    <ResumeList
                      title="Responsibilities"
                      items={entry.responsibilities}
                      className={styles.responsibilities}
                    />
                  </div>

                  {entry.technologies.length > 0 && (
                    <section
                      className={styles.technologyRecord}
                      aria-labelledby={`${roleId(index)}-tools`}
                    >
                      <h3 id={`${roleId(index)}-tools`}>Technology record</h3>
                      <ul aria-label={`Technologies used as ${entry.role}`}>
                        {entry.technologies.map((technology) => (
                          <li key={technology} data-match={explorer.technology === technology}>
                            {technology}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </article>
  );
}

function ResumeList({
  title,
  items,
  emphasized = false,
  className = "",
}: {
  title: string;
  items: readonly string[];
  emphasized?: boolean;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={`${styles.resumeList} ${emphasized ? styles.impact : ""} ${className}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
