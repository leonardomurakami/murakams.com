import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import type { ReactNode } from "react";
import { Container, StatusLabel } from "@/components/primitives";
import { AnimatedDiagram } from "@/components/diagram";
import { getProjectBySlug, getProjectSlugs, projects } from "@/content/projects/projects";
import { projectStatusKey, projectStatusLabels } from "@/content/projects/schema";
import type { ProjectLink, VisualMaterial } from "@/content/projects/schema";
import styles from "@/features/projects/projects.module.css";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
      description: "The requested project is not present in the engineering catalog.",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/projects/${project.slug}`;

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.shortDescription,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
    },
  };
}

/** Prepares SVG markup for token-based color theming and connector animation. */
async function inlineSvg(src: string): Promise<string | null> {
  if (!src.endsWith(".svg")) return null;

  let raw: string;
  try {
    raw = await fs.readFile(path.join(process.cwd(), "public", src), "utf-8");
  } catch {
    return null;
  }

  const withClass = raw.replace(/<svg /, '<svg class="diagram-svg" ');
  return withClass.replace(
    /(<line(?:(?!stroke-dasharray)[^>])*marker-end="[^"]*"[^>]*?)(\s*\/?>)/g,
    '$1 pathLength="1"$2',
  );
}

const sectionMeta = [
  { key: "problem", label: "Problem" },
  { key: "architecture", label: "Architecture" },
  { key: "implementation", label: "Implementation" },
  { key: "challenges", label: "Engineering challenges" },
  { key: "tradeoffs", label: "Decisions and trade-offs" },
] as const;

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = projects.filter((candidate) => candidate.slug !== project.slug).slice(0, 3);
  const visuals = await Promise.all(
    project.visualMaterial.map(async (material) => ({
      ...material,
      inlined: await inlineSvg(material.src),
    })),
  );

  return (
    <article className={styles.detailPage}>
      <Container width="wide" className={styles.detailTop}>
        <Link href="/projects" className={styles.backLink}>
          Return to project catalog
        </Link>

        <header className={styles.documentHeader}>
          <div className={styles.documentHeaderGrid}>
            <div className={styles.documentIdentity}>
              <h1>{project.title}</h1>
              <p>{project.shortDescription}</p>
              <p className={styles.documentType}>Engineering case study / MKS/98 project record</p>
            </div>

            <dl className={styles.projectMetadata}>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusLabel
                    className={styles.statusLabel}
                    status={projectStatusKey[project.status]}
                    label={projectStatusLabels[project.status]}
                  />
                </dd>
              </div>
              <div>
                <dt>Record</dt>
                <dd>{project.slug}</dd>
              </div>
              <div>
                <dt>Sections</dt>
                <dd>{sectionMeta.length.toString().padStart(2, "0")}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.technologyBand}>
            <p>Implementation stack</p>
            <ul aria-label={`Technologies used in ${project.title}`}>
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>

          {project.links.length > 0 && (
            <nav className={styles.projectDestinations} aria-label="Project destinations">
              {project.links.map((link) => (
                <ProjectDestinationLink link={link} key={link.href} />
              ))}
            </nav>
          )}
        </header>

        <nav className={styles.sectionNavigation} aria-label="Case study sections">
          <p>On this page</p>
          <ol>
            {sectionMeta.map((section, index) => (
              <li key={section.key}>
                <a href={`#${section.key}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Container>

      <Container width="wide" className={styles.documentContainer}>
        <div className={styles.technicalDocument}>
          <section
            id="problem"
            className={`${styles.documentSection} ${styles.problemSection}`}
            aria-labelledby="problem-title"
          >
            <SectionTitle id="problem-title" number="01">
              Problem
            </SectionTitle>
            <p className={styles.leadStatement}>{project.problem}</p>
          </section>

          <section
            id="architecture"
            className={`${styles.documentSection} ${styles.architectureSection}`}
            aria-labelledby="architecture-title"
          >
            <div className={styles.readingColumn}>
              <SectionTitle id="architecture-title" number="02">
                Architecture
              </SectionTitle>
              <p>{project.architecture}</p>
            </div>

            {visuals.length > 0 && (
              <div className={styles.diagramBreakout}>
                <div className={styles.figureRegister}>
                  <span>System architecture</span>
                  <span>{visuals.length === 1 ? "Figure 01" : `${visuals.length} figures`}</span>
                </div>
                <div className={styles.visualList}>
                  {visuals.map((material) => (
                    <InlineVisual key={material.src} material={material} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            id="implementation"
            className={`${styles.documentSection} ${styles.implementationSection}`}
            aria-labelledby="implementation-title"
          >
            <div className={styles.readingColumn}>
              <SectionTitle id="implementation-title" number="03">
                Implementation
              </SectionTitle>
              <p>{project.implementation}</p>
            </div>

            <aside className={styles.implementationInventory} aria-labelledby="inventory-title">
              <h3 id="inventory-title">Implementation inventory</h3>
              <dl>
                <div>
                  <dt>Technologies</dt>
                  <dd>{project.technologies.length}</dd>
                </div>
                <div>
                  <dt>Visual records</dt>
                  <dd>{project.visualMaterial.length}</dd>
                </div>
                <div>
                  <dt>Destinations</dt>
                  <dd>{project.links.length}</dd>
                </div>
              </dl>
              <ul>
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </aside>
          </section>

          <section
            id="challenges"
            className={`${styles.documentSection} ${styles.challengesSection}`}
            aria-labelledby="challenges-title"
          >
            <SectionTitle id="challenges-title" number="04">
              Engineering challenges
            </SectionTitle>
            <div className={styles.benchNote}>
              <p>{project.challenges}</p>
            </div>
          </section>

          <section
            id="tradeoffs"
            className={`${styles.documentSection} ${styles.tradeoffsSection}`}
            aria-labelledby="tradeoffs-title"
          >
            <SectionTitle id="tradeoffs-title" number="05">
              Decisions and trade-offs
            </SectionTitle>
            <p>{project.tradeoffs}</p>
          </section>
        </div>
      </Container>

      {related.length > 0 && (
        <Container width="wide" className={styles.relatedContainer}>
          <aside className={styles.relatedProjects} aria-labelledby="related-projects-title">
            <header>
              <h2 id="related-projects-title">Continue through the catalog</h2>
              <p>Open another engineering record from the mounted project ledger.</p>
            </header>
            <ul>
              {related.map((candidate) => (
                <li key={candidate.slug}>
                  <div>
                    <h3>{candidate.title}</h3>
                    <StatusLabel
                      className={styles.statusLabel}
                      status={projectStatusKey[candidate.status]}
                      label={projectStatusLabels[candidate.status]}
                    />
                  </div>
                  <Link
                    href={`/projects/${candidate.slug}`}
                    aria-label={`Read the ${candidate.title} case study`}
                  >
                    Read case study
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      )}
    </article>
  );
}

function SectionTitle({
  id,
  number,
  children,
}: {
  id: string;
  number: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className={styles.sectionTitle}>
      <span aria-hidden="true">{number}</span>
      {children}
    </h2>
  );
}

function ProjectDestinationLink({ link }: { link: ProjectLink }) {
  const external = !link.href.startsWith("/");
  const content = (
    <>
      <span className={styles.destinationLabel}>{link.label}</span>
      <span className={styles.destinationNote}>
        {external ? "External destination; opens in a new tab" : "Destination on this site"}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer noopener">
        {content}
      </a>
    );
  }

  return <Link href={link.href}>{content}</Link>;
}

function InlineVisual({ material }: { material: VisualMaterial & { inlined: string | null } }) {
  if (material.inlined) {
    return (
      <div className={styles.diagramFigure}>
        <AnimatedDiagram svgHtml={material.inlined} alt={material.alt} caption={material.caption} />
      </div>
    );
  }

  return (
    <figure className={styles.mediaFigure}>
      {material.type === "screenshot" || material.type === "other" ? (
        <Image
          src={material.src}
          alt={material.alt}
          width={1200}
          height={675}
          className={styles.mediaImage}
        />
      ) : material.type === "video" ? (
        <video
          src={material.src}
          controls
          aria-label={material.alt}
          className={styles.mediaImage}
        />
      ) : (
        <iframe
          src={material.src}
          title={material.alt}
          className={styles.mediaEmbed}
          loading="lazy"
        />
      )}
      {material.caption && <figcaption>{material.caption}</figcaption>}
    </figure>
  );
}
