<p align="center"><a href="https://aethersites.net/"><img src="assets/aether-sites.svg" alt="Aether Sites — Websites with a point of view" width="900"></a></p>

# Aether Sites

**All my website concepts and creations, in one place.** Built by Brandon at [Aether AI](https://aethersystems.net/).

[**Explore the collection ↗**](https://aethersites.net/) · [**Purchase a site / arrange hosting ↗**](https://blackstarentertainment.org/#contact)

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
| `mach-detail/` | Mach Detail, Torrington; cyan HUD styling, nine supplied vehicle photos, customer review excerpts, and an appointment-request planner. |

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
