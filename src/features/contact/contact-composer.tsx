"use client";

import { useState, type FormEvent } from "react";
import { buildMailtoHref } from "./mailto";
import styles from "./contact.module.css";

export function ContactComposer({ recipient }: { recipient: string }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const mailtoHref = buildMailtoHref({ recipient, subject, body });

  function openEmailClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = mailtoHref;
  }

  return (
    <form
      className={styles.composer}
      action={mailtoHref}
      onSubmit={openEmailClient}
      aria-describedby="contact-handoff-note"
    >
      <header className={styles.composerHeader}>
        <h2 className={styles.composerTitle}>Draft an email</h2>
        <p className={styles.localState}>Local draft · Mail client handoff</p>
      </header>

      <p className={styles.handoffNotice} id="contact-handoff-note">
        This page does not send or store messages. Continue when you are ready to open this draft in
        your email application.
      </p>

      <div className={styles.fieldGrid}>
        <label className={styles.fieldLabel} htmlFor="contact-recipient">
          To
        </label>
        <input
          className={styles.fieldControl}
          id="contact-recipient"
          type="email"
          value={recipient}
          readOnly
        />
        <label className={styles.fieldLabel} htmlFor="contact-subject">
          Subject
        </label>
        <input
          className={styles.fieldControl}
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          autoComplete="off"
        />
      </div>

      <div className={styles.messageField}>
        <label className={styles.messageLabel} htmlFor="contact-message">
          Message
        </label>
        <textarea
          className={styles.messageControl}
          id="contact-message"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write a note to include in your email draft."
        />
      </div>

      <footer className={styles.composerFooter}>
        <button className={styles.primaryButton} type="submit">
          Continue in email app
        </button>
        <p className={styles.handoffText}>
          Your browser will hand the recipient, subject, and message to an external email
          application. Nothing is submitted to this website.
        </p>
        <noscript>
          <a href={`mailto:${recipient}`}>Open your email application</a>
        </noscript>
      </footer>
    </form>
  );
}
