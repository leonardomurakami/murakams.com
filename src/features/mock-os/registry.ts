export type MockOsAppId =
  | "welcome"
  | "projects"
  | "infra"
  | "resume"
  | "programs"
  | "mail"
  | "project"
  | "experiment"
  | "error";

export type MockOsIconId = "computer" | "folder" | "monitor" | "document" | "executable" | "mail";

export interface MockOsAppDefinition {
  id: Exclude<MockOsAppId, "project" | "experiment" | "error">;
  title: string;
  path: string;
  icon: MockOsIconId;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimumSize: { width: number; height: number };
  desktopPosition: { x: number; y: number };
}

export interface MockOsLaunchTarget {
  appId: MockOsAppId;
  instanceId: string;
  title: string;
  path: string;
  props?: { slug: string };
}

export const mockOsApps: readonly MockOsAppDefinition[] = [
  {
    id: "welcome",
    title: "Welcome to MKS/98",
    path: "/",
    icon: "computer",
    position: { x: 110, y: 48 },
    size: { width: 900, height: 620 },
    minimumSize: { width: 520, height: 400 },
    desktopPosition: { x: 22, y: 24 },
  },
  {
    id: "projects",
    title: "Projects",
    path: "/projects",
    icon: "folder",
    position: { x: 210, y: 104 },
    size: { width: 720, height: 520 },
    minimumSize: { width: 440, height: 340 },
    desktopPosition: { x: 22, y: 116 },
  },
  {
    id: "infra",
    title: "System Monitor",
    path: "/infra",
    icon: "monitor",
    position: { x: 820, y: 410 },
    size: { width: 520, height: 360 },
    minimumSize: { width: 420, height: 300 },
    desktopPosition: { x: 22, y: 208 },
  },
  {
    id: "resume",
    title: "Resume.mks",
    path: "/resume",
    icon: "document",
    position: { x: 250, y: 92 },
    size: { width: 860, height: 620 },
    minimumSize: { width: 520, height: 400 },
    desktopPosition: { x: 22, y: 300 },
  },
  {
    id: "programs",
    title: "Programs",
    path: "/playground",
    icon: "folder",
    position: { x: 300, y: 130 },
    size: { width: 760, height: 520 },
    minimumSize: { width: 440, height: 340 },
    desktopPosition: { x: 22, y: 392 },
  },
  {
    id: "mail",
    title: "Mail",
    path: "/contact",
    icon: "mail",
    position: { x: 360, y: 156 },
    size: { width: 660, height: 470 },
    minimumSize: { width: 420, height: 340 },
    desktopPosition: { x: 22, y: 484 },
  },
] as const;

const appMap = new Map(mockOsApps.map((app) => [app.id, app]));

export function getMockOsApp(
  id: Exclude<MockOsAppId, "project" | "experiment" | "error">,
): MockOsAppDefinition {
  const app = appMap.get(id);
  if (!app) throw new Error(`Unknown MKS/98 application: ${id}`);
  return app;
}

export function routeToLaunchTarget(pathname: string): MockOsLaunchTarget {
  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const slug = decodeURIComponent(projectMatch[1]);
    return {
      appId: "project",
      instanceId: `project:${slug}`,
      title: `${slug.replaceAll("-", " ")}.mks`,
      path: `/projects/${encodeURIComponent(slug)}`,
      props: { slug },
    };
  }

  const experimentMatch = pathname.match(/^\/playground\/([^/]+)$/);
  if (experimentMatch) {
    const slug = decodeURIComponent(experimentMatch[1]);
    return {
      appId: "experiment",
      instanceId: `experiment:${slug}`,
      title: `${slug.replaceAll("-", " ")}.exe`,
      path: `/playground/${encodeURIComponent(slug)}`,
      props: { slug },
    };
  }

  const app = mockOsApps.find((candidate) => candidate.path === pathname);
  if (app) {
    return {
      appId: app.id,
      instanceId: app.id,
      title: app.title,
      path: app.path,
    };
  }

  return {
    appId: "error",
    instanceId: `error:${pathname}`,
    title: "Routing diagnostic",
    path: pathname,
    props: { slug: pathname },
  };
}

export function launchTargetForApp(
  id: Exclude<MockOsAppId, "project" | "experiment" | "error">,
): MockOsLaunchTarget {
  const app = getMockOsApp(id);
  return {
    appId: app.id,
    instanceId: app.id,
    title: app.title,
    path: app.path,
  };
}
