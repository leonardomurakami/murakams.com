"use client";

export {
  Content as ManagedWindowContent,
  Desktop as ManagedDesktop,
  DesktopIconGrid as ManagedDesktopIconGrid,
  ResizeHandles as ManagedResizeHandles,
  Taskbar as ManagedTaskbar,
  Title as ManagedWindowTitle,
  TitleBar as ManagedTitleBar,
  Window as ManagedWindow,
  WindowControls as ManagedWindowControls,
  WindowFrame as ManagedWindowFrame,
  WindowManagerProvider as ManagedWindowProvider,
  createBrowserAdapter,
  createRegistry,
  defineWindows,
  useWindow,
  useWindowManager,
  useWindowRouting,
} from "glazier";

export type {
  DesktopRenderProps as ManagedDesktopRenderProps,
  IconState as ManagedIconState,
  Position as ManagedPosition,
  Size as ManagedSize,
  TaskbarRenderProps as ManagedTaskbarRenderProps,
  WindowConfig as ManagedWindowConfig,
  WindowDisplayState as ManagedWindowDisplayState,
  WindowRegistry as ManagedWindowRegistry,
  WindowState as ManagedWindowState,
} from "glazier";
