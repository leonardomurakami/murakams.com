"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { StatusKey } from "@/design/tokens";

/**
 * Clippy — the site's one self-aware resident.
 *
 * Uses the classic Microsoft Office Assistant paperclip character (from the
 * open-source felixrieseberg/clippy asset pack). A small fixed assistant
 * that reacts to the actual infrastructure state and links to recovery
 * context. Dismissible per session, respects reduced motion, never blocks
 * navigation or content.
 *
 * Delight thesis: the site should feel like a reliable engineer's workspace
 * that has one useful, self-aware resident — not a portfolio wearing novelty.
 * Clippy reacts to real state and points to real recovery, so the personality
 * is the product, not decoration.
 */

type ClippyStatus = Exclude<StatusKey, "unknown"> | "unknown";

const LINES: Record<ClippyStatus, { text: string; cta: string }> = {
  healthy: {
    text: "Looks like everything is running. I'll be here if that changes.",
    cta: "See the dashboard",
  },
  degraded: {
    text: "Heads up — something is degraded. Probably fine. Probably.",
    cta: "What's degraded?",
  },
  unhealthy: {
    text: "We have an unhealthy application. I'm not panicking, but you might want to look.",
    cta: "Open /infra",
  },
  unknown: {
    text: "I can't tell what the cluster is doing. That's... not ideal.",
    cta: "Check /infra",
  },
};

export function Clippy({
  status,
  unhealthyCount = 0,
}: {
  status: ClippyStatus;
  unhealthyCount?: number;
}) {
  const reduce = Boolean(useReducedMotion());
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("clippy-dismissed") === "1";
    } catch {
      return false;
    }
  });

  // Auto-open once after a short delay, unless reduced motion or dismissed.
  useEffect(() => {
    if (dismissed || reduce) return;
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, [dismissed, reduce]);

  // Persist dismissal for the session so it doesn't nag on re-entry.
  useEffect(() => {
    if (!dismissed) return;
    try {
      sessionStorage.setItem("clippy-dismissed", "1");
    } catch {
      /* sessionStorage may be unavailable; non-fatal */
    }
  }, [dismissed]);

  const line = LINES[status];
  const ctaHref = "/infra";

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6" aria-live="polite">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Clippy assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={reduce ? { duration: 0.01 } : { duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className="mb-3 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-surface p-4 shadow-md"
          >
            <div className="flex items-start gap-3">
              {/* Classic Clippy character — the real paperclip, not an imitation */}
              <Image
                src="/clippy/icon.png"
                alt=""
                width={40}
                height={40}
                className="mt-0.5 h-10 w-10 shrink-0 select-none"
                draggable={false}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-foreground/90">
                  {line.text}
                  {status === "unhealthy" && unhealthyCount > 0 && (
                    <span className="font-mono text-status-unhealthy"> ({unhealthyCount})</span>
                  )}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Link
                    href={ctaHref}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-accent underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    {line.cta} →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setDismissed(true);
                    }}
                    className="ml-auto font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The toggle — Clippy himself. The real character image, not a proxy. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide Clippy" : "Show Clippy"}
        aria-expanded={open}
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface shadow-md transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Image
          src="/clippy/icon.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 select-none transition-transform group-hover:rotate-6"
          draggable={false}
        />
        {/* Status dot — ties the character to live infra state */}
        <span
          className={`absolute -right-0.5 -top-0.5 inline-block h-3 w-3 rounded-full border-2 border-background ${
            status === "healthy"
              ? "bg-status-healthy"
              : status === "degraded"
                ? "bg-status-degraded"
                : status === "unhealthy"
                  ? "bg-status-unhealthy animate-status-pulse"
                  : "bg-status-unknown"
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
