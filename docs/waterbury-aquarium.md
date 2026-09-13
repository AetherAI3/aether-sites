# Waterbury Aquarium

Independent local aquarium-shop website concept at `/waterbury-aquarium/`.
Source directory: `waterbury-aquarium/`. Published as part of the existing aethersites.net Cloudflare Pages build. Do not create a replacement collection or change other concepts.

## Direction

Adapted the supplied depth palette, Fraunces-style warm typography, glass column, coral pill buttons, gentle bubbles and caustics. The initial CSS/SVG hero was replaced by an illustrative angelfish portrait in the water-kit overhaul. A labeled, generated aquascape image supplies the larger planted-tank moment. Native CSS view timelines gently enlarge and shrink its frame in normal document flow; no sticky 220vh stage, empty scroll transitions or always-running JavaScript render loop.

A solid gradient container below the catalog guarantees light text contrast regardless of screen width or total document height. Mobile navigation, click-to-call, directions and listed hours are accessible throughout. All explanatory text is visible without JS. Native details remain interactive without JS.

## Honest content boundaries

Research reviewed September 13, 2026:
https://www.fishstores.org/connecticut/waterbury/waterbury-aquarium

The directory supports 406 Watertown Ave, Waterbury, CT 06708; (203) 757-3832; freshwater, saltwater, plants/shrimp, hardscape, equipment and new/used aquariums. Hours are presented explicitly as directory-listed: Mon–Sat 10 am–8 pm; Sunday 10 am–6 pm. Call before traveling.

The supplied brief also describes the store and stock categories. No exact founding date, owner-verified hours, inventory feed or pricing has been obtained. No specific species is advertised as in stock. Do not add fabricated quotes, scores, arrivals, family activities, booking confirmations, water service claims or tank specifications.

`waterbury-aquarium/sources.html` provides visible disclosures and provenance. Public concept is noindex in HTML and Cloudflare response headers.

## Interactions

- Category filters: Everything, Freshwater, Plants & shrimp, Saltwater, Equipment. Multiple classification supported for hardscape. Counts announced via live region. Hidden cards use native hidden.
- Card details: practical questions to ask, no invented compatibility guarantees.
- Aquascape planner: new/existing setup and plants/shrimp/hardscape interests produce a local checklist. Copy uses Clipboard API with a selectable textarea fallback. No backend, persistence, collection of personal data, appointment, or message to the shop.
- Motion: threshold-zero IO reveals after successful observer creation; no-JS/no-IO/throwing-IO preserve content. Dynamic reduced-motion and footer pause control. Ambient art pauses offscreen and in hidden tabs. Native scroll timelines have priority. In unsupported browsers only, a passive scroll handler schedules at most one frame for targets near the viewport; it pauses when reduced motion, manual pause, hidden tabs or offscreen state make updates unnecessary. No permanent rAF loop.
- Optional feature-detected WebMCP `filter_aquarium_categories` shares the visible filter action. DOM harness validates contract; real supported-browser WebMCP validation unavailable in this environment.

## Assets

Original handoff retained verbatim at `reference/waterbury-aquarium/`.
Runtime base CSS is original; `styles.css` contains layout, accessible overrides and production motion. `motion.js` replaces the unsafe original's unconditional IntersectionObserver, early hidden content, unsupported live arrivals and quote rotator.

`assets/aquascape.webp` is an optimized AI-generated illustration, not a photo of the actual business. Built-in ImageGen prompt:

> Beautiful mature freshwater planted aquarium, lush fine leaves and moss covered driftwood, layered weathered dark rocks, a fine pale sand path winding into depth, and a small school of neon tetras. Photorealistic illustration framed entirely inside the aquarium; clear teal freshwater with upper light shafts. Moody deep teal and lush green. No coral, saltwater species, people, store setting, signage, text or watermarks. Generic illustrative aquascape, not a photograph of any actual store or its inventory.

Generated original 1536×1024, converted to WebP quality 84. The custom fish favicon remains original code-native artwork. Hero and category imagery was upgraded as described below.

## Delivery

`npm run check` checks the new JS and all new HTML references alongside the other concepts. `npm run build` copies the new directory and versions CSS/JS by content hash. Collection entrypoint links to the site with matching image and typography. No dependencies or framework added.


## Water-kit overhaul — September 13, 2026

- Reviewed the new HTML snippets and CSS in full; verbatim sources are under `reference/waterbury-aquarium/water-kit/`. Runtime `water-kit.css` corrects invalid font shorthands; `water-experience.css` composes its gradients and components with the existing site.
- Angelfish portrait, shrimp macro and clownfish illustration replace the flat hero and catalog silhouettes. All remain visibly labeled as AI-generated/illustrative. No image represents actual current store stock.
- Renamed category cards to useful subject names. Replaced repetitive poetic headings and removed redundant negative wording. Contact, stock and reservation behavior remains accurate.
- Rechecked Fishstores.org and https://waterbury-aquarium.edan.io/; both display the same address, phone and hours. Hours remain directory-listed, not owner-confirmed. Neither scraped reviews nor health/price superlatives are reproduced. RO water services, jug size, founding date and live availability remain unconfirmed and are not advertised.
- Added wave transition, floating water-light pools, subdued caustics, deeper teal gradients, glass contact card and button sheen. Decorative effects pause offscreen, in background tabs and on user/system motion preference changes.
- Scroll effects now cover the hero image and detail inset, expanding aquascape frame, photo depth, planner/contact panel entry and preparation rules. All stay in normal flow; no pinned scroll trap.
- Added keyboard-operable aquascape topics through synchronized image points and labeled topic buttons. They update visible, announced explanatory copy and a gentle image emphasis. No-JS keeps the image/caption and all main content; topic controls are shown only after setup.
- Fixed the existing desktop mobile-menu-toggle visibility bug during the sweep.
- The optional WebMCP filter continues to use the same visible categories. Real supported-browser WebMCP validation remains unavailable.

### Added image prompts

All three assets were made with the built-in image generator (one request per asset), inspected, and optimized to 1200×800 WebP, quality 83. Full image-generation originals are outside the repository; runtime outputs are in `waterbury-aquarium/assets/`.

- `angelfish.webp`: one silver freshwater angelfish with vertical black stripes and fully visible long fins, side profile among tall aquatic leaves. Centered for a 4:5 crop, diffused top light, clear deep teal freshwater, natural silver and green. No text, signage, people or equipment; generic illustrative aquarium, not this business.
- `shrimp.webp`: one small red cherry shrimp on vivid green aquatic moss beside driftwood, delicate antennae and plausible anatomy, close macro with teal/green bokeh, centered for a 4:3 crop. No text, signage, people or equipment; generic illustrative aquarium, not this business.
- `clownfish.webp`: one orange marine clownfish with black-edged white bands near soft anemone tentacles, side profile, centered for a 4:3 crop, clear blue-teal marine water and diffused aquatic light. No text, signage, people or equipment; generic illustrative aquarium, not this business.
