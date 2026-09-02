"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import {
  isExperience,
  persistExperienceAndReload,
  type Experience,
} from "@/features/experience/preference";

const EXPERIENCE_CHANGE_EVENT = "mks98experiencechange";

type ExperienceContextValue = {
  experience: Experience;
  setExperience: (experience: Experience) => void;
};

const ExperienceContext = createContext<ExperienceContextValue | undefined>(undefined);

function subscribe(callback: () => void): () => void {
  window.addEventListener(EXPERIENCE_CHANGE_EVENT, callback);
  return () => window.removeEventListener(EXPERIENCE_CHANGE_EVENT, callback);
}

function getSnapshot(): Experience {
  const value = document.documentElement.getAttribute("data-experience");
  return isExperience(value) ? value : "accessible";
}

function getServerSnapshot(): Experience {
  return "accessible";
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const experience = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setExperience = useCallback((next: Experience) => {
    try {
      persistExperienceAndReload(next, {
        storage: window.localStorage,
        reloadCurrentRoute: () => window.location.reload(),
      });
    } catch {
      document.documentElement.setAttribute("data-experience", next);
      window.dispatchEvent(new Event(EXPERIENCE_CHANGE_EVENT));
    }
  }, []);

  return (
    <ExperienceContext.Provider value={{ experience, setExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function AccessibleExperience({ children }: { children: React.ReactNode }) {
  const { experience } = useExperience();
  const inactive = experience !== "accessible";

  return (
    <div
      data-experience-region="accessible"
      className="experience-canonical min-h-full flex-1 flex-col"
      aria-hidden={inactive ? true : undefined}
      inert={inactive ? true : undefined}
    >
      {children}
    </div>
  );
}

export function ExperienceSwitch({
  target,
  children,
  className,
}: {
  target: Experience;
  children: React.ReactNode;
  className?: string;
}) {
  const { setExperience } = useExperience();

  return (
    <button type="button" className={className} onClick={() => setExperience(target)}>
      {children}
    </button>
  );
}

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within ExperienceProvider");
  }
  return context;
}
