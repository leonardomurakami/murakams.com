"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/components/motion";
import {
  mockOsApps,
  getMockOsApp,
  launchTargetForApp,
  routeToLaunchTarget,
  type MockOsAppId,
  type MockOsLaunchTarget,
} from "./registry";
import { MockOsDesktopProvider } from "./desktop-context";
import { MockOsIcon, StartMark, WindowControlIcon } from "./icons";
import { MobileWorkspace } from "./mobile-workspace";
import {
  ManagedDesktop,
  ManagedDesktopIconGrid,
  ManagedResizeHandles,
  ManagedTaskbar,
  ManagedTitleBar,
  ManagedWindow,
  ManagedWindowContent,
  ManagedWindowFrame,
  ManagedWindowProvider,
  ManagedWindowTitle,
  useWindow,
  useWindowManager,
  type ManagedWindowConfig,
  type ManagedWindowRegistry,
  type ManagedWindowState,
} from "./window-manager/adapter";
import {
  ErrorApp,
  ExperimentApp,
  MailApp,
  ProgramsApp,
  ProjectApp,
  ProjectsApp,
  ResumeApp,
  SystemMonitorApp,
  WelcomeApp,
} from "./apps/core-apps";
import { fitWindowToWorkspace } from "./state/window-bounds";
import styles from "./mock-os.module.css";

const componentRegistry: ManagedWindowRegistry = {
  welcome: WelcomeApp,
  projects: ProjectsApp,
  infra: SystemMonitorApp,
  resume: ResumeApp,
  programs: ProgramsApp,
  mail: MailApp,
  project: ProjectApp,
  experiment: ExperimentApp,
  error: ErrorApp,
};

const windowConfigs = Object.fromEntries(
  mockOsApps.map((app) => [
    app.id,
    {
      title: app.title,
      position: app.position,
      size: app.size,
    },
  ]),
) as Record<string, Omit<ManagedWindowConfig, "id" | "componentId">>;

const iconConfigs = mockOsApps.map((app) => ({
  id: `icon:${app.id}`,
  label: app.title,
  componentId: app.id,
  position: app.desktopPosition,
  icon: app.icon,
}));

function pathForWindowId(id: string): string {
  if (id.startsWith("project:"))
    return `/projects/${encodeURIComponent(id.slice("project:".length))}`;
  if (id.startsWith("experiment:"))
    return `/playground/${encodeURIComponent(id.slice("experiment:".length))}`;
  if (id.startsWith("error:")) return id.slice("error:".length) || "/";
  const app = mockOsApps.find((candidate) => candidate.id === id);
  return app?.path ?? "/";
}

function configForTarget(target: MockOsLaunchTarget, mobile = false): ManagedWindowConfig {
  const basis =
    target.appId === "project"
      ? getMockOsApp("resume")
      : target.appId === "experiment"
        ? getMockOsApp("programs")
        : target.appId === "error"
          ? getMockOsApp("welcome")
          : getMockOsApp(target.appId);
  return {
    id: target.instanceId,
    componentId: target.appId,
    componentProps: target.props,
    title: target.title,
    position: mobile ? { x: 0, y: 0 } : basis.position,
    size: mobile ? { width: "100%", height: "100%" } : basis.size,
    displayState: mobile ? "maximized" : "normal",
  };
}

function stateForTarget(
  target: MockOsLaunchTarget,
  zIndex: number,
  mobile = false,
): ManagedWindowState {
  return {
    ...configForTarget(target, mobile),
    zIndex,
    displayState: mobile ? "maximized" : "normal",
  };
}

function SchematicWallpaper() {
  return (
    <svg
      className={styles.wallpaper}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="#d8e4ff" strokeWidth="1.5">
        <path d="M170 122h190v104h210v-72h214v194h206v-96h256" />
        <path d="M268 640h210v-86h174v-116h242v98h222v-172h154" />
        <path d="M384 226v144h-128v184M784 348v90M1116 536v104H942" strokeDasharray="7 8" />
      </g>
      <g fill="#d8e4ff">
        {[
          [170, 122],
          [360, 226],
          [570, 154],
          [784, 348],
          [990, 252],
          [1246, 252],
          [268, 640],
          [478, 554],
          [652, 438],
          [894, 536],
          [1116, 364],
          [1270, 364],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" />
        ))}
      </g>
      <g fill="#d8e4ff" fontFamily="ui-monospace, monospace" fontSize="12">
        <text x="172" y="108">
          SOURCE
        </text>
        <text x="572" y="140">
          RECONCILE
        </text>
        <text x="992" y="238">
          PUBLIC
        </text>
        <text x="270" y="670">
          WORKLOADS
        </text>
        <text x="896" y="566">
          SANITIZED STATUS
        </text>
      </g>
    </svg>
  );
}

