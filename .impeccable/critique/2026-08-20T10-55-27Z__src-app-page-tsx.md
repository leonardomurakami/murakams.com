---
target: home
total_score: 20
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-20T10-55-27Z
slug: src-app-page-tsx
---

# Critique: Homepage (`src/app/page.tsx`)

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                                  |
| --------- | ------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3         | Infra preview shows live data; sync state not surfaced on homepage                                         |
| 2         | Match System / Real World       | 4         | Plain-language health explanations, no unexplained jargon for the peer audience                            |
| 3         | User Control and Freedom        | 4         | Clear header/footer nav, no traps, easy exits                                                              |
| 4         | Consistency and Standards       | 3         | Section rhythm deviates from DESIGN.md's own `py-16 sm:py-24` default (three sections at `py-12`)          |
| 5         | Error Prevention                | n/a       | No forms or error states on a portfolio homepage                                                           |
| 6         | Recognition Rather Than Recall  | 3         | Hover-only "Read case study" link is invisible on touch; 5 identical explore cards require reading         |
| 7         | Flexibility and Efficiency      | n/a       | Portfolio homepage, not a power-user tool                                                                  |
| 8         | Aesthetic and Minimalist Design | 3         | Clean restraint in the upper page, but the explore grid is redundant clutter and 5 eyebrows is scaffolding |
| 9         | Error Recovery                  | n/a       | No error states on homepage                                                                                |
| 10        | Help and Documentation          | n/a       | Portfolio homepage is self-explanatory                                                                     |
| **Total** |                                 | **20/24** | **Good** (83%)                                                                                             |

## Design Specificity Verdict

**LLM assessment:** The homepage is authored for this product but only moderately specific in its visual language. The content is unmistakably SRE (GitOps, Kubernetes, infra status, homelab), so a first-order category-reflex would correctly guess "SRE portfolio" from the content alone. The visual execution avoids the stereotypical dark-terminal/neon-dashboard SRE look, which is the binding anti-reference from PRODUCT.md. That avoidance is working.

The second-order trap is the real issue. "SRE portfolio that's not the stereotypical look" currently resolves to "generic clean technical site." The restraint is so uniform that the visual voice isn't distinctly Leonardo's yet. A developer portfolio, a documentation site, or a technical blog could swap content in unchanged. The specificity comes from the infra status preview (the unique mechanism) and the case-study card structure, not from the visual system itself. The page reads as competent and restrained, not as authored.

**Deterministic scan:** The detector returned `[]` (clean, exit 0) across the homepage and all five supporting component files. No side-stripe borders, gradient text, glassmorphism, hero-metric template, ghost cards, over-rounded corners, hand-drawn SVG, stripe backgrounds, or "X theater" copy. No absolute bans triggered. No codex-specific defects.

**Visual overlays:** No dev server was running, so no browser overlay was injected. No user-visible overlay is available for this run.

## Overall Impression

A calm, honest, well-built page that earns credibility through the infra preview and case-study structure. The biggest opportunity is the bottom half: the page ends with a 5-card explore grid that duplicates the header navigation, capped by an eyebrow-on-every-section pattern that reads as AI scaffolding despite the DESIGN.md explicitly warning against it. The upper page (hero, current focus, projects, infra) is solid; the lower page undermines it.

## What's Working

1. **The infra status preview is the credibility engine.** The `InfraSummary` with live counts and the plain-language caption ("Only allowlisted fields are shown; ArgoCD and the cluster are never exposed to the Internet") is the one thing a peer SRE can't dismiss. It's the positioning mechanism from PRODUCT.md made visible, and it works.

2. **Accent restraint is disciplined.** The burnt-ochre mark appears only on links, the two section CTAs, and focus rings. It's not used as a button fill, heading color, or surface. The One Mark Rule from DESIGN.md is actually enforced in the code, which is rare.

3. **Project cards cap technologies at 4** (`p.technologies.slice(0, 4)`, line 89). This avoids tag soup and keeps the preview scannable. A small but deliberate restraint.

## Priority Issues

**[P1] Eyebrow on every section — the absolute-ban pattern**

