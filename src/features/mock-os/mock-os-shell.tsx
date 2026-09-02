"use client";

import { useExperience } from "@/features/experience/experience-provider";
import { BootPrompt, BootScreen, useBootMachine } from "./boot";
import { DesktopWorkspace } from "./desktop-workspace";
import styles from "./mock-os.module.css";

export function MockOsShell() {
  const boot = useBootMachine();
  const { setExperience } = useExperience();

  return (
    <main className={styles.experience}>
      <div className={styles.deviceFrame}>
        <div className={styles.deviceEarpiece} aria-hidden="true" />
        <div className={styles.deviceScreen}>
          {boot.phase === "off" && (
            <BootPrompt onBoot={boot.power} onAccessibleSite={() => setExperience("accessible")} />
          )}
          {(boot.phase === "post" || boot.phase === "splash") && (
            <BootScreen
              phase={boot.phase}
              soundEnabled={boot.soundEnabled}
              onSoundEnabledChange={boot.setSoundEnabled}
              onSkip={boot.skip}
              onAccessibleSite={() => setExperience("accessible")}
            />
          )}
          {boot.phase === "desktop" && (
            <DesktopWorkspace
              onAccessibleSite={() => setExperience("accessible")}
              soundEnabled={boot.soundEnabled}
              onToggleSound={boot.toggleSound}
            />
          )}
        </div>
        <div className={styles.deviceHardware} aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
      </div>
    </main>
  );
}
