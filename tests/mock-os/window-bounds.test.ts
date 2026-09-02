import { describe, expect, it } from "vitest";
import { fitWindowToWorkspace } from "../../src/features/mock-os/state/window-bounds";

describe("MKS/98 window bounds", () => {
  it("preserves a window already inside the workspace", () => {
    expect(
      fitWindowToWorkspace({ x: 20, y: 30, width: 400, height: 300 }, { width: 900, height: 700 }),
    ).toEqual({ x: 20, y: 30, width: 400, height: 300 });
  });

  it("moves an overflowing window back into reach", () => {
    expect(
      fitWindowToWorkspace(
        { x: 760, y: 620, width: 400, height: 300 },
        { width: 900, height: 700 },
      ),
    ).toEqual({ x: 500, y: 400, width: 400, height: 300 });
  });

  it("shrinks a window larger than the workspace", () => {
    expect(
      fitWindowToWorkspace(
        { x: -40, y: -20, width: 1200, height: 900 },
        { width: 390, height: 790 },
      ),
    ).toEqual({ x: 0, y: 0, width: 390, height: 790 });
  });
});
