/**
 * Typed mirror of the design tokens defined in src/app/globals.css.
 *
 * Tokens remain authored in CSS (@theme) so Tailwind utilities are generated
 * automatically. This module re-exports the names/values that need to be
 * referenced from JS (e.g. motion durations/easings in motion primitives).
 *
 * Keep these in sync with globals.css. Components MUST consume tokens via
 * Tailwind utilities or CSS variables — do not introduce ad-hoc literals.
 */

export const motionTokens = {
  duration: {
    fast: "var(--duration-fast)",
    base: "var(--duration-base)",
    slow: "var(--duration-slow)",
  },
  ease: {
    standard: "var(--ease-standard)",
    emphasized: "var(--ease-emphasized)",
  },
} as const;

export const containerTokens = {
  prose: "var(--container-prose)",
  narrow: "var(--container-narrow)",
  default: "var(--container-default)",
  wide: "var(--container-wide)",
} as const;

export const spacingTokens = {
  gutter: "var(--space-gutter)",
  section: "var(--space-section)",
} as const;

export const colorTokens = {
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  surfaceRaised: "var(--color-surface-raised)",
  foreground: "var(--color-foreground)",
  muted: "var(--color-muted)",
  mutedForeground: "var(--color-muted-foreground)",
  border: "var(--color-border)",
  borderStrong: "var(--color-border-strong)",
  structural: "var(--color-structural)",
  structuralDeep: "var(--color-structural-deep)",
  structuralForeground: "var(--color-structural-foreground)",
  action: "var(--color-action)",
  actionForeground: "var(--color-action-foreground)",
  link: "var(--color-link)",
  accent: "var(--color-accent)",
  accentForeground: "var(--color-accent-foreground)",
  accentMuted: "var(--color-accent-muted)",
  status: {
    healthy: "var(--color-status-healthy)",
    degraded: "var(--color-status-degraded)",
    unhealthy: "var(--color-status-unhealthy)",
    unknown: "var(--color-status-unknown)",
  },
} as const;

export const radiusTokens = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
} as const;

/** Status colors shared by infra + project status representations. */
export const statusColorMap = {
  healthy: "var(--color-status-healthy)",
  degraded: "var(--color-status-degraded)",
  unhealthy: "var(--color-status-unhealthy)",
  unknown: "var(--color-status-unknown)",
} as const;

export type StatusKey = keyof typeof statusColorMap;
