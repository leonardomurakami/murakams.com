"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  bootReducer,
  DEFAULT_BOOT_TIMING,
  initialBootState,
  isBooting,
  type BootPhase,
  type BootState,
  type BootTiming,
} from "./boot-machine";
import { playStartupChime, type StartupChimeHandle } from "./startup-chime";

export interface UseBootMachineOptions {
  initialSoundEnabled?: boolean;
  timing?: Readonly<BootTiming>;
}

export interface BootMachineController {
  state: BootState;
  phase: BootPhase;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  power: () => void;
  skip: () => void;
  reset: () => void;
}

export function useBootMachine(options: UseBootMachineOptions = {}): BootMachineController {
  const [state, dispatch] = useReducer(bootReducer, initialBootState);
  const [soundEnabled, setSoundEnabledState] = useState(options.initialSoundEnabled ?? true);
  const chime = useRef<StartupChimeHandle | null>(null);
  const postMs = options.timing?.postMs ?? DEFAULT_BOOT_TIMING.postMs;
  const splashMs = options.timing?.splashMs ?? DEFAULT_BOOT_TIMING.splashMs;

  useEffect(() => {
    if (state.phase !== "post") return;
    const timer = window.setTimeout(() => dispatch({ type: "post-done" }), postMs);
    return () => window.clearTimeout(timer);
  }, [postMs, state.phase]);

  useEffect(() => {
    if (state.phase !== "splash") return;
    const timer = window.setTimeout(() => dispatch({ type: "splash-done" }), splashMs);
    return () => window.clearTimeout(timer);
  }, [splashMs, state.phase]);

  useEffect(() => {
    return () => chime.current?.stop();
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    if (!enabled) {
      chime.current?.stop();
      chime.current = null;
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [setSoundEnabled, soundEnabled]);

  const power = useCallback(() => {
    if (state.phase !== "off") return;
    if (soundEnabled) {
      chime.current?.stop();
      chime.current = playStartupChime();
    }
    dispatch({ type: "power" });
  }, [soundEnabled, state.phase]);

  const skip = useCallback(() => {
    if (!isBooting(state.phase)) return;
    chime.current?.stop();
    chime.current = null;
    dispatch({ type: "skip" });
  }, [state.phase]);

  const reset = useCallback(() => {
    chime.current?.stop();
    chime.current = null;
    dispatch({ type: "reset" });
  }, []);

  return {
    state,
    phase: state.phase,
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    power,
    skip,
    reset,
  };
}
