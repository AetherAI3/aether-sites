<p align="center"><a href="https://aethersites.net/"><img src="assets/aether-sites.svg" alt="Aether Sites — Websites with a point of view" width="900"></a></p>

# Aether Sites

**All my website concepts and creations, in one place.** Built by Brandon at [Aether AI](https://aethersystems.net/).

[**Explore the collection ↗**](https://aethersites.net/) · [**Discuss your website / hosting ↗**](https://aethersites.net/#contact)

Browse the concepts, open the full sites, and find a direction you love. Contact me to discuss purchasing an available concept, adapting it to your business, or arranging hosting and ongoing support. Include the concept name or link and what you need; we’ll agree availability, scope, pricing, and handoff before work begins.

Custom website builds are welcome too. Concepts are demonstrations, not claims of commissioned client work. Third-party branding and assets are not automatically included in a purchase.

Each concept has its own top-level folder. This repository holds the source collection.

## The collection

| Folder | Website |
| --- | --- |
| `reworxct/` | Reclaimed furniture and architectural materials; charcoal, ember, and cinematic timber imagery. |
| `ember-and-iron/` | EMBER & IRON Wood-Fired Pizza Co.; hot steel gradients, expanding menu cells, and a sticky Dough / Fire / Char sequence. |
| `harbor-and-hollow/` | A coastal hand wash concept with a scroll-driven film journey, scent story, and product presentation. |
| `garys-hilltop/` | Gary’s Hilltop Auto Repair, Torrington; mint and cyan gradients, glass service cards, restrained scroll effects, verified reviews, real location photography, and an optional service-note planner. |
| `mach-detail/` | Mach Detail, Torrington; bold automotive type, cyan HUD styling, scroll-driven scenes, nine real photos, a cinematic Google review carousel, and an appointment-request planner. |
| `empanadas-togo/` | Empanada's The place TOGO, Meriden; Golden Counter gradients, bold expanding menu frames, and a local pickup-list builder. |
| `waterbury-aquarium/` | Waterbury Aquarium; detailed illustrative aquatic imagery, water gradients, scroll-driven frames, category filters and a local aquascape visit planner. |
| `barbers-ink/` | Barber’s Ink, Torrington; black, chrome and cyan, bold expanding frames, a direct Booksy link and a local appointment-request planner. |

Ember & Iron's complete handoff notes are in [docs/ember-and-iron.md](docs/ember-and-iron.md). The source directive, CSS, and wireframe are retained in `reference/ember-and-iron/`.

Gary’s handoff, verified business sources, photo provenance, and planner behavior are in [docs/garys-hilltop.md](docs/garys-hilltop.md). Its supplied stylesheets and directive are retained in `reference/garys-hilltop/`.

Mach Detail’s source notes, request behavior, and activation checklist are in [docs/mach-detail.md](docs/mach-detail.md). The proposed booking API, calendar ledger, and messaging architecture are in [integrations/mach-detail/README.md](integrations/mach-detail/README.md).

## Reworx: `reworxct`

A fresh industrial presentation for Reworx: charcoal surfaces, ember accents, sharp geometry, large Archivo typography, and the supplied cinematic timber imagery. This is an **unofficial design concept**, not Reworx's official website or an endorsed project.

- `reworxct/index.html` — rewritten content and semantic page structure.
- `reworxct/styles.css` — responsive visual system, based on the supplied guide.
- `reworxct/motion.css` — supplied palette gradients, expanding frames, process reveals, and button interactions.
- `reworxct/script.js` — mobile navigation and progressive scroll choreography.
- `reworxct/assets/` — four supplied images, optimized to WebP.
- `docs/reworxct-sources.md` — sources, factual boundaries, and asset provenance.
- `reference/reworxct/` — supplied brand guide and CSS, with image references localized for this repository.
- `scripts/` — dependency-free build and checks.

## Local use

Requires Node.js 22+ and Python 3 for checks.

```sh
npm ci
npm run check
npm run build
python3 -m http.server 8080 --directory dist
```

Open `/` for the Aether Sites showcase, then `/reworxct/`, `/ember-and-iron/`, `/harbor-and-hollow/`, `/garys-hilltop/`, or `/mach-detail/` for full concepts. New client concepts should get their own folders; update the showcase, `scripts/build.mjs`, `scripts/check.py`, and JavaScript checks when adding one.

## Publishing

The build creates `dist/reworxct/`, `dist/ember-and-iron/`, `dist/harbor-and-hollow/`, `dist/garys-hilltop/`, `dist/mach-detail/`, and a root showcase. Cloudflare Pages deploys `dist/` from `main` to aethersites.net. Harbor & Hollow compiles to static HTML, CSS, JavaScript, images, and video.

The concepts retain visible disclosure and `noindex` metadata/headers. The root showcase can be indexed; its sitemap includes only the root. External contact links point to verified business listings. Gary’s planner prepares a note locally. Mach Detail prepares a text draft that visitors can review and send from their messaging app; no live calendar, automated messages, or appointment reservations are enabled. Photo and artwork provenance is documented separately for each site. Do not remove these boundaries when moving hosts without an approved change in project status.

## Motion

Native scrolling drives a contracting hero frame, slow image movement, expanding section edges, and the process rail. Recover, Refine, Design, and Build settle into view in sequence. On desktop the material image holds briefly beside the copy; mobile uses normal document flow and a vertical process rail. Numbered section preheaders and decorative counters have been removed.

The supplied motion CSS and scroll handoff are preserved under `reference/reworxct/`. The shipped adaptation in `motion.css` uses one animation-frame controller for consistent browser behavior. There is no scroll hijacking, autoplay video, or continuous render loop. Reveals remain visible without JavaScript or IntersectionObserver; reduced-motion changes disable the scroll effects and reveal all content. Keyboard focus immediately exposes the focused content.

## Repository and checks

Source: [AetherAI3/aether-sites](https://github.com/AetherAI3/aether-sites).

The GitHub Actions workflow checks the source and builds the static output on pushes to `main` and pull requests. Inspect the Actions tab for the current run result; a workflow file alone does not establish passing CI.

Static HTML now loads CSS and JavaScript through content-versioned filenames generated during the collection build. Changed assets receive new URLs, preventing cached styles from mismatching new page markup. The build verifies every rewritten reference and all showcase card styles.

### Waterbury Aquarium

`/waterbury-aquarium/` adds an independent aquatic retail concept with detailed illustrative aquatic imagery, a filterable category guide, interactive aquascape topics and a local visit checklist. The water-kit overhaul adds layered gradients and bounded scroll motion. Store details and directory-listed hours are sourced; changing inventory is checked by phone. See [the implementation notes](docs/waterbury-aquarium.md). Supplied handoff files are preserved under `reference/waterbury-aquarium/`.

### Barber’s Ink

`/barbers-ink/` follows the supplied Precision Frame direction with locally hosted Barlow type, decorative chrome planes, a contracting hero, an expanding shop frame and a stationary appointment planner. Its Booksy link leads to the business’s public booking page. Drafts remain in page memory and are never submitted or stored. The original creative handoff remains in the supplied attachments; source verification, scope and activation requirements are in [docs/barbers-ink.md](docs/barbers-ink.md).

### Empanada's The place TOGO

`/empanadas-togo/` adds the Golden Counter concept with expanding menu frames, native scroll motion and a persistent item bag. The pickup form generates a local list to copy or save; no order is sent and no payment is taken. Supplied design references are preserved in `reference/empanadas-togo/`. See [the implementation and source notes](docs/empanadas-togo.md).

### Homepage showcase and contact

The homepage reuses Blackstar’s visitor-controlled 3D carousel pattern, adapted for all eight concepts. The AE mark comes from the current Aether marketing navbar (`AETHER-CLOUD/web/src/components/SiteNavbar.jsx`). Green remains the primary site accent. Native links and a complete grid work without JavaScript; enhanced navigation supports arrows, keyboard, swipes, and a grid toggle.

`functions/api/contact.js` is a Cloudflare Pages Function, deployed from the repository root alongside the static `dist/` output. It forwards validated inquiries to Aether’s existing public `contact-submit` service, which stores `contact_submissions` and manages its existing team notifications. No new credentials or provider setup is required in this repository. The visitor’s real Origin is preserved; the function does not impersonate the marketing domain. Only Cloudflare’s trusted client-IP header is forwarded for the upstream rate limit. Browser data is not stored locally or placed in URLs.

Success requires a saved inquiry ID, not an HTTP 200 alone. Failures, malformed upstream responses, and rate limits preserve the browser draft. Native form submission also works without JavaScript. Existing upstream inbox notification delivery is best effort; a saved row is not evidence of email delivery.

Checks: `npm run check` includes contact validation, payload, receipt, failure, and native-form cases. CI builds the collection, then runs `tests/showcase-browser.mjs` in Chromium at desktop and mobile widths, including reduced motion and no-JavaScript checks. Browser form responses are mocked; those tests do not send inquiries. Screenshot artifacts are attached to the validation run. An actual inbox-delivery test requires an explicitly authorized test message.
