import styles from "../mock-os.module.css";

function AppState({
  label,
  title,
  detail,
  action,
}: {
  label: string;
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={`${styles.appSurface} grid h-full min-h-64 place-items-center p-8 text-center`}
    >
      <div className="max-w-md">
        <p className={styles.appLabel}>{label}</p>
        <h2 className="mt-3 text-2xl font-bold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#514b40]">{detail}</p>
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </section>
  );
}

export function AppLoading({ title = "Opening application" }: { title?: string }) {
  return (
    <AppState label="Please wait" title={title} detail="MKS/98 is preparing this application." />
  );
}

export function AppEmpty({ title, detail }: { title: string; detail: string }) {
  return <AppState label="No records" title={title} detail={detail} />;
}

export function AppError({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return <AppState label="Application error" title={title} detail={detail} action={action} />;
}

export function ExternalDestination({
  title,
  href,
  host,
}: {
  title: string;
  href: string;
  host: string;
}) {
  return (
    <AppState
      label="External program"
      title={title}
      detail={`This program runs independently at ${host}.`}
      action={
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={`${styles.appButton} ${styles.appButtonPrimary}`}
        >
          Open external program
        </a>
      }
    />
  );
}
