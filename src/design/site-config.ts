export const siteConfig = {
  name: "murakams.com",
  title: "Leonardo Murakami — SRE & Software Engineer",
  description:
    "Leonardo Murakami is an SRE and software engineer. Personal engineering site: projects, infrastructure status, experiments, and resume.",
  url: "https://murakams.com",
  author: {
    name: "Leonardo Murakami",
    role: "SRE & Software Engineer",
    email: "muraleob@gmail.com",
  },
  social: [
    { label: "GitHub", href: "https://github.com/leonardomurakami" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/leonardo-murakami" },
  ],
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** Prefix used to match the current section (e.g. "/projects" matches "/projects/x"). */
  matchPrefix: string;
};

export const navItems: readonly NavItem[] = [
  { href: "/", label: "Home", matchPrefix: "/" },
  { href: "/projects", label: "Projects", matchPrefix: "/projects" },
  { href: "/infra", label: "Infra", matchPrefix: "/infra" },
  { href: "/playground", label: "Playground", matchPrefix: "/playground" },
  { href: "/resume", label: "Resume", matchPrefix: "/resume" },
  { href: "/contact", label: "Contact", matchPrefix: "/contact" },
] as const;
