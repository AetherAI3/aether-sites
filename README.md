# Aether Sites

Independent website concepts prepared for **aethersites.net**. Each concept has its own top-level folder. This repository is the source collection; the custom domain is not configured by this scaffold.

## First concept: `reworxct`

A fresh industrial presentation for Reworx: charcoal surfaces, ember accents, sharp geometry, large Archivo typography, and the supplied cinematic timber imagery. This is an **unofficial design concept**, not Reworx's official website or an endorsed project.

- `reworxct/index.html` — rewritten content and semantic page structure.
- `reworxct/styles.css` — responsive visual system, based on the supplied guide.
- `reworxct/script.js` — progressive mobile navigation.
- `reworxct/assets/` — four supplied images, optimized to WebP.
- `docs/reworxct-sources.md` — sources, factual boundaries, and asset provenance.
- `reference/reworxct/` — supplied brand guide and CSS, with image references localized for this repository.
- `scripts/` — dependency-free build and checks.

## Local use

Requires Node.js 20+ and Python 3 for checks. No package installation is needed.

```sh
npm run check
npm run build
python3 -m http.server 8080 --directory dist
```

Open `/reworxct/`. The root currently redirects there. New client concepts should get their own folders; update `scripts/build.mjs` deliberately when adding one.

## Publishing

The build creates `dist/reworxct/` and a root entrypoint. The site is portable static HTML/CSS/JavaScript. The private design preview is managed separately; its hosting identity is excluded from this portable GitHub snapshot. Configure `aethersites.net` separately through its authorized hosting and DNS account when ready.

The concept has visible disclosure, `noindex` metadata, and robots exclusion. External contact and booking links point to the real business, and no local form collects leads. Supplied imagery is identified as concept art, not a verified customer portfolio. Do not remove these boundaries when moving hosts without an approved change in project status.

## Repository and checks

Source: [AetherAI3/aether-sites](https://github.com/AetherAI3/aether-sites).

The GitHub Actions workflow checks the source and builds the static output on pushes to `main` and pull requests. Inspect the Actions tab for the current run result; a workflow file alone does not establish passing CI.
