import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { resume } from "@/content/resume/resume";
import {
  ResumeTimeline,
  entryMatchesTechnology,
  formatResumePeriod,
  getResumeTechnologies,
  getRoleNavigationIndex,
  updateResumeExplorer,
  type ResumeExplorerState,
} from "@/features/resume/resume-timeline";

const initialState: ResumeExplorerState = {
  selectedIndex: 0,
  technology: null,
};

function countOccurrences(value: string, search: string): number {
  return value.split(search).length - 1;
}

describe("accessible resume explorer", () => {
  it("preserves the typed chronology and formats complete periods", () => {
    expect(resume.entries.map((entry) => entry.role)).toEqual([
      "Mid-Level Site Reliability Engineer",
      "Junior Site Reliability Engineer",
      "Machine Learning Engineer",
      "Junior Data Scientist",
      "Data Science Intern",
      "Data Science Summer Intern",
      "Machine Learning Researcher",
    ]);
    expect(formatResumePeriod("2024-03", "present")).toBe("Mar 2024 — Present");
    expect(formatResumePeriod("2019-09", "2020-03")).toBe("Sep 2019 — Mar 2020");
  });

  it("selects roles and supports bounded keyboard progression", () => {
    const selected = updateResumeExplorer(resume.entries, initialState, {
      type: "select-role",
      index: 2,
    });

    expect(selected.selectedIndex).toBe(2);
    expect(getRoleNavigationIndex("ArrowDown", 0, resume.entries.length)).toBe(1);
    expect(getRoleNavigationIndex("ArrowUp", 0, resume.entries.length)).toBe(0);
    expect(getRoleNavigationIndex("End", 0, resume.entries.length)).toBe(6);
    expect(getRoleNavigationIndex("Home", 2, resume.entries.length)).toBe(0);
    expect(getRoleNavigationIndex("Tab", 1, resume.entries.length)).toBeNull();
  });

  it("emphasizes technology matches and restores the complete chronology", () => {
    const technologies = getResumeTechnologies(resume.entries);
    const filtered = updateResumeExplorer(resume.entries, initialState, {
      type: "filter-technology",
      technology: "Kubernetes",
    });
    const matchingRoles = resume.entries.filter((entry) =>
      entryMatchesTechnology(entry, filtered.technology),
    );
    const restored = updateResumeExplorer(resume.entries, filtered, {
      type: "filter-technology",
      technology: null,
    });

    expect(technologies).toContain("Kubernetes");
    expect(filtered).toEqual({ selectedIndex: 0, technology: "Kubernetes" });
    expect(matchingRoles.map((entry) => entry.role)).toEqual([
      "Mid-Level Site Reliability Engineer",
      "Junior Site Reliability Engineer",
    ]);
    expect(restored).toEqual({ selectedIndex: 0, technology: null });
    expect(
      resume.entries.filter((entry) => entryMatchesTechnology(entry, restored.technology)),
    ).toHaveLength(resume.entries.length);
  });

  it("renders every typed responsibility, engineering record, impact, and technology in linear HTML", () => {
    const markup = renderToStaticMarkup(
      createElement(ResumeTimeline, {
        summary: resume.summary,
        entries: resume.entries,
      }),
    );

    const textMarkup = markup.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");

    expect(markup).toContain("<h1");
    expect(markup).toContain("Career chronology, newest role first");
    expect(countOccurrences(markup, '<article id="resume-role-')).toBe(resume.entries.length);
    expect(countOccurrences(markup, "Measurable impact")).toBe(
      resume.entries.filter((entry) => entry.impact.length > 0).length,
    );
    expect(countOccurrences(markup, "Engineering work")).toBe(
      resume.entries.filter((entry) => entry.engineeringWork.length > 0).length,
    );

    for (const entry of resume.entries) {
      expect(markup).toContain(entry.role);
      expect(markup).toContain(entry.company);
      for (const value of [
        ...entry.responsibilities,
        ...entry.engineeringWork,
        ...entry.impact,
        ...entry.technologies,
      ]) {
        expect(textMarkup).toContain(value);
      }
      if (entry.progression) expect(textMarkup).toContain(entry.progression);
    }
  });

  it("ships linear mobile rules and a chrome-free complete print document", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/features/resume/resume-timeline.module.css"),
      "utf8",
    );
    const printRules = css.slice(css.indexOf("@media print"));

    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toMatch(/\.roleNavigation ol\s*\{\s*grid-template-columns: 1fr;/);
    expect(printRules).toContain(":global(.experience-immersive)");
    expect(printRules).toContain(':global([data-experience-region="accessible"] > header)');
    expect(printRules).toContain("display: none !important");
    expect(printRules).toContain("break-inside: avoid");
    expect(printRules).toMatch(/\.filters,\s*\.roleNavigation\s*\{\s*display: none;/);
    expect(printRules).toMatch(/\.timeline\s*\{\s*display: block;/);
  });
});