function MksWindowView({
  windowId,
  Component,
  componentProps,
  mobile,
}: {
  windowId: string;
  Component: React.ComponentType<{ windowId: string } & Record<string, unknown>>;
  componentProps: Record<string, unknown>;
  mobile: boolean;
}) {
  const window = useWindow(windowId);
  const controls = useWindowManager();
  const handleClose = useCallback(() => {
    controls.closeWindow(windowId);
    controls.finalizeClose(windowId);
  }, [controls, windowId]);

  if (mobile) {
    return (
      <ManagedWindow id={windowId}>
        <div className={styles.windowFrame} data-focused={window.isFocused}>
          <div className={styles.titleBar}>
            <div className={styles.windowTitle}>{window.title}</div>
            <div className={styles.windowControls} onPointerDown={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.windowControl}
                onClick={() => controls.minimizeWindow(windowId)}
                aria-label={`Minimize ${window.title}`}
              >
                <WindowControlIcon kind="minimize" />
              </button>
              <button
                type="button"
                className={styles.windowControl}
                onClick={handleClose}
                aria-label={`Close ${window.title}`}
              >
                <WindowControlIcon kind="close" />
              </button>
            </div>
          </div>
          <div className={styles.windowContent}>
            <Component windowId={windowId} {...componentProps} />
          </div>
        </div>
      </ManagedWindow>
    );
  }

  return (
    <ManagedWindow id={windowId}>
      <ManagedWindowFrame
        windowId={windowId}
        className={styles.windowFrame}
        style={{ minWidth: 360, minHeight: 240 }}
        enableDoubleClickMaximize
        enableSnapToEdges
      >
        <ManagedTitleBar className={styles.titleBar}>
          <ManagedWindowTitle className={styles.windowTitle}>{window.title}</ManagedWindowTitle>
          <div className={styles.windowControls} onPointerDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.windowControl}
              onClick={() => controls.minimizeWindow(windowId)}
              aria-label={`Minimize ${window.title}`}
            >
              <WindowControlIcon kind="minimize" />
            </button>
            {window.displayState === "maximized" ? (
              <button
                type="button"
                className={styles.windowControl}
                onClick={() => controls.restoreWindow(windowId)}
                aria-label={`Restore ${window.title}`}
              >
                <WindowControlIcon kind="restore" />
              </button>
            ) : (
              <button
                type="button"
                className={styles.windowControl}
                onClick={() => controls.maximizeWindow(windowId)}
                aria-label={`Maximize ${window.title}`}
              >
                <WindowControlIcon kind="maximize" />
              </button>
            )}
            <button
              type="button"
              className={styles.windowControl}
              onClick={handleClose}
              aria-label={`Close ${window.title}`}
            >
              <WindowControlIcon kind="close" />
            </button>
          </div>
        </ManagedTitleBar>
        <ManagedWindowContent className={styles.windowContent}>
          <Component windowId={windowId} {...componentProps} />
        </ManagedWindowContent>
        <ManagedResizeHandles windowId={windowId} minWidth={360} minHeight={240} />
      </ManagedWindowFrame>
    </ManagedWindow>
  );
}

function BoundsCorrection({ mobile }: { mobile: boolean }) {
  const { state, updateWindow, getContainerBounds, maximizeWindow } = useWindowManager();
  const windows = useRef(state.windows);

  useEffect(() => {
    windows.current = state.windows;
  }, [state.windows]);

  useEffect(() => {
    function correctBounds() {
      const bounds = getContainerBounds();
      if (!bounds) return;
      for (const window of windows.current) {
        if (mobile) {
          if (window.displayState !== "maximized") maximizeWindow(window.id);
          continue;
        }
        if (
          window.displayState !== "normal" ||
          typeof window.size.width !== "number" ||
          typeof window.size.height !== "number"
        )
          continue;
        const fitted = fitWindowToWorkspace(
          {
            x: window.position.x,
            y: window.position.y,
            width: window.size.width,
            height: window.size.height,
          },
          bounds,
        );
        if (
          fitted.x !== window.position.x ||
          fitted.y !== window.position.y ||
          fitted.width !== window.size.width ||
          fitted.height !== window.size.height
        )
          updateWindow(window.id, {
            position: { x: fitted.x, y: fitted.y },
            size: { width: fitted.width, height: fitted.height },
          });
      }
    }
    const observer = new ResizeObserver(correctBounds);
    const boundsElement = document.querySelector<HTMLElement>("[data-mks-desktop-bounds]");
    if (boundsElement) observer.observe(boundsElement);
    correctBounds();
    return () => observer.disconnect();
  }, [getContainerBounds, maximizeWindow, mobile, updateWindow]);

  return null;
}

