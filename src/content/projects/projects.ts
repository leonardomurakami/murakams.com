import { projectSchema, type Project } from "./schema";

const projectsRaw: Project[] = [
  {
    slug: "homelab-gitops-platform",
    title: "Homelab GitOps Platform",
    shortDescription:
      "A self-hosted Kubernetes + ArgoCD platform running my personal services declaratively, with progressive delivery and sanitized public status.",
    status: "active",
    technologies: [
      "Kubernetes",
      "ArgoCD",
      "SOPS",
      "Cilium",
      "Traefik",
      "GitHub Actions",
      "Renovate",
    ],
    featured: true,
    order: 1,
    visualMaterial: [
      {
        type: "screenshot",
        src: "/projects/homelab-gitops/overview.svg",
        alt: "Diagram of the homelab GitOps platform: repo, ArgoCD, cluster, and public status boundary.",
        caption:
          "Platform overview: source of truth lives in Git; ArgoCD reconciles the cluster; a sanitizer exports a public status view.",
      },
    ],
    problem:
      "Running personal services across a VPS with ad-hoc scripts made deployments unreliable, drift common, and rollback painful. I wanted the same declarative, auditable, rollback-friendly workflow I use at work — without exposing internal cluster details to the public site that would eventually show its status.",
    architecture:
      "A single-node Kubernetes cluster on the VPS is reconciled by ArgoCD from a private Git repository. All configuration is declarative: manifests, sealed secrets (SOPS), and application definitions. Renovate opens PRs for dependency bumps; GitHub Actions runs policy checks before merge. A private collector reads cluster and ArgoCD state and emits a raw snapshot into a sanitizer, which projects only an allowlisted public schema toward the portfolio. The portfolio never talks to ArgoCD directly.",
    implementation:
      "ArgoCD applications are grouped by namespace; each app maps to a path in the repo. Secrets are encrypted at rest with SOPS and decrypted in-cluster by a controller. Cilium provides networking and network policy; Traefik terminates public ingress. The collector is a small service with read-only RBAC scoped to the fields it needs. The sanitizer is a default-deny allowlist: every public field is explicitly enumerated, and anything not listed is dropped before data reaches the public API.",
    challenges:
      "The hardest part was the sanitization boundary. It would have been easy to forward a useful-looking ArgoCD response and accidentally leak a repo URL with embedded credentials, an internal IP, or an annotation that revealed private topology. I made the sanitizer default-deny by construction and wrote tests that feed representative sensitive inputs through it and assert none appear in the public output.",
    tradeoffs:
      "I chose a separate collector + sanitizer over embedding ArgoCD's own API behind a proxy. This is more code to maintain, but it keeps ArgoCD off the public Internet entirely and makes 'what is public' a single, reviewable allowlist. I also chose SOPS over a managed secret store so the source of truth stays in Git — accepting the operational responsibility of key management in exchange for auditability.",
    links: [
      {
        label: "Repository",
        href: "https://github.com/leonardomurakami/homelab-gitops",
        kind: "repository",
      },
      { label: "Live status", href: "/infra", kind: "live" },
    ],
  },
  {
    slug: "discord-bot-framework",
    title: "Discord Bot Framework",
    shortDescription:
      "A plugin-driven Discord bot on Hikari, Lightbulb, and Lavalink where any feature can be enabled or disabled per guild without touching core.",
    status: "active",
    technologies: [
      "Python",
      "Hikari",
      "Lightbulb",
      "Lavalink",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
    ],
    featured: false,
    order: 2,
    visualMaterial: [
      {
        type: "screenshot",
        src: "/projects/discord-bot-framework/overview.svg",
        alt: "Architecture diagram: Discord gateway connects to a plugin-driven bot core with first-party plugins (music, moderation, utilities), backed by async SQLAlchemy persistence, Lavalink audio, and an optional FastAPI control panel.",
        caption:
          "Plugin-driven core: features are self-contained plugins that can be enabled or disabled per guild without touching core.",
      },
    ],
    problem:
      "I wanted a personal Discord bot with music, moderation, and utilities, but I also wanted it to stay maintainable. If a feature stops being interesting or starts causing trouble, I should be able to disable it without surgery on the rest of the bot. A monolithic bot where everything is tangled into the core makes that impossible.",
    architecture:
      "The bot is built on Hikari (Discord gateway), Lightbulb (command framework), and Lavalink (audio). Core services — command routing, event system, permissions, persistence, and analytics — live in a central bot package, while all first-party functionality ships as self-contained plugins under a plugins directory. An async SQLAlchemy layer provides persistence with SQLite for development and PostgreSQL for production. An optional FastAPI control panel runs in-process for managing plugins, permissions, and music queues from a web UI. RBAC permissions support wildcard patterns and are managed per guild.",
    implementation:
      "Each plugin registers its commands, event handlers, and permission nodes with the core at load time. The plugin manager tracks enabled/disabled state per guild, so a plugin can be turned off for one server without affecting others. The Lavalink music stack includes queue persistence, auto-disconnect, and a search selection UI. A Typer-based CLI handles running the bot and managing the database. The test suite uses pytest with async fixtures organised by domain.",
    challenges:
      "The hardest part was the plugin system design. Enabling and disabling plugins per guild without touching core required a clean registration and lifecycle contract: plugins had to declare their commands, handlers, and permission nodes in a way the core could activate or deactivate independently for each guild. Getting that boundary right — so the core never assumes a plugin is present and plugins never reach into each other — was the central engineering problem.",
    tradeoffs:
      "Plugin isolation adds indirection and complexity compared to a monolithic bot where everything is in one codebase. There is a cost in boilerplate and in the abstraction layer between core and plugins. But the ability to disable any feature without touching core — the original motivation — was worth that cost. The framework overhead pays for itself every time a plugin misbehaves or I lose interest in a feature.",
    links: [
      {
        label: "Repository",
        href: "https://github.com/leonardomurakami/discord-bot-framework",
        kind: "repository",
      },
      { label: "Live", href: "https://bot.murakams.com", kind: "live" },
    ],
  },
  {
    slug: "gamdle",
    title: "Gamdle",
    shortDescription:
      "A daily deterministic probability casino with fictional points and passwordless accounts, where each user gets their own luck-based draw every day.",
    status: "maintenance",
    technologies: ["Node.js", "PostgreSQL", "esbuild", "Docker"],
    featured: false,
    order: 3,
    visualMaterial: [
      {
        type: "screenshot",
        src: "/projects/gamdle/overview.svg",
        alt: "Architecture diagram: browser with esbuild-bundled app.js connects to a Node.js backend with per-user daily seeding, PostgreSQL persistence, magic-link auth via email webhook, deployed via Docker Compose to Kubernetes.",
        caption:
          "Daily deterministic casino: per-user-per-day seeding means each player gets their own luck-based draw rather than a shared correct answer.",
      },
    ],
    problem:
      "I wanted a Wordle-style daily game, but built around probability and casino mechanics rather than word guessing. The game needed deterministic daily outcomes so players could come back each day for a fresh draw, and I wanted passwordless accounts so there was no friction to sign in. The fictional-points constraint kept it a no-risk environment — the stakes are just for fun.",
    architecture:
      "A Node.js backend serves the game logic and session management. The browser frontend is bundled with esbuild into a single app.js, keeping the client lean without a framework. PostgreSQL persists users, scores, and daily results. Authentication is passwordless via magic links: the backend generates a link, sends it through an email webhook, and the user clicks to sign in. Docker Compose bundles the app and Postgres for deployment to the Kubernetes cluster via the GitOps platform.",
    implementation:
      "The daily seed is derived per user per day from a secret combined with the user ID and the date. This means each player gets a deterministic draw for that day — replaying the same day always produces the same result — but different players get different draws. The esbuild pipeline bundles the browser source from a frontend directory into public/app.js before the server starts, so the frontend and backend share a single Node process. In development, the magic link is displayed in the console instead of being emailed.",
    challenges:
      "The central design decision was choosing between one deterministic seed shared across all users versus one seed per user per day. A shared seed would make it a 'there is a correct path' game — everyone gets the same hand and you can compare results, like Wordle. I chose the second: one seed per user per day. That makes the game luck-based rather than skill-based, but in a no-risk environment with fictional points, having to be a little lucky is the fun part. It also means no two players can directly compare their draws, which changes the social dynamic.",
    tradeoffs:
      "The per-user seed trades the social 'everyone got the same hand' angle for fairness and replayability. There is no shared correct answer to compare, so the daily discussion that drives games like Wordle does not happen the same way. But the trade is intentional: in a no-risk environment, luck-based play is more fun than a single deterministic path, and per-user seeding means no player is penalized by a bad shared draw.",
    links: [
      {
        label: "Repository",
        href: "https://github.com/leonardomurakami/gamdle",
        kind: "repository",
      },
      { label: "Live", href: "https://gamdle.murakams.com", kind: "live" },
    ],
  },
  {
    slug: "graduation-ime-usp",
    title: "Graduation IME-USP",
    shortDescription:
      "A Docusaurus static site archiving my IME-USP computer science coursework as a browsable, living record of my education.",
    status: "active",
    technologies: ["Docusaurus", "React", "Node.js", "Docker", "Nginx"],
    featured: true,
    order: 4,
    visualMaterial: [
      {
        type: "screenshot",
        src: "/projects/graduation-ime-usp/overview.svg",
        alt: "Architecture diagram: coursework organized by year and discipline feeds into a Docusaurus static site build, packaged as a Docker + Nginx container, deployed via the GitOps platform to graduacao.murakams.com.",
        caption:
          "Coursework archive: a Docusaurus static site renders years of IME-USP coursework into a browsable, zero-maintenance record.",
      },
    ],
    problem:
      "My IME-USP graduation produced code across many courses and disciplines — algorithms, operating systems, data science, simulation, graph algorithms, and more. A GitHub directory tree is technically public but not browsable or discoverable. I wanted a centralized, searchable portfolio of academic coursework that showed the breadth of the degree in a way that was easy to navigate and point people to.",
    architecture:
      "The site is built with Docusaurus, a React-based static site generator. Coursework is organized by year and discipline, with each course getting its own section. The static build is packaged into a Docker image with Nginx for serving, and deployed to the Kubernetes cluster via the GitOps platform with a Traefik ingress route at graduacao.murakams.com. Because it is a static site, there is no backend, no database, and no runtime dependencies beyond the container.",
    implementation:
      "The Docusaurus configuration defines the site structure, sidebar navigation, and content organization. Course code lives in the repository organized by discipline; Docusaurus renders it into browsable pages with syntax highlighting and navigation. A GitHub Actions workflow builds and publishes the Docker image to the OCI registry, and the GitOps platform picks up the new image version automatically. The nginx configuration handles static file serving and routing.",
    challenges:
      "The hard challenge is the university degree itself. The site is a living record of ongoing work — every semester adds new courses, new projects, and new code. The engineering challenge of building the site was straightforward; the real challenge is completing the CS degree at IME-USP that the site documents.",
    tradeoffs:
      "I chose a static site over a dynamic one. The trade is zero maintenance — no database to back up, no server to keep running, no security patches beyond the container — at the cost of no search or interactive features. For a coursework archive, that is the right trade: the content is the value, and a static site keeps it online with minimal operational burden.",
    links: [
      {
        label: "Repository",
        href: "https://github.com/leonardomurakami/graduation-ime-usp",
        kind: "repository",
      },
      { label: "Live", href: "https://graduacao.murakams.com", kind: "live" },
    ],
  },
  {
    slug: "message-board",
    title: "Message Board",
    shortDescription:
      "A multi-user forum built with FastAPI, HTMX, and SQLAlchemy for MAC0350 at IME-USP — server-rendered, no JS framework.",
    status: "completed",
    technologies: ["Python", "FastAPI", "HTMX", "SQLAlchemy", "PostgreSQL", "SQLite", "Docker"],
    featured: false,
    order: 5,
    visualMaterial: [
      {
        type: "screenshot",
        src: "/projects/message-board/overview.svg",
        alt: "Architecture diagram: browser with HTMX connects to a FastAPI backend with Jinja2 templates, SQLAlchemy ORM with SQLite for dev and PostgreSQL for prod, deployed via Docker to the GitOps platform at msgbrd.murakams.com.",
        caption:
          "Server-rendered forum: FastAPI + HTMX keeps the client lean while SQLAlchemy abstracts the dev/prod database split.",
      },
    ],
    problem:
      "This was an individual assignment for MAC0350 (Data Structures II) at IME-USP: build a multi-user forum where users can create posts and messages, with a real backend and database. The assignment required a working application, not just a prototype, and the stack and architecture were my choice within the course's constraints.",
    architecture:
      "The backend is FastAPI with Jinja2 templates for server-side rendering. HTMX handles dynamic UI updates without a JavaScript framework — interactions like creating posts and loading new content happen through HTML fragments returned from the server. SQLAlchemy provides the ORM layer with SQLite for local development and PostgreSQL for production. Docker Compose bundles the app and Postgres for deployment, and the GitOps platform deploys the container to the cluster with a Traefik ingress at msgbrd.murakams.com.",
    implementation:
      "The data model covers users, posts, and the relationships between them. SQLAlchemy models define the schema, and the ORM layer handles queries in a dialect-agnostic way so the same code works against SQLite and PostgreSQL. FastAPI routes serve both full pages and HTMX partials depending on the request. The Jinja2 templates render HTML that HTMX swaps into the DOM, keeping the client side to a few attributes on elements rather than a separate application.",
    challenges:
      "The hardest engineering challenge was designing the data model and SQLAlchemy ORM layer for a multi-user forum. The relationships between users, posts, threads, and replies needed to be modeled cleanly, and the ORM layer had to work against both SQLite and PostgreSQL without dialect-specific code leaking into the business logic. Getting the model right — so queries were straightforward and the schema was normalized — was the core problem.",
    tradeoffs:
      "Most design decisions were driven by class requirements. The course defined the scope and constraints, and the stack was chosen to fit those constraints: FastAPI for a Python backend, HTMX for interactivity without a JS framework, and the dual SQLite/PostgreSQL setup for dev/prod parity. The trade-offs were largely about working within the assignment's boundaries rather than open-ended architectural choices.",
    links: [
      {
        label: "Repository",
        href: "https://github.com/leonardomurakami/message-board",
        kind: "repository",
      },
      { label: "Live", href: "https://msgbrd.murakams.com", kind: "live" },
    ],
  },
];

const parsed = projectsRaw.map((p) => projectSchema.parse(p));

export const projects: readonly Project[] = parsed.sort(
  (a, b) => (a.order ?? 99) - (b.order ?? 99),
);

export const featuredProjects: readonly Project[] = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
