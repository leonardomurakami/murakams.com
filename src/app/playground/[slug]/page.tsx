import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/primitives";
import { getPlaygroundCatalog } from "@/content/playground/catalog-server";
import { getPlaygroundBySlug } from "@/content/playground/registry";
import { PlaygroundRunner, playgroundPresentation } from "@/features/playground/playground-browser";
import styles from "@/features/playground/playground.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, catalog] = await Promise.all([params, getPlaygroundCatalog()]);
  const entry = getPlaygroundBySlug(catalog.entries, slug);
  if (!entry) {
    return {
      title: catalog.status === "unavailable" ? "Labs unavailable" : "Experiment not found",
    };
  }
  return { title: entry.title, description: entry.description };
}

export default async function PlaygroundDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, catalog] = await Promise.all([params, getPlaygroundCatalog()]);
  const entry = getPlaygroundBySlug(catalog.entries, slug);

  if (!entry && catalog.status !== "unavailable") notFound();

  return (
    <Section className={styles.page}>
      <Container width="wide">
        <nav aria-label="Playground breadcrumb">
          <Link href="/playground" className={styles.backLink}>
            Back to all programs
          </Link>
        </nav>

        {!entry ? (
          <section className={styles.runner} role="alert">
            <div className={styles.notice}>
              <div className={styles.noticeInner}>
                <h1 className={styles.noticeTitle}>The Labs catalog is temporarily unavailable.</h1>
                <p className={styles.noticeText}>
                  This experiment cannot be verified on a cold catalog start. Try this page again
                  shortly or return to the Playground.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            {catalog.status === "stale" && (
              <p className={styles.catalogStatus} role="status">
                {catalog.note}
              </p>
            )}
            <header className={styles.detailHeader}>
              <div>
                <h1 className={styles.detailTitle}>{entry.title}</h1>
                <p className={styles.detailDescription}>{entry.description}</p>
              </div>
              <div className={styles.recordCard}>
                <dl>
                  <dt>Run mode</dt>
                  <dd>{playgroundPresentation[entry.presentation].label}</dd>
                  <dt>Location</dt>
                  <dd>{entry.host}</dd>
                  <dt>Topics</dt>
                  <dd>{entry.tags.length > 0 ? entry.tags.join(" / ") : "Uncategorized"}</dd>
                </dl>
              </div>
            </header>

            <PlaygroundRunner entry={entry} />
          </>
        )}
      </Container>
    </Section>
  );
}
