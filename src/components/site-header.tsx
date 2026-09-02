"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/design/site-config";
import { ThemeToggle } from "@/components/theme-toggle";
import { useIsMobile } from "@/components/motion";
import { ExperienceSwitch } from "@/features/experience/experience-provider";

function isCurrent(pathname: string, matchPrefix: string): boolean {
  if (matchPrefix === "/") return pathname === "/";
  return pathname === matchPrefix || pathname.startsWith(`${matchPrefix}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-structural-deep text-structural-foreground shadow-md">
      <div className="mx-auto flex min-h-16 w-full max-w-[var(--container-default)] items-center justify-between gap-4 px-[var(--space-gutter)] py-2">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-3 font-mono text-sm font-bold tracking-tight text-structural-foreground"
          onClick={() => setOpen(false)}
        >
          <span
            className="site-brand-mark h-7 w-7 shrink-0 border border-structural-foreground/70 transition-colors group-hover:border-action"
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="block truncate">murakams.com</span>
            <span className="block text-[0.5625rem] font-medium uppercase tracking-[0.18em] text-structural-foreground/75">
              MKS/98 accessible
            </span>
          </span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <span className="theme-control inline-flex">
              <ThemeToggle />
            </span>
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex min-h-11 items-center justify-center rounded-sm border border-structural-foreground/60 bg-transparent px-3 font-mono text-xs font-bold uppercase tracking-[0.1em] text-structural-foreground transition-colors hover:border-action hover:bg-structural-deep hover:text-action"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        ) : (
          <nav aria-label="Primary" className="flex items-center gap-1">
            {navItems.map((item) => {
              const current = isCurrent(pathname, item.matchPrefix);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-sm border px-2.5 py-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors ${
                    current
                      ? "border-action bg-action text-action-foreground"
                      : "border-transparent text-structural-foreground hover:border-structural-foreground/50 hover:bg-structural-deep"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <span className="mx-2 h-7 w-px bg-structural-foreground/35" aria-hidden="true" />
            <ExperienceSwitch
              target="immersive"
              className="min-h-10 rounded-sm border-2 border-action bg-transparent px-3 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-action transition-colors hover:bg-action hover:text-action-foreground"
            >
              Launch MKS/98
            </ExperienceSwitch>
            <span className="theme-control ml-1 inline-flex">
              <ThemeToggle />
            </span>
          </nav>
        )}
      </div>

      {isMobile && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          hidden={!open}
          className="border-t border-structural-foreground/25 bg-structural-deep"
        >
          <ul className="mx-auto grid w-full max-w-[var(--container-default)] grid-cols-2 gap-px bg-structural-foreground/20 px-[var(--space-gutter)] py-3">
            {navItems.map((item) => {
              const current = isCurrent(pathname, item.matchPrefix);
              return (
                <li key={item.href} className="bg-structural-deep">
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block min-h-11 rounded-sm border px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                      current
                        ? "border-action bg-action text-action-foreground"
                        : "border-transparent text-structural-foreground hover:border-structural-foreground/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="col-span-2 mt-2 bg-structural-deep">
              <ExperienceSwitch
                target="immersive"
                className="block min-h-11 w-full rounded-sm border-2 border-action px-3 py-3 text-left font-mono text-xs font-bold uppercase tracking-[0.08em] text-action transition-colors hover:bg-action hover:text-action-foreground"
              >
                Launch MKS/98
              </ExperienceSwitch>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
