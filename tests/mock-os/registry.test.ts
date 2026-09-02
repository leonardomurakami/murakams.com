import { describe, expect, it } from "vitest";
import {
  launchTargetForApp,
  mockOsApps,
  routeToLaunchTarget,
} from "../../src/features/mock-os/registry";

describe("MKS/98 application registry", () => {
  it("maps every primary application to its canonical route", () => {
    for (const app of mockOsApps) {
      expect(routeToLaunchTarget(app.path)).toEqual(launchTargetForApp(app.id));
    }
  });

  it("maps project deep links to unique project windows", async () => {
    const { projects } = await import("../../src/content/projects/projects");
    const targets = projects.map((project) => routeToLaunchTarget(`/projects/${project.slug}`));
    expect(new Set(targets.map((target) => target.instanceId)).size).toBe(projects.length);
    for (const [index, project] of projects.entries()) {
      expect(targets[index]).toMatchObject({
        appId: "project",
        instanceId: `project:${project.slug}`,
        path: `/projects/${project.slug}`,
        props: { slug: project.slug },
      });
    }
  });

  it("maps dynamically discovered playground deep links to unique experiment windows", () => {
    for (const slug of ["light-table", "future-program"]) {
      expect(routeToLaunchTarget(`/playground/${slug}`)).toMatchObject({
        appId: "experiment",
        instanceId: `experiment:${slug}`,
        props: { slug },
      });
    }
  });

  it("maps unknown routes to a routing diagnostic", () => {
    expect(routeToLaunchTarget("/not-registered")).toMatchObject({
      appId: "error",
      path: "/not-registered",
      props: { slug: "/not-registered" },
    });
  });
});
