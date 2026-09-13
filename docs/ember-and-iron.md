# EMBER & IRON

The second Aether Sites concept: an industrial wood-fired pizza brand concept without a claimed business location. The live surface uses the supplied menu, typography, gradients, and motion direction, with a discreet concept credit in the footer.

`dist/` contains the complete portable website. Its contents are mirrored into `ember-and-iron/` in the public [AetherAI3/aether-sites](https://github.com/AetherAI3/aether-sites) collection. The separate Reworx site is preserved.

## Interaction

- A wider ember gradient glows behind the hero and opens up as its frame shrinks. Desktop scaling reaches 88%; mobile stays at 94% for readability.
- Section boxes ease into full size, hold while reading, and retreat on exit. Native CSS timelines use stable outer wrappers; the JavaScript fallback uses the same easing curve. Process panels also ease back as the next one arrives.
- The rounded navigation tracks the current section, with an ember highlight that follows hover and keyboard focus. Textured stone-shaped buttons lift and reshape on interaction.
- Five pizza cells expand to 2.4 times their flex weight. Hover works with a mouse; native details elements support tap and keyboard. Coal Miner is listed as the rotating sixth pie.
- Dough, Fire, and Char form a sticky stack, with a readable static layout on short screens or when enlarged content cannot fit.
- The About this site panel uses a native dialog. It identifies the brand as an independent concept, explains that menu/prices/process details are illustrative, and links to the sample menu. The anchor fallback reaches the same concept explanation without JavaScript. It does not submit bookings or contact anyone.
- A visible pause control, system reduced-motion support, native scrolling, and visible content without JavaScript.

No third-party runtime dependencies or image downloads are required. Google Fonts has local system fallbacks. The four source files are `index.html`, `assets.css`, `styles.css`, and `script.js`.

## Source and content boundaries

`reference/` preserves the supplied directive, CSS, and annotated wireframe. The directive says its business facts and menu prices were invented. The menu and core pizza-making direction are retained as the supplied creative brief; the discreet footer identifies the design as a concept. Following the user's request to avoid fiction, invented reviews, review aggregates, press awards, factory history, seating count, exact address, opening hours, phone number, and social-account links were not published. Confirm real operating details and prices before using this as an official restaurant website. No business verification or real booking capability is claimed.

The supplied noise, ember and steel textures carry this version without raster imagery. No image or video generation was performed. All visible sections are completed; no wireframe annotations or map placeholders are shipped.

## Location and wording consistency — September 13, 2026

Removed the creative brief’s Pittsburgh location from all four published placements: the top strip, hero, concept section, and dialog. No replacement city or business address has been invented. The supplied files under `reference/` remain an unmodified record of the original brief.

Also removed the walk-in policy, no-substitutions rule, three-ton equipment claim, specific tap count, and promises that an address/hours would be announced. Navigation and the former visit dialog now describe the concept; the closing heading no longer asks visitors to walk in. The sample-menu label, illustrative-price note, metadata, top strip, and footer consistently identify what this page is. The pizza names, sample prices, creative process direction, gradients, and motion are retained.

The collection already identifies Ember & Iron as fictional and excludes it from the real-business project map; those boundaries remain consistent. Source checks covered visible copy, metadata, navigation destinations, dialog labels, the collection card, and map inclusion. Collection checks and the production build passed; no physical restaurant, ordering flow, or reservation capability is claimed.
