# SFLuv

The SFLuv marketing site, built with Next.js (App Router), React 19, TypeScript, and Tailwind v4.

```bash
pnpm install
cp .env.example .env.local   # optional: see Environment below
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
```

## Environment

Two server-only variables, both documented in [.env.example](.env.example).

| Variable | Purpose | If unset |
|---|---|---|
| `SFLUV_API_BASE_URL` | Backend base URL (`https://api.sfluv.org`) | **Dev:** volunteer pages serve local sample events and stub signups. **Production:** sample data is *not* served — pages degrade to "temporarily unavailable" and signups error, rather than advertising events that do not exist. |
| `SFLUV_VOLUNTEER_PROXY_KEY` | Shared secret letting the API trust the visitor IP we forward on anonymous signups. Must match `VOLUNTEER_PROXY_KEY` on the backend. | Signups still work; the API rate-limits on our egress IP instead, so web signups share one bucket. |
| `SFLUV_USE_FIXTURES` | Set to `1` to force sample data on, so a production build can be exercised locally. Never set it in a deployed environment. | Fixtures are used in dev only. |

Neither is `NEXT_PUBLIC_`, and neither should become so — both are read only in
server components and route handlers, and prefixing them would inline them into
the browser bundle.

## Content edited from the admin panel

Some content is not in this repo. Staff change it at **app.sfluv.org → Admin → Website**
and it appears on the site within about 30 seconds, with no deploy:

| What | Where it shows | Edited by |
|---|---|---|
| Homepage highlights (the rotating carousel) | beside the homepage title | `website_banner` credential, or an admin |
| Financial statements and impact reports | `/financials-and-reports` | `website_financials`, or an admin |
| Forms and waivers, and their signatures | `/forms` (nav: About → Forms and Waivers) | `website_forms`, or an admin |

All of it is fetched from the backend's public `/site/*` routes by
`src/lib/site-content/client.ts`, which is also where the failure behaviour lives:
financials fall back to `src/content/financials.ts`, the carousel falls back to
`src/content/spotlight.ts` only if the backend predates the feature (and
shows nothing on any other failure), and forms show a "temporarily unavailable"
notice. Signing goes through `src/app/api/forms/[slug]/sign`, a proxy that
forwards the visitor's IP using `SFLUV_VOLUNTEER_PROXY_KEY` — the same setup as
volunteer signups. Design and data model: `docs/features/website-editing-and-forms.md`
in the app repo.

**Deploy order matters.** The backend (api.sfluv.org, deployed by hand) must have
the `/site/*` routes before this site goes live, or the forms pages will report
"unavailable". The carousel and financials degrade gracefully either way.

## Project structure

```
src/
  app/                  Routes only — each page composes content + components
    (about)/            mission-and-vision, how-it-works, our-team, financials-and-reports
    (get-involved)/     donors, community, merchants, improvers, volunteers, tree-steward-program
    (resources)/        resources, roadmap, sfluv-quiz
    (support)/          contact, support, submit-w9, delete-account
    (legal)/            privacy-policy, terms-and-conditions
    layout.tsx          Root shell: fonts, metadata, header, footer
    sitemap.ts          Generated from src/lib/routes.ts
    robots.ts

  components/
    ui/                 Design-system primitives (Button, Panel, Section, Field, …)
    layout/             SiteHeader, SiteFooter
    content/            Typed document tree + its renderer, for long-form copy
    icons/              SVG icon set

  features/             Page-specific composites, one folder per feature
    quiz/ contact/ w9/ account-deletion/ team/ merchants/
    volunteers/ financials/ home/ get-involved/ legal/

  content/              All page copy, typed and separate from presentation
    legal/              Generated from the archived export (see below)

  lib/
    routes.ts           Every internal URL; nav and sitemap derive from it
    site.ts             Navigation, external links, contact emails, site metadata
    metadata.ts         Per-page Metadata builder
    cn.ts               Class-name joiner

  styles/globals.css    Tailwind entry + design tokens (@theme)
  assets/fonts/         Sora, self-hosted via next/font/local
```

Route groups (`(about)`, `(legal)`, …) organise the source tree without appearing
in URLs: `src/app/(about)/our-team/page.tsx` serves `/our-team`.

## Conventions

- **Copy lives in `src/content/`, not in components.** Pages import a typed content
  module and hand it to components. Changing wording never means touching JSX.
- **Add a route** by creating the segment under the right group *and* adding its
  path to `src/lib/routes.ts`. The sitemap and navigation follow from there.
- **Design tokens** are declared in `src/styles/globals.css` under `@theme`, which
  is what makes `bg-brand`, `text-ink-muted`, `rounded-panel`, etc. resolve.
- **Client components** are limited to the pieces that need interactivity: the
  header menus, the quiz, and the five forms. Everything else renders on the server.

## Long-form legal copy

`src/content/legal/*.ts` holds the privacy policy and terms as a typed document
tree (`BlockNode[]`), rendered by `components/content/RichDocument`. They were
generated once from the archived WordPress export:

```bash
pnpm content:legal      # regenerates from scripts/legacy/wordpress-export.json
```

The generated files are the source of truth now — edit the copy there directly.
`scripts/legacy/` keeps the original export and its fetch scripts for reference.
