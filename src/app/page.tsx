import type { Metadata } from "next";
import Link from "next/link";
import {
  ButtonLink,
  Container,
  Heading,
  Section,
  SectionHeading,
  StatusLabel,
  Tag,
} from "@/components/primitives";
import { FadeIn } from "@/components/motion";
import { featuredProjects } from "@/content/projects/projects";
import { projectStatusLabels, projectStatusKey } from "@/content/projects/schema";
import { getInfrastructureStatusSync } from "@/infra/api";
import { InfraSummary } from "@/features/infra/infra-components";
import { siteConfig } from "@/design/site-config";
import type { PublicInfrastructureSnapshot } from "@/infra/public-schema";

export const metadata: Metadata = {
  title: "Leonardo Murakami — SRE & Software Engineer",
  description: siteConfig.description,
};

/** Derive overall health from a snapshot's aggregate counts. */
function overallStatus(
  summary: PublicInfrastructureSnapshot["summary"],
): "healthy" | "degraded" | "unhealthy" | "unknown" {
  if (summary.unhealthy > 0) return "unhealthy";
  if (summary.degraded > 0) return "degraded";
  if (summary.unknown > 0) return "unknown";
  return "healthy";
}

const focusStack = ["Kubernetes", "ArgoCD", "GitOps", "Cilium", "Traefik", "SOPS", "Renovate"];

export default function HomePage() {
  const { snapshot } = getInfrastructureStatusSync();
  const projects = featuredProjects.slice(0, 3);
  const status = overallStatus(snapshot.summary);
  const statusDotClass = {
    healthy: "bg-status-healthy",
    degraded: "bg-status-degraded",
    unhealthy: "bg-status-unhealthy",
    unknown: "bg-status-unknown",
  }[status];
  const statusWord = {
    healthy: "All systems operational",
    degraded: "Degraded",
    unhealthy: "Unhealthy",
    unknown: "Unknown",
  }[status];

  return (
    <>
      <section className="home-hero-field border-b-4 border-action text-structural-foreground">
        <Container>
          <FadeIn className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.75fr)] lg:items-center lg:gap-16 lg:py-28">
            <div className="relative z-10">
              <Heading
                level={1}
                className="max-w-3xl text-5xl text-structural-foreground sm:text-7xl"
              >
                Leonardo Murakami
              </Heading>
              <p className="mt-5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-action sm:text-base">
                {siteConfig.author.role}
              </p>
              <p className="mt-7 max-w-[42rem] text-base leading-7 text-structural-foreground/90 sm:text-lg sm:leading-8">
                I&rsquo;m {siteConfig.author.name}, a site reliability engineer focused on platform
                reliability, declarative infrastructure, and the boring systems that let teams move
                quickly without breaking production. This site is a home for my projects, a live
                view of my personal infrastructure, experiments, and my career so far.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/projects" variant="primary">
                  View projects
                </ButtonLink>
                <ButtonLink
                  href="/infra"
                  className="border-structural-foreground/70 bg-transparent text-structural-foreground shadow-[3px_3px_0_var(--color-structural-deep)] hover:bg-structural-deep"
                >
                  Infrastructure status
                </ButtonLink>
                <ButtonLink
                  href="/resume"
                  className="border-structural-foreground/70 bg-transparent text-structural-foreground shadow-[3px_3px_0_var(--color-structural-deep)] hover:bg-structural-deep"
                >
                  Resume
                </ButtonLink>
              </div>
            </div>

            <aside
              aria-labelledby="current-focus-heading"
              className="relative z-10 border border-structural-deep border-t-8 border-t-action bg-surface p-6 text-foreground shadow-[7px_7px_0_var(--color-structural-deep)] sm:p-7"
            >
              <h2 id="current-focus-heading" className="text-2xl font-bold tracking-tight">
                Current focus
              </h2>
              <p className="mt-4 text-sm leading-6 text-foreground/90">
                Platform reliability on a GitOps-driven Kubernetes stack — progressive delivery,
                observability, policy-as-code, and reducing operational toil through self-service
                tooling. On my own time I run a homelab GitOps platform whose sanitized status feeds
                the{" "}
                <Link
                  href="/infra"
                  className="font-semibold text-link underline underline-offset-4"
                >
                  /infra
                </Link>{" "}
                view on this site.
              </p>
              <div className="mt-6 border-t border-border-strong pt-5">
                <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted">
                  Working stack
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {focusStack.map((technology) => (
                    <Tag key={technology}>{technology}</Tag>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-strong pt-5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted">
                <span
                  className={`inline-block h-2.5 w-2.5 border border-current ${statusDotClass} animate-status-pulse`}
                  aria-hidden="true"
                />
                <span className="text-foreground">{statusWord}</span>
                <span>{snapshot.summary.total} applications tracked</span>
              </div>
            </aside>
          </FadeIn>
        </Container>
      </section>

      <Section className="border-b border-border-strong">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading label="Selected engineering work" />
            <Link
              href="/projects"
              className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-link underline underline-offset-4"
            >
              View all projects
            </Link>
          </div>

          <ol className="mt-10 divide-y divide-border-strong border-y-2 border-border-strong">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="home-project-row group gap-x-4 gap-y-4 px-3 py-6 transition-colors sm:px-4 sm:py-7"
                >
                  <span className="font-mono text-xs font-bold text-muted" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <Heading level={3} className="text-xl group-hover:text-link sm:text-2xl">
                        {project.title}
                      </Heading>
                      <StatusLabel
                        status={projectStatusKey[project.status]}
                        label={projectStatusLabels[project.status]}
                      />
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                      {project.shortDescription}
                    </p>
                  </div>
                  <div className="flex min-w-0 flex-col items-start justify-between gap-4 sm:items-end">
                    <div className="flex flex-wrap gap-1.5 sm:justify-end">
                      {project.technologies.slice(0, 4).map((technology) => (
                        <Tag key={technology}>{technology}</Tag>
                      ))}
                    </div>
                    <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-link underline underline-offset-4">
                      Open case study
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-surface-raised/75">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-start lg:gap-16">
            <div>
              <SectionHeading label="Public infrastructure" />
              <p className="mt-5 max-w-prose text-base leading-7 text-muted">
                A compact view of the same sanitized status data available on the infrastructure
                page. ArgoCD and the cluster are never exposed to the Internet.
              </p>
              <Link
                href="/infra"
                className="mt-6 inline-block font-mono text-xs font-bold uppercase tracking-[0.1em] text-link underline underline-offset-4"
              >
                Open infrastructure status
              </Link>
            </div>

            <Link
              href="/infra"
              className="home-infra-board block border-2 border-structural bg-surface shadow-[6px_6px_0_var(--color-border-strong)] transition-transform active:translate-x-px active:translate-y-px"
            >
              <span className="flex items-center justify-between gap-4 border-b-4 border-action bg-structural px-4 py-3 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-structural-foreground sm:px-5">
                <span>Public status feed</span>
                <span>{statusWord}</span>
              </span>
              <div className="p-5 sm:p-6">
                <InfraSummary snapshot={snapshot} />
                <p className="mt-4 text-sm leading-6 text-muted">
                  {snapshot.summary.total} applications tracked. Only allowlisted fields are shown —
                  ArgoCD and the cluster are never exposed to the Internet.
                </p>
              </div>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
