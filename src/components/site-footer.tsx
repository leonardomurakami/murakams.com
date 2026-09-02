import Link from "next/link";
import { Container } from "@/components/primitives";
import { navItems, siteConfig } from "@/design/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t-4 border-action bg-structural-deep text-structural-foreground">
      <Container className="grid gap-8 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <div className="mb-4 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-10 bg-action" />
            <span className="h-1 w-1 bg-action" />
            <span className="h-px w-20 bg-structural-foreground/40" />
          </div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.1em]">
            {siteConfig.author.name}
          </p>
          <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-structural-foreground/75">
            {siteConfig.author.role} / MKS/98 accessible interface
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex max-w-xl flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-structural-foreground underline decoration-structural-foreground/40 underline-offset-4 transition-colors hover:text-action"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
