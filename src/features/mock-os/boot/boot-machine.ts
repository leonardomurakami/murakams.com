export type BootPhase = "off" | "post" | "splash" | "desktop";

export type BootAction =
  | { type: "power" }
  | { type: "post-done" }
  | { type: "splash-done" }
  | { type: "skip" }
  | { type: "reset" };

export interface BootState {
  phase: BootPhase;
}

export interface BootTiming {
  postMs: number;
  splashMs: number;
}

export const DEFAULT_BOOT_TIMING: Readonly<BootTiming> = Object.freeze({
  postMs: 1800,
  splashMs: 1400,
});

export const AUTHORED_BOOT_DURATION_MS = DEFAULT_BOOT_TIMING.postMs + DEFAULT_BOOT_TIMING.splashMs;

export const initialBootState: BootState = Object.freeze({ phase: "off" });

const postState: BootState = Object.freeze({ phase: "post" });
const splashState: BootState = Object.freeze({ phase: "splash" });
const desktopState: BootState = Object.freeze({ phase: "desktop" });

export function isBooting(phase: BootPhase): phase is "post" | "splash" {
  return phase === "post" || phase === "splash";
}

export function bootReducer(state: BootState, action: BootAction): BootState {
  switch (action.type) {
    case "power":
      return state.phase === "off" ? postState : state;
    case "post-done":
      return state.phase === "post" ? splashState : state;
    case "splash-done":
      return state.phase === "splash" ? desktopState : state;
    case "skip":
      return isBooting(state.phase) ? desktopState : state;
    case "reset":
      return state.phase === "off" ? state : initialBootState;
  }
}
