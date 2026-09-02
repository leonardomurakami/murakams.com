"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";

/** Animates themed inline SVG connectors while respecting reduced motion. */
export function AnimatedDiagram({
  svgHtml,
  alt,
  caption,
}: {
  svgHtml: string;
  alt: string;
  caption?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lines = container.querySelectorAll<SVGLineElement>(
      "svg.diagram-svg line[marker-end][pathLength]",
    );
    if (lines.length === 0) return;

    if (reduce) {
      lines.forEach((line) => {
        line.style.strokeDasharray = "";
        line.style.strokeDashoffset = "";
      });
      return;
    }

    lines.forEach((line) => {
      line.style.strokeDasharray = "1";
      line.style.strokeDashoffset = "1";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lines.forEach((line, i) => {
            line.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
              duration: 500,
              delay: i * 180,
              fill: "forwards",
              easing: "cubic-bezier(0.2, 0, 0, 1)",
            });
          });
          observer.disconnect();
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <figure role="img" aria-label={alt} ref={containerRef}>
      <div className="w-full" dangerouslySetInnerHTML={{ __html: svgHtml }} />
      {caption && (
        <figcaption className="mt-3 text-sm leading-6 text-muted text-pretty">{caption}</figcaption>
      )}
    </figure>
  );
}