function WorkspaceContents({
  mobile,
  onAccessibleSite,
  suppressHomeRouteOpenRef,
  soundEnabled,
  onToggleSound,
}: {
  mobile: boolean;
  onAccessibleSite: () => void;
  suppressHomeRouteOpenRef: { current: boolean };
  soundEnabled: boolean;
  onToggleSound: () => void;
}) {
  const pathname = usePathname();
  const manager = useWindowManager();
  const { openOrFocusWindow, maximizeWindow, state } = manager;
  const openFromRoute = useRef(openOrFocusWindow);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    openFromRoute.current = openOrFocusWindow;
  }, [openOrFocusWindow]);

  const openTarget = useCallback(
    (target: MockOsLaunchTarget) => {
      openOrFocusWindow(configForTarget(target, mobile));
    },
    [mobile, openOrFocusWindow],
  );

  const openApp = useCallback(
    (appId: Exclude<MockOsAppId, "project" | "experiment" | "error">) => {
      setStartOpen(false);
      openTarget(launchTargetForApp(appId));
    },
    [openTarget],
  );

  const openProject = useCallback(
    (slug: string) => {
      openTarget(routeToLaunchTarget(`/projects/${slug}`));
    },
    [openTarget],
  );

  const openExperiment = useCallback(
    (slug: string) => {
      openTarget(routeToLaunchTarget(`/playground/${slug}`));
    },
    [openTarget],
  );

  useEffect(() => {
    if (pathname === "/" && suppressHomeRouteOpenRef.current) {
      suppressHomeRouteOpenRef.current = false;
      return;
    }
    const target = routeToLaunchTarget(pathname);
    openFromRoute.current(configForTarget(target, mobile));
  }, [mobile, pathname, suppressHomeRouteOpenRef]);

  useEffect(() => {
    if (!mobile) return;
    const active = state.activeWindowId;
    if (active) maximizeWindow(active);
  }, [maximizeWindow, mobile, state.activeWindowId]);

  const commands = useMemo(
    () => ({
      openApp,
      openProject,
      openExperiment,
      useAccessibleSite: onAccessibleSite,
    }),
    [onAccessibleSite, openApp, openExperiment, openProject],
  );

  return (
    <MockOsDesktopProvider value={commands}>
      <div
        className={styles.desktop}
        onPointerDown={(event) => {
          if (event.currentTarget === event.target) {
            setSelectedIcon(null);
            setStartOpen(false);
          }
        }}
      >
        <SchematicWallpaper />
        <ManagedDesktopIconGrid
          grid={{ cellWidth: 112, cellHeight: 92 }}
          className={styles.iconRack}
        >
          {({ iconId, iconState, dragProps, isSelected, onSelect }) => {
            const app = mockOsApps.find((candidate) => candidate.id === iconState.componentId);
            if (!app) return null;
            return (
              <button
                type="button"
                {...dragProps}
                className={styles.desktopIcon}
                data-selected={isSelected || selectedIcon === iconId}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(false);
                  setSelectedIcon(iconId);
                  if (mobile) openApp(app.id);
                }}
                onDoubleClick={() => openApp(app.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") openApp(app.id);
                }}
                aria-label={`Open ${app.title}`}
              >
                <MockOsIcon name={app.icon} />
                <span className={styles.desktopIconLabel}>{app.title}</span>
              </button>
            );
          }}
        </ManagedDesktopIconGrid>

        <ManagedDesktop>
          {({ component: Component, windowId, componentProps }) => (
            <MksWindowView
              windowId={windowId}
              Component={Component}
              componentProps={componentProps}
              mobile={mobile}
            />
          )}
        </ManagedDesktop>
      </div>

      <ManagedTaskbar>
        {({ windows, activeWindowId, focusWindow, restoreWindow }) => (
          <div className={styles.taskbar}>
            <button
              type="button"
              className={styles.startButton}
              data-open={startOpen}
              onClick={() => setStartOpen((open) => !open)}
              aria-expanded={startOpen}
            >
              <StartMark />
              <span>MKS</span>
            </button>
            {startOpen && (
              <div className={styles.startMenu} role="menu">
                <div className={styles.startMenuBrand}>MKS/98 WORKBENCH</div>
                {mockOsApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => openApp(app.id)}
                  >
                    <MockOsIcon name={app.icon} size={31} />
                    <span>{app.title}</span>
                  </button>
                ))}
                <div className={styles.menuRule} />
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={onAccessibleSite}
                >
                  <MockOsIcon name="document" size={31} />
                  <span>Accessible site</span>
                </button>
              </div>
            )}
            <div className={styles.taskList}>
              {windows.map((window) => (
                <button
                  key={window.id}
                  type="button"
                  className={styles.taskButton}
                  data-active={activeWindowId === window.id && window.displayState !== "minimized"}
                  onClick={() => {
                    if (window.displayState === "minimized") restoreWindow(window.id);
                    else focusWindow(window.id);
                  }}
                >
                  {window.title}
                </button>
              ))}
            </div>
            <div className={styles.tray}>
              <button
                type="button"
                onClick={onToggleSound}
                aria-label={soundEnabled ? "Mute MKS/98 sounds" : "Enable MKS/98 sounds"}
                className="font-bold"
              >
                {soundEnabled ? "SND" : "MUTE"}
              </button>
              <time dateTime={clock.toISOString()}>
                {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </time>
            </div>
          </div>
        )}
      </ManagedTaskbar>
      <div className={styles.crtGlass} />
    </MockOsDesktopProvider>
  );
}

