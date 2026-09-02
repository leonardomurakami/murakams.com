"use client";

import { useEffect } from "react";
import styles from "./boot.module.css";

export type ActiveBootPhase = "post" | "splash";

export interface BootScreenProps {
  phase: ActiveBootPhase;
  soundEnabled: boolean;
  onSoundEnabledChange: (enabled: boolean) => void;
  onSkip: () => void;
  onAccessibleSite: () => void;
}

export interface BootPromptProps {
  onBoot: () => void;
  onAccessibleSite: () => void;
}

const diagnosticLines = [
  "MKS LABS WORKBENCH BIOS 3.7",
  "MKS/98 POWER-ON SELF TEST",
  "PROCESSOR: SOLDERBENCH 98/233 ... OK",
  "MEMORY: 32768K SERVICE RAM ... OK",
  "BUS A: DESKTOP INTERFACE ... OK",
  "VOLUME C: PROGRAMS ... READY",
  "VOLTAGE RAIL: NOMINAL",
  "HANDOFF: STARTUP VOLUME MKS_SYS",
] as const;

export function BootPrompt({ onBoot, onAccessibleSite }: BootPromptProps) {
  return (
    <section className={styles.bootScreen} aria-label="Choose how to enter murakams.com">
      <div className={styles.offDisplay}>
        <p className={styles.eyebrow}>MKS LABS / PERSONAL ARCHIVE</p>
        <h1 className={styles.powerTitle}>Choose your experience.</h1>
        <p className={styles.powerCopy}>
          Boot the interactive MKS/98 desktop, or open the accessible site without startup motion
          and overlapping windows.
        </p>
        <div className={styles.primaryControls}>
          <button type="button" className={styles.bootButton} onClick={onBoot} autoFocus>
            Boot MKS/98
          </button>
          <button type="button" className={styles.bootButton} onClick={onAccessibleSite}>
            Accessible site
          </button>
        </div>
      </div>
    </section>
  );
}

export function BootScreen({
  phase,
  soundEnabled,
  onSoundEnabledChange,
  onSkip,
  onAccessibleSite,
}: BootScreenProps) {
  useEffect(() => {
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onSkip();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onSkip]);

  const status =
    phase === "post" ? "Hardware checks in progress." : "MKS/98 is starting the desktop.";

  return (
    <section className={styles.bootScreen} aria-label="MKS/98 startup" aria-busy="true">
      {phase === "post" ? (
        <div className={styles.postDisplay}>
          <p className={styles.postHeading}>FIELD SERVICE TERMINAL / POST</p>
          <div className={styles.diagnosticLog} aria-hidden="true">
            {diagnosticLines.map((line, index) => (
              <p key={line} style={{ animationDelay: `${index * 105}ms` }}>
                {line}
              </p>
            ))}
            <span className={styles.cursor}>_</span>
          </div>
          <p className={styles.visuallyHidden}>
            MKS/98 power-on self test. Processor, memory, desktop interface, programs volume, and
            voltage rail are ready.
          </p>
        </div>
      ) : (
        <div className={styles.splashDisplay}>
          <div className={styles.splashMark} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className={styles.splashKicker}>HOBBYIST WORKSTATION</p>
          <h1 className={styles.splashTitle}>MKS/98</h1>
          <p className={styles.splashSubtitle}>Workbench Operating System</p>
          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progressBar} />
          </div>
          <p className={styles.splashStatus}>Loading desktop...</p>
        </div>
      )}
      <div className={styles.bootControls}>
        <button
          type="button"
          className={styles.bootButton}
          aria-pressed={soundEnabled}
          onClick={() => onSoundEnabledChange(!soundEnabled)}
        >
          Sound: {soundEnabled ? "on" : "off"}
        </button>
        <button type="button" className={styles.bootButton} onClick={onSkip}>
          Skip startup <span className={styles.keyHint}>Esc</span>
        </button>
        <button type="button" className={styles.bootButton} onClick={onAccessibleSite}>
          Accessible site
        </button>
      </div>
      <p className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </section>
  );
}
