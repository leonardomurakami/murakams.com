"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { MockOsDesktopProvider } from "./desktop-context";
import { MockOsIcon } from "./icons";
import {
  launchTargetForApp,
  mockOsApps,
  routeToLaunchTarget,
  type MockOsAppId,
  type MockOsLaunchTarget,
} from "./registry";
import styles from "./mock-os.module.css";

function MobileApplication({ target }: { target: MockOsLaunchTarget }) {
  const props = { windowId: target.instanceId, slug: target.props?.slug };

  switch (target.appId) {
    case "welcome":
      return <WelcomeApp />;
    case "projects":
      return <ProjectsApp />;
    case "infra":
      return <SystemMonitorApp />;
    case "resume":
      return <ResumeApp />;
    case "programs":
      return <ProgramsApp />;
    case "mail":
      return <MailApp />;
    case "project":
      return <ProjectApp {...props} />;
    case "experiment":
      return <ExperimentApp {...props} mobileView />;
    case "error":
      return <ErrorApp {...props} />;
  }
}

export function MobileWorkspace({
  onAccessibleSite,
  soundEnabled,
  onToggleSound,
}: {
  onAccessibleSite: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [homeTarget, setHomeTarget] = useState<MockOsLaunchTarget | null>(null);
  const [clock, setClock] = useState(() => new Date());
  const target = pathname === "/" ? homeTarget : routeToLaunchTarget(pathname);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = target ? `${target.title} — MKS Mobile` : "MKS Mobile — Leonardo Murakami";
  }, [target]);

  const openTarget = useCallback(
    (nextTarget: MockOsLaunchTarget) => {
      if (nextTarget.path === "/") {
        setHomeTarget(nextTarget);
        return;
      }
      setHomeTarget(null);
      router.push(nextTarget.path, { scroll: false });
    },
    [router],
  );

  const openApp = useCallback(
    (appId: Exclude<MockOsAppId, "project" | "experiment" | "error">) => {
      openTarget(launchTargetForApp(appId));
    },
    [openTarget],
  );

  const commands = useMemo(
    () => ({
      openApp,
      openProject: (slug: string) => openTarget(routeToLaunchTarget(`/projects/${slug}`)),
      openExperiment: (slug: string) => openTarget(routeToLaunchTarget(`/playground/${slug}`)),
      useAccessibleSite: onAccessibleSite,
    }),
    [onAccessibleSite, openApp, openTarget],
  );

  function showLauncher() {
    setHomeTarget(null);
    if (pathname !== "/") router.push("/", { scroll: false });
  }

  function goBack() {
    if (!target) return;
    if (target.appId === "project") {
      openApp("projects");
      return;
    }
    if (target.appId === "experiment") {
      openApp("programs");
      return;
    }
    showLauncher();
  }

  return (
    <MockOsDesktopProvider value={commands}>
      <section className={styles.mobileShell} aria-label="MKS Mobile smartphone interface">
        <header className={styles.mobileStatusBar}>
          <span className={styles.mobileSignal} aria-label="Signal available">
            <i />
            <i />
            <i />
            <i />
          </span>
          <strong>MKS NET</strong>
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? "SND" : "MUTE"}
          </button>
          <time dateTime={clock.toISOString()}>
            {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </time>
        </header>

        <div className={styles.mobileDisplay}>
          {target ? (
            <div className={styles.mobileAppScreen}>
              <header className={styles.mobileAppBar}>
                <button type="button" onClick={goBack} aria-label={`Back from ${target.title}`}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M12.8 3 5.7 10l7.1 7 1.5-1.5L8.8 10l5.5-5.5z" fill="currentColor" />
                  </svg>
                </button>
                <strong>{target.title}</strong>
                <span>{target.appId === "error" ? "ERR" : "OPEN"}</span>
              </header>
              <main className={styles.mobileAppBody} key={target.instanceId}>
                <MobileApplication target={target} />
              </main>
            </div>
          ) : (
            <main className={styles.mobileLauncher}>
              <header className={styles.mobileLauncherHeader}>
                <p>
                  {clock.toLocaleDateString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h1>MKS Mobile</h1>
                <span>Leonardo&rsquo;s pocket workstation</span>
              </header>
              <div className={styles.mobileAppGrid} aria-label="Applications">
                {mockOsApps.map((app) => (
                  <button key={app.id} type="button" onClick={() => openApp(app.id)}>
                    <span className={styles.mobileIconTile}>
                      <MockOsIcon name={app.icon} size={42} />
                    </span>
                    <strong>{app.title === "Welcome to MKS/98" ? "Welcome" : app.title}</strong>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.mobileAccessibleLink}
                onClick={onAccessibleSite}
              >
                Open accessible site
              </button>
            </main>
          )}
        </div>

        <nav className={styles.mobileSoftKeys} aria-label="Phone controls">
          <button type="button" onClick={goBack} disabled={!target}>
            <span>Back</span>
            <i aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.mobileHomeKey}
            onClick={showLauncher}
            aria-label="Home"
          >
            <span aria-hidden="true" />
          </button>
          <button type="button" onClick={onAccessibleSite}>
            <span>Site</span>
            <i aria-hidden="true" />
          </button>
        </nav>
      </section>
    </MockOsDesktopProvider>
  );
}