function WindowedDesktopWorkspace({
  onAccessibleSite,
  soundEnabled,
  onToggleSound,
}: {
  onAccessibleSite: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}) {
  const boundsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const mobile = false;
  const suppressHomeRouteOpenRef = useRef(false);
  const defaults = useMemo(() => {
    const target = routeToLaunchTarget(pathname);
    if (pathname === "/")
      return [
        stateForTarget(launchTargetForApp("infra"), 1, mobile),
        stateForTarget(launchTargetForApp("welcome"), 2, mobile),
      ];
    return [stateForTarget(target, 1, mobile)];
  }, [mobile, pathname]);

  const onFocusChange = useCallback(
    (windowId: string | null) => {
      const path = windowId ? pathForWindowId(windowId) : "/";
      suppressHomeRouteOpenRef.current = !windowId;
      if (path !== window.location.pathname) router.push(path, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    const target = routeToLaunchTarget(pathname);
    const app = mockOsApps.find((a) => a.id === target.appId);
    if (
      app &&
      target.appId !== "project" &&
      target.appId !== "experiment" &&
      target.appId !== "error"
    ) {
      document.title = `${app.title} — MKS/98`;
    } else if (target.appId === "project" && target.props?.slug) {
      document.title = `${String(target.props.slug)} — MKS/98`;
    } else if (pathname === "/") {
      document.title = "MKS/98 — Leonardo Murakami";
    }
  }, [pathname]);

  return (
    <div ref={boundsRef} className={styles.shell} data-mks-desktop-bounds>
      <ManagedWindowProvider
        boundsRef={boundsRef}
        registry={componentRegistry}
        defaultWindowConfigs={windowConfigs}
        defaultIcons={iconConfigs}
        defaultWindows={defaults}
        initialFocusedWindowId={defaults.at(-1)?.id}
        onFocusChange={onFocusChange}
      >
        <BoundsCorrection mobile={mobile} />
        <WorkspaceContents
          mobile={mobile}
          onAccessibleSite={onAccessibleSite}
          suppressHomeRouteOpenRef={suppressHomeRouteOpenRef}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />
      </ManagedWindowProvider>
    </div>
  );
}

export function DesktopWorkspace({
  onAccessibleSite,
  soundEnabled,
  onToggleSound,
}: {
  onAccessibleSite: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}) {
  const mobile = useIsMobile(721);
  const props = { onAccessibleSite, soundEnabled, onToggleSound };

  return mobile ? <MobileWorkspace {...props} /> : <WindowedDesktopWorkspace {...props} />;
}