- **What:** There are 5 `<Eyebrow>` elements on the page (lines 26, 48, 63, 108, 130), one per section: "SRE & Software Engineer", "Current focus", "Selected projects", "Infrastructure status", "Explore". This is the literal pattern the DESIGN.md and the skill's absolute bans warn against: "an eyebrow on every section is AI grammar."
- **Why it matters:** This is the single most reliable "AI made that" tell on the page. The DESIGN.md's own Mono-Is-Metadata Rule says eyebrows are a deliberate system used sparingly; 5-in-a-row is scaffolding by reflex. A peer SRE who has seen 50 AI-generated portfolios will spot this instantly.
- **Fix:** Drop the eyebrow from "Current focus" (it's a continuation of the hero, not a new section). Drop the eyebrow from "Explore" (the section is a nav grid, not a content section). Keep eyebrows only on the two content sections that need a kicker: "Selected projects" and "Infrastructure status". That gives the page a 2-eyebrow cadence instead of 5.
- **Suggested command:** `$impeccable quieter home`

**[P1] Hover-only "Read case study" link is invisible on touch**

- **What:** The "Read case study →" link on project cards is `opacity-0` at rest, `opacity-100` on `group-hover` (line 93). On touch devices there is no hover state, so the link never appears.
- **Why it matters:** The entire card is a link, so the destination is reachable, but the affordance signal is hidden on every mobile and tablet visitor. This is a recognition-over-recall violation and a touch-device failure. PRODUCT.md's primary audience includes peers who may arrive on mobile.
- **Fix:** Show the link at rest. Either remove the opacity transition entirely (`opacity-100` always, let the underline be the hover signal), or use `opacity-70` at rest with `opacity-100` on hover. The decorative fade is not worth hiding the affordance.
- **Suggested command:** `$impeccable harden home`

**[P1] Hero CTA hierarchy is flat**

- **What:** Three equal-weight `ButtonLink` components in the hero (lines 37-39): "View projects", "Infrastructure status", "Resume". All use the same bordered-surface style. No primary action.
- **Why it matters:** PRODUCT.md says the primary audience is peers who arrive via projects or the live infra view. The hero gives those two paths the same visual weight as "Resume", which is a secondary path. There's no signal for "start here."
- **Fix:** Make "View projects" the primary CTA with a slight visual lift (accent-tinted border, or `bg-surface-raised` to differentiate from the other two surface-filled buttons). Keep "Infrastructure status" and "Resume" as the current bordered-surface secondary style. Do not fill the primary button with accent — that would break The One Mark Rule; differentiate via border weight or surface step instead.
- **Suggested command:** `$impeccable clarify home`

**[P2] Explore grid duplicates the header navigation**

- **What:** The final section (lines 128-164) is a 5-card grid linking to Projects, Infrastructure, Playground, Resume, Contact. The sticky header already provides these exact links, with active-state tracking.
- **Why it matters:** The grid is redundant IA. It adds a fifth section to the page that exists only to repeat the navigation, and it pushes the page's ending to a flat utility menu instead of landing on the infra preview (the credibility peak). The 5 identical cards also edge into the identical-card-grid ban.
- **Fix:** Cut the explore grid entirely. Let the page end after the infra preview, which is the emotional and credibility peak. The header and footer already cover navigation. If you want a closing element, a single quiet line ("More: playground, resume, contact" as inline text links) is enough.
- **Suggested command:** `$impeccable distill home`

**[P2] Section rhythm deviates from the design system**

- **What:** The hero uses `pb-12 pt-20 sm:pt-28` (line 23, intentional tightening). Three sections use `py-12` (lines 46, 59, 104). The final section uses `py-16` (line 128). The DESIGN.md specifies `py-16 sm:py-24` as the default section rhythm.
- **Why it matters:** The page is consistently tighter than its own design system. The `py-12` sections feel cramped relative to the DESIGN.md's stated rhythm, and the inconsistency between `py-12` and `py-16` makes the vertical rhythm uneven.
- **Fix:** Bring the three `py-12` sections up to `py-16 sm:py-24` to match the DESIGN.md default. Keep the hero's intentional tightening.
- **Suggested command:** `$impeccable layout home`

## Persona Red Flags

**Peer SRE (primary audience, from PRODUCT.md):**
Arrives via a project link or the infra view, assessing credibility. The infra preview delivers. But the hero gives "View projects" and "Infrastructure status" the same weight as "Resume" — if they arrived via infra, there's no signal that the infra path is the primary one. The "Current focus" section is buried as a second paragraph after the hero rather than leading or folding into the hero, so a peer scanning for "what is this person actually working on" has to scroll past the intro to find it. The page ends on a nav grid instead of the infra peak, so the last impression is utility, not credibility.

**Jordan (first-timer):**
Arrives cold, doesn't know what an SRE is. The hero H1 "I build reliable systems and the tooling that keeps them calm" is abstract — it doesn't signal the role to a non-technical visitor. The "Current focus" paragraph uses "progressive delivery", "observability", "policy-as-code" without context. The 5-card explore grid has no "start here" signal. A first-timer would likely scroll the whole page, not click anything, and leave.

**Casey (mobile):**
Arrives on phone, scanning with thumb. Three hero buttons stack vertically, consuming viewport. The "Read case study →" link on project cards never appears (no hover on touch). Five explore cards stack into a long scroll. The infra summary uses `flex-wrap` which wraps awkwardly on narrow screens. The primary paths (projects, infra) are reachable but not thumb-optimized — everything is top-loaded, nothing in the thumb zone.

## Minor Observations

- The "Selected projects" heading "A few projects, written up in depth." (line 65) is good copy after the clarify pass — honest and specific.
- The infra summary's conditional rendering (degraded/unhealthy/unknown only when count > 0, infra-components.tsx lines 39-41) is smart — it doesn't show a "0 unhealthy" badge that would read as noise.
- The explore grid on `lg:grid-cols-3` with 5 items produces a 3+2 last row, which looks uneven. If the grid stays, it should be 4 or 6 items.
- The hero intro paragraph (lines 30-34) is dense — one sentence covering name, role, focus, and a site map. It could split into two shorter sentences for scannability.
- The `← Projects` back link on the project detail page uses a raw arrow character; the homepage CTAs use `→`. The arrow convention is consistent across the site, which is good.

## Questions to Consider

1. **What if the page ended at the infra preview?** The header and footer already navigate. Cutting the explore grid would land the page on its credibility peak and remove the most redundant section.
2. **What if "Current focus" folded into the hero?** It's currently a one-paragraph section with an eyebrow, but it reads as a continuation of the intro. Folding it would remove an eyebrow and tighten the first viewport.
3. **What if the hero led with the infra status?** PRODUCT.md says the live infra view is the unique mechanism. Leading with it would invert the narrative from "who I am" to "here's the proof", which matches the peers-first audience better than a traditional intro.
