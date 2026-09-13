# Gary’s Hilltop Auto Repair

The third site in `AetherAI3/aether-sites`, under `garys-hilltop/`. This is an independent design concept for the real shop in Torrington, Connecticut, with an unobtrusive footer disclosure and noindex metadata.

## Design and interaction

- A CSS-only graphite and blue gradient opens the site. Plain service copy, the phone number, address and weekday hours are visible immediately.
- Services lead into practical diagnostic call preparation, attributed customer reviews, the shop location and phone appointment information.
- The actual storefront photograph appears only in the location section. The SUV photograph is retained as a supplied asset but is not displayed. The new reference markup’s generic Facebook/CARFAX URLs and unverified individual review stars were not adopted.
- The supplied visual upgrade adds mint-to-cyan headline text, glass cards, gradient borders and buttons, aurora light, pointer spotlights and a subdued CTA glow. No viewport is pinned. Ambient animation pauses offscreen and in hidden tabs.
- Native CSS timelines drive hero movement and reading progress where supported. IntersectionObserver handles reveals, header state, active navigation and the rating animation; no scroll listeners are used. System reduced motion and the footer control disable all decorative movement. Observer failures reveal all content. Keyboard focus reveals content immediately.
- Readable sentence-case copy and a two-family type system replace the HUD, slogans, numbered/stat blocks, hazard stripes, scanlines and simulated diagnostic output.
- Navigation, call links and directions remain usable without JavaScript. Header height is measured for anchor offsets when scripts are available.

## Service planner

Calling the real shop is the primary appointment action. The optional, collapsed planner validates a vehicle and service, creates a local note, and supports copying and editing. It does not send a request, store input, or reserve an appointment. The diagnostic link opens it with Diagnostics selected. A real delivery endpoint and shop approval would be needed to offer online booking.

The untouched four-file upgrade kit is preserved in reference/visual-upgrade/. Runtime adaptations are in dist/enhancements.css and dist/enhancements.js. Existing menu and service-note logic stays in dist/script.js.

## September 13 design audit

| Finding | Revision |
| --- | --- |
| The busy roadside photo competed with the opening message. | Replaced the opener with a clean CSS gradient; moved the photo to location information. |
| A two-viewport pin delayed access to useful content. | Returned the entire page to natural scrolling with subtle movement. |
| Slogans, ticker text, decorative lines and a mock terminal overshadowed the shop. | Replaced them with direct service headings and practical call preparation. |
| Address-as-stat blocks and repeated decorative labels added length. | Consolidated details into readable address, hours and contact groups. |
| Every service pushed visitors toward a form that cannot book. | Prioritized the phone number and made note preparation explicitly optional. |
| Small uppercase and monospaced labels made the page feel like a dashboard. | Used regular text, larger labels and simpler buttons. |

## Business facts and sources

Checked September 13, 2026:

- Phone `(860) 482-4030` and address `1294 E Main St, Torrington, CT 06790`: [shop Facebook page](https://www.facebook.com/garyshilltop/) and [CARFAX](https://www.carfax.com/Reviews-Garys-Hilltop-Auto-Repair-Torrington-CT_QETDMGJ001).
- Review score `5.0/5`, `69` verified service reviews, and the three short excerpts: CARFAX. The supplied 4.7/120 Google claim was not reproduced. Different platforms and counts must not be conflated.
- Broad service categories: [Yellow Pages](https://www.yellowpages.com/torrington-ct/mip/garys-hilltop-auto-repair-480045510), with brakes and oil changes corroborated by CARFAX.
- Weekday hours `8 AM–5 PM`: [Loc8NearMe](https://www.loc8nearme.com/connecticut/torrington/garys-hilltop-auto-repair/4325311/) and Yellow Pages. Weekend listings differ, so the page asks visitors to call.
- The directive’s GTI specialty, aftermarket tuning/custom-exhaust offers, same-week availability, walk-in promises, years-in-business counter and invented shop history are not asserted.

`dist/sources.html` provides visitor-facing source and photo notes. No LocalBusiness aggregate-rating schema is attached to an unofficial concept.

## Photos

- `dist/assets/shop-exterior.webp`: supplied `c570fea7-0a36-4eeb-a701-a2c687a3389b.png`, 984×700.
- `dist/assets/vehicle.webp`: supplied `dbe94c3a-a79f-4f58-b51e-132699b6b629.png`, 536×664.
- WebP encoding preserves the complete frames. The location section displays the storefront’s complete frame.
- A generic garage illustration was generated early in the session, then superseded by the user’s real photos. It is not included in the deployed site or repository.

## Portable source

Serve `dist/` directly. There is no package installation or framework build. The collection’s `npm run check` and `npm run build` include this site. Each private preview has its own hosting identity; the other two sites are maintained separately.
