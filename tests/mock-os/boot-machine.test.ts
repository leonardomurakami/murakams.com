import { describe, expect, it } from "vitest";
import {
  AUTHORED_BOOT_DURATION_MS,
  bootReducer,
  initialBootState,
  type BootAction,
  type BootState,
} from "@/features/mock-os/boot/boot-machine";

function transition(state: BootState, ...actions: BootAction[]): BootState {
  return actions.reduce(bootReducer, state);
}

describe("MKS/98 boot machine", () => {
  it("moves through off, post, splash, and desktop in order", () => {
    const post = bootReducer(initialBootState, { type: "power" });
    const splash = bootReducer(post, { type: "post-done" });
    const desktop = bootReducer(splash, { type: "splash-done" });

    expect(initialBootState.phase).toBe("off");
    expect(post.phase).toBe("post");
    expect(splash.phase).toBe("splash");
    expect(desktop.phase).toBe("desktop");
  });

  it("ignores completion and power events outside their legal phases", () => {
    const offAfterCompletions = transition(
      initialBootState,
      { type: "post-done" },
      { type: "splash-done" },
    );
    const post = transition(initialBootState, { type: "power" });
    const postAfterPower = bootReducer(post, { type: "power" });
    const postAfterSplashDone = bootReducer(post, { type: "splash-done" });
    const desktop = transition(post, { type: "post-done" }, { type: "splash-done" });

    expect(offAfterCompletions).toBe(initialBootState);
    expect(postAfterPower).toBe(post);
    expect(postAfterSplashDone).toBe(post);
    expect(bootReducer(desktop, { type: "post-done" })).toBe(desktop);
    expect(bootReducer(desktop, { type: "power" })).toBe(desktop);
  });

  it("skips directly to desktop only while startup is active", () => {
    const post = bootReducer(initialBootState, { type: "power" });
    const splash = bootReducer(post, { type: "post-done" });
    const desktopFromPost = bootReducer(post, { type: "skip" });
    const desktopFromSplash = bootReducer(splash, { type: "skip" });

    expect(bootReducer(initialBootState, { type: "skip" })).toBe(initialBootState);
    expect(desktopFromPost.phase).toBe("desktop");
    expect(desktopFromSplash.phase).toBe("desktop");
    expect(bootReducer(desktopFromSplash, { type: "skip" })).toBe(desktopFromSplash);
  });

  it("resets interrupted startup and ignores stale completion events", () => {
    const post = bootReducer(initialBootState, { type: "power" });
    const resetFromPost = bootReducer(post, { type: "reset" });
    const splash = transition(initialBootState, { type: "power" }, { type: "post-done" });
    const resetFromSplash = bootReducer(splash, { type: "reset" });

    expect(resetFromPost).toEqual({ phase: "off" });
    expect(resetFromSplash).toEqual({ phase: "off" });
    expect(bootReducer(resetFromPost, { type: "post-done" })).toBe(resetFromPost);
    expect(bootReducer(resetFromSplash, { type: "splash-done" })).toBe(resetFromSplash);
  });

  it("can return a running desktop to a fresh powered-off state", () => {
    const desktop = transition(
      initialBootState,
      { type: "power" },
      { type: "post-done" },
      { type: "splash-done" },
    );

    expect(bootReducer(desktop, { type: "reset" })).toBe(initialBootState);
    expect(bootReducer(initialBootState, { type: "reset" })).toBe(initialBootState);
  });

  it("keeps the authored unskipped startup between two and four seconds", () => {
    expect(AUTHORED_BOOT_DURATION_MS).toBeGreaterThanOrEqual(2000);
    expect(AUTHORED_BOOT_DURATION_MS).toBeLessThanOrEqual(4000);
  });
});
