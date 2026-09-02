"use client";

import { createContext, useContext } from "react";
import type { MockOsAppId } from "./registry";

export interface MockOsDesktopCommands {
  openApp: (appId: Exclude<MockOsAppId, "project" | "experiment" | "error">) => void;
  openProject: (slug: string) => void;
  openExperiment: (slug: string) => void;
  useAccessibleSite: () => void;
}

const MockOsDesktopContext = createContext<MockOsDesktopCommands | null>(null);

export const MockOsDesktopProvider = MockOsDesktopContext.Provider;

export function useMockOsDesktop(): MockOsDesktopCommands {
  const value = useContext(MockOsDesktopContext);
  if (!value) throw new Error("useMockOsDesktop must be used inside the MKS/98 desktop");
  return value;
}
