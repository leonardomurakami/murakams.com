import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, StatusLabel } from "@/components/primitives";
import { projects } from "@/content/projects/projects";
import { projectStatusKey, projectStatusLabels } from "@/content/projects/schema";
import styles from "@/features/projects/projects.module.css";

const description =
  "An engineering ledger of systems, applications, and coursework, with architecture, implementation, and design trade-offs.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects",
    description,
    url: "/projects",
  },
};

export default function ProjectsPage() {
  const activeProjects = projects.filter((project) => project.status === "active").length;

  return (
    <Section className={styles.page}>
      <Container width="wide">
        <header className={styles.catalogIntro}>
          <div>
            <h1 className={styles.catalogTitle}>Project disk catalog.</h1>
            <p className={styles.catalogLede}>
              A working ledger of systems, applications, and coursework. Each record opens into the
              problem, architecture, implementation, engineering challenges, and decisions behind
              the build.
            </p>
          </div>

          <aside className={styles.catalogSummary} aria-label="Catalog summary">
            <p className={styles.summaryName}>MKS/98 project media ledger</p>
            <dl>
              <div>
                <dt>Indexed records</dt>
                <dd>{projects.length.toString().padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Active systems</dt>
                <dd>{activeProjects.toString().padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Access mode</dt>
                <dd>Read only</dd>
              </div>
            </dl>
          </aside>
        </header>

        <section className={styles.ledger} aria-labelledby="project-ledger-title">
          <header className={styles.ledgerHeader}>
            <h2 id="project-ledger-title">Mounted engineering records</h2>
            <p>A:\PROJECTS\CATALOG</p>
          </header>

          <div className={styles.columnHeader} aria-hidden="true">
            <span>Disk</span>
            <span>Engineering record</span>
            <span>Status</span>
            <span>Implementation stack</span>
            <span>Document</span>
          </div>

          <ol className={styles.projectList}>
            {projects.map((project, index) => (
              <li className={styles.projectRow} key={project.slug}>
                <span className={styles.diskIndex} aria-label={`Disk ${index + 1}`}>
                  A:{String(index + 1).padStart(2, "0")}
                </span>

                <div className={styles.projectIdentity}>
                  <h3>{project.title}</h3>
                  <p>{project.shortDescription}</p>
                </div>

                <div className={styles.statusCell}>
                  <span className={styles.mobileFieldLabel}>Status</span>
                  <StatusLabel
                    className={styles.statusLabel}
                    status={projectStatusKey[project.status]}
                    label={projectStatusLabels[project.status]}
                  />
                </div>

                <div className={styles.stackCell}>
                  <span className={styles.mobileFieldLabel}>Implementation stack</span>
                  <ul aria-label={`Technologies used in ${project.title}`}>
                    {project.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className={styles.caseStudyLink}
                  aria-label={`Read the ${project.title} case study`}
                >
                  Read case study
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </Section>
  );
}
