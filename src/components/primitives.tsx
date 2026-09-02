import Link from "next/link";
import type { ReactNode } from "react";
import { statusColorMap, type StatusKey } from "@/design/tokens";

/* Shared UI primitives consuming design tokens. */

type ContainerWidth = "prose" | "narrow" | "default" | "wide";

const containerMaxClass: Record<ContainerWidth, string> = {
  prose: "max-w-[var(--container-prose)]",
  narrow: "max-w-[var(--container-narrow)]",
  default: "max-w-[var(--container-default)]",
  wide: "max-w-[var(--container-wide)]",
};

export function Container({
  children,
  width = "default",
  className = "",
}: {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-[var(--space-gutter)] ${containerMaxClass[width]} ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`py-[var(--space-section)] ${className}`}>{children}</section>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex border-l-4 border-action bg-surface-raised px-2.5 py-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-foreground">
      {children}
    </p>
  );
}

export function Heading({
  level = 2,
  children,
  className = "",
}: {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const sizeClass =
    level === 1
      ? "text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl"
      : level === 2
        ? "text-2xl font-bold leading-tight tracking-[-0.025em] sm:text-4xl"
        : level === 3
          ? "text-xl font-bold leading-tight tracking-[-0.015em] sm:text-2xl"
          : "text-lg font-bold leading-tight tracking-[-0.01em]";
  return <Tag className={`${sizeClass} text-balance ${className}`}>{children}</Tag>;
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`max-w-[var(--container-prose)] text-base leading-7 text-foreground/90 [&_a]:font-semibold [&_a]:text-link [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_code]:font-mono [&_code]:text-sm [&_p]:mb-4 [&_strong]:font-bold ${className}`}
    >
      {children}
    </div>
  );
}

export function TextLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const linkClass = `font-semibold text-link underline decoration-1 underline-offset-4 transition-colors hover:text-foreground ${className}`;
  const externalProps = external ? { target: "_blank" as const, rel: "noreferrer noopener" } : {};
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={linkClass} {...externalProps}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={linkClass} {...externalProps}>
      {children}
    </a>
  );
}

export function ButtonLink({
  href,
  children,
  className = "",
  external = false,
  variant = "secondary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-sm border-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] transition-[background-color,color,border-color,transform,box-shadow] active:translate-x-px active:translate-y-px active:shadow-none";
  const variantClass =
    variant === "primary"
      ? "border-action bg-action text-action-foreground shadow-[3px_3px_0_var(--color-structural-deep)] hover:border-foreground hover:bg-action/90"
      : "border-structural bg-surface text-foreground shadow-[3px_3px_0_var(--color-border)] hover:bg-surface-raised";
  const externalProps = external ? { target: "_blank" as const, rel: "noreferrer noopener" } : {};
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={`${base} ${variantClass} ${className}`} {...externalProps}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={`${base} ${variantClass} ${className}`} {...externalProps}>
      {children}
    </a>
  );
}

/**
 * Section heading with a leading rule. Shared device for surfaces that need
 * a structural divider above a heading without an eyebrow label.
 */
export function SectionHeading({
  label,
  accent = false,
  className = "",
}: {
  label: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 ${className}`}>
      <span className={`h-1 w-full ${accent ? "bg-action" : "bg-structural"}`} aria-hidden="true" />
      <Heading level={2} className="text-xl sm:text-2xl">
        {label}
      </Heading>
    </div>
  );
}

const statusKeyClass: Record<StatusKey, string> = {
  healthy: "text-status-healthy",
  degraded: "text-status-degraded",
  unhealthy: "text-status-unhealthy",
  unknown: "text-status-unknown",
};

const statusDotBg: Record<StatusKey, string> = {
  healthy: "bg-status-healthy",
  degraded: "bg-status-degraded",
  unhealthy: "bg-status-unhealthy",
  unknown: "bg-status-unknown",
};

export function StatusLabel({
  status,
  label,
  className = "",
}: {
  status: StatusKey;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${statusKeyClass[status]} ${className}`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 border border-current ${statusDotBg[status]}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border-strong bg-surface-raised px-2 py-0.5 font-mono text-[0.6875rem] font-medium text-foreground">
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-sm border border-border-strong border-t-4 border-t-structural bg-surface shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export { statusColorMap };
