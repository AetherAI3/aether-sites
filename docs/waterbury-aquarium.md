# Waterbury Aquarium

Independent local aquarium-shop website concept at `/waterbury-aquarium/`.
Source directory: `waterbury-aquarium/`. Published as part of the existing aethersites.net Cloudflare Pages build. Do not create a replacement collection or change other concepts.

## Direction

Adapted the supplied depth palette, Fraunces-style warm typography, glass column, coral pill buttons, gentle bubbles and caustics. The hero is CSS/SVG. A labeled, generated aquascape image supplies the larger planted-tank moment. Native CSS view timelines gently enlarge and shrink its frame in normal document flow; no sticky 220vh stage, empty scroll transitions or always-running JavaScript render loop.

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
- Motion: threshold-zero IO reveals after successful observer creation; no-JS/no-IO/throwing-IO preserve content. Dynamic reduced-motion and footer pause control. Ambient art pauses offscreen and in hidden tabs. No page scroll listener or permanent rAF loop.
- Optional feature-detected WebMCP `filter_aquarium_categories` shares the visible filter action. DOM harness validates contract; real supported-browser WebMCP validation unavailable in this environment.

## Assets

Original handoff retained verbatim at `reference/waterbury-aquarium/`.
Runtime base CSS is original; `styles.css` contains layout, accessible overrides and production motion. `motion.js` replaces the unsafe original's unconditional IntersectionObserver, early hidden content, unsupported live arrivals and quote rotator.

`assets/aquascape.webp` is an optimized AI-generated illustration, not a photo of the actual business. Built-in ImageGen prompt:

> Beautiful mature freshwater planted aquarium, lush fine leaves and moss covered driftwood, layered weathered dark rocks, a fine pale sand path winding into depth, and a small school of neon tetras. Photorealistic illustration framed entirely inside the aquarium; clear teal freshwater with upper light shafts. Moody deep teal and lush green. No coral, saltwater species, people, store setting, signage, text or watermarks. Generic illustrative aquascape, not a photograph of any actual store or its inventory.

Generated original 1536×1024, converted to WebP quality 84. Custom fish favicon and hero/category SVGs are original code-native illustrations.

## Delivery

`npm run check` checks the new JS and all new HTML references alongside the other concepts. `npm run build` copies the new directory and versions CSS/JS by content hash. Collection entrypoint links to the site with matching image and typography. No dependencies or framework added.
