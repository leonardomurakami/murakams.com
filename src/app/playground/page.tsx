import type { Metadata } from "next";
import { Container, Section } from "@/components/primitives";
import { getPlaygroundCatalog } from "@/content/playground/catalog-server";
import { PlaygroundBrowser } from "@/features/playground/playground-browser";
import styles from "@/features/playground/playground.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Playground",
  description: "Discover experiments published by MKS Labs and run them in isolated frames.",
};

export default async function PlaygroundPage() {
  const catalog = await getPlaygroundCatalog();

  return (
    <Section className={styles.page}>
      <Container width="wide">
        <header className={styles.intro}>
          <div>
            <h1 className={styles.title}>Programs worth taking apart.</h1>
            <p className={styles.lede}>
              A workbench catalog of experiments published by MKS Labs. Programs run in isolated
              frames here and can also be opened at their trusted Labs location.
            </p>
          </div>
          <p className={styles.inventoryNote}>
            <strong>Labs connection</strong>
            <span>
              Catalog records are verified on this server. Program permissions are granted only from
              locally recognized capabilities.
            </span>
          </p>
        </header>

        <PlaygroundBrowser entries={catalog.entries} status={catalog.status} note={catalog.note} />
      </Container>
    </Section>
  );
}
