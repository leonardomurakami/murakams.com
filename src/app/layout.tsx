import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/design/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/design/site-config";
import {
  AccessibleExperience,
  ExperienceProvider,
} from "@/features/experience/experience-provider";
import { ExperienceGate } from "@/features/experience/experience-gate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.author.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8deca" },
    { media: "(prefers-color-scheme: dark)", color: "#10182c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="experience-init" strategy="beforeInteractive" src="/experience-init.js" />
        {/* Pre-paint theme init to avoid a flash of the wrong theme.
            beforeInteractive guarantees this runs before hydration. */}
        <Script id="theme-init" strategy="beforeInteractive" src="/theme-init.js" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <template
          data-design-contract="mks98-3779d000"
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: MKS/98 is a portfolio as a working hobbyist workstation; it refuses conventional hero-card landing pages and Windows cosplay.
OWN-WORLD: Warm beige ABS, deep cobalt desktop, voltage-yellow focus, red errors, original pixel-like chrome, diagnostic boot text, and modern readable application content.
STORY: Boot MKS/98, meet Leonardo, inspect project files and systems, run experiments from the Programs folder, explore the career record, and open a direct channel.
FIRST VIEWPORT: A full-screen diagnostic boot sequence hands off directly to the MKS/98 desktop.
FORM: Full-screen hobbyist operating system, selected from direction seed 3779d000.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`,
          }}
        />
        <ExperienceProvider>
          <AccessibleExperience>
            <ThemeProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </ThemeProvider>
          </AccessibleExperience>
          <ExperienceGate />
        </ExperienceProvider>
      </body>
    </html>
  );
}
