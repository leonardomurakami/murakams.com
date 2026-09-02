export const EXPERIENCE_STORAGE_KEY = "mks98-experience";

export type Experience = "immersive" | "accessible";

export type ExperienceStorage = {
  setItem: (key: string, value: string) => void;
};

export type ExperienceRuntime = {
  storage: ExperienceStorage;
  reloadCurrentRoute: () => void;
};

export function isExperience(value: unknown): value is Experience {
  return value === "immersive" || value === "accessible";
}

export function resolveExperience(stored: unknown, prefersReducedMotion: boolean): Experience {
  if (isExperience(stored)) return stored;
  return prefersReducedMotion ? "accessible" : "immersive";
}

export function persistExperienceAndReload(
  experience: Experience,
  runtime: ExperienceRuntime,
): void {
  runtime.storage.setItem(EXPERIENCE_STORAGE_KEY, experience);
  runtime.reloadCurrentRoute();
}
