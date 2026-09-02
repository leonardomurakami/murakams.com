export interface WindowRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WorkspaceBounds {
  width: number;
  height: number;
}

export function fitWindowToWorkspace(
  rectangle: WindowRectangle,
  workspace: WorkspaceBounds,
): WindowRectangle {
  const width = Math.max(1, Math.min(rectangle.width, workspace.width));
  const height = Math.max(1, Math.min(rectangle.height, workspace.height));
  return {
    x: Math.max(0, Math.min(rectangle.x, workspace.width - width)),
    y: Math.max(0, Math.min(rectangle.y, workspace.height - height)),
    width,
    height,
  };
}
