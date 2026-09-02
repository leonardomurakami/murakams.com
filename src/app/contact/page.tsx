import type { Metadata } from "next";
import { Container, Section } from "@/components/primitives";
import { siteConfig } from "@/design/site-config";
import { ContactComposer } from "@/features/contact/contact-composer";
import styles from "@/features/contact/contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Open an email to ${siteConfig.author.name} or find his GitHub and LinkedIn profiles.`,
};

export default function ContactPage() {
  const { email } = siteConfig.author;

  return (
    <Section className={styles.page}>
      <Container width="wide">
        <header className={styles.intro}>
          <div>
            <h1 className={styles.title}>Open a direct channel.</h1>
            <p className={styles.lede}>
              Email is the simplest way to reach Leonardo. Prepare a local draft here, then choose
              when to continue in your own email application.
            </p>
          </div>
          <dl className={styles.addressPlate}>
            <dt>Recipient address</dt>
            <dd>{email}</dd>
          </dl>
        </header>

        <div className={styles.station}>
          <ContactComposer recipient={email} />

          <aside className={styles.externalPanel} aria-labelledby="external-channels-title">
            <header className={styles.externalPanelHeader}>
              <h2 className={styles.externalPanelTitle} id="external-channels-title">
                GitHub and LinkedIn
              </h2>
              <p className={styles.externalPanelText}>
                These profiles are separate sites. Each link opens in a new tab.
              </p>
            </header>
            <ul className={styles.socialList}>
              {siteConfig.social.map((social) => (
                <li className={styles.socialItem} key={social.href}>
                  <a
                    className={styles.socialLink}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className={styles.socialLabel}>{social.label}</span>
                    <span className={styles.socialDestination}>{social.href}</span>
                    <span className={styles.socialHandoff}>Open external profile in a new tab</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
