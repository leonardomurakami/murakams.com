"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

/**
 * Motion primitives.
 *
 * Motion is used only to communicate navigation, state transitions, hierarchy,
 * or interaction feedback. These wrappers centralize prefers-reduced-motion
 * handling so individual components never re-implement it.
 *
 * When reduced motion is requested, non-essential motion is simplified to
 * near-instant transitions and no content is hidden or made inaccessible.
 */

export function usePrefersReducMotion(): boolean {
  const reduced = useReducedMotion();
  return Boolean(reduced);
}

/**
 * Subtle content entrance. Fades + lifts slightly; collapses to a fade (or
 * instant) when reduced motion is requested.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number }) {
  const reduce = usePrefersReducMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0.01 } : { duration: 0.36, delay, ease: [0.2, 0, 0, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * State-change transition for status indicators (e.g. infra health/sync).
 * Animates color/scale subtly; collapses to an instant swap under reduced motion.
 */
export function StatusTransition({ children, className, ...rest }: HTMLMotionProps<"span">) {
  const reduce = usePrefersReducMotion();
  return (
    <motion.span
      className={className}
      initial={false}
      animate={{ scale: reduce ? 1 : [1, 1.08, 1] }}
      transition={reduce ? { duration: 0.01 } : { duration: 0.36, ease: [0.2, 0, 0, 1] }}
      {...rest}
    >
      {children}
    </motion.span>
  );
}

/**
 * Shared-layout wrapper for project transitions / expanding content.
 * Uses layout animations; disabled (layout) under reduced motion.
 */
export function SharedLayout({ children, className, ...rest }: HTMLMotionProps<"div">) {
  const reduce = usePrefersReducMotion();
  return (
    <motion.div
      className={className}
      layout={reduce ? false : true}
      transition={reduce ? { duration: 0.01 } : { duration: 0.28, ease: [0.2, 0, 0, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hook that returns whether the viewport is mobile-ish. Used by navigation to
 * decide between desktop and mobile patterns. Not motion-related but colocated
 * with client UI concerns.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}
