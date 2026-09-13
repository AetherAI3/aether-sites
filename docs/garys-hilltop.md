# Gary’s Hilltop Auto Repair

The third site in `AetherAI3/aether-sites`, under `garys-hilltop/`. This is an independent design concept for the real shop in Torrington, Connecticut, with an unobtrusive footer disclosure and noindex metadata.

## Design and interaction

- The supplied base and scroll stylesheets are loaded in the requested order, followed by the responsive page layer. Originals remain in `reference/`.
- The actual supplied storefront photograph anchors the hero. The SUV photo appears alongside the diagnostic explanation; no repair history or platform specialization is implied.
- Matte black and steel surfaces, restrained cyan lighting, clear typography, six service cards, genuine attributed reviews, shop information and a service planner.
- On sufficiently tall desktop screens the hero pins across 200svh, with a subtle frame contraction, image scale and vignette. Short screens and enlarged content use normal flow.
- Native CSS timelines drive photo motion and the diagnostic sequence; a coalesced animation-frame fallback handles unsupported browsers. All content remains visible without JavaScript or observers. Pause and system reduced-motion controls disable decorative motion.
- The terminal illustrates a diagnostic process. It does not show live vehicle telemetry, measured test results, or an actual customer diagnosis.
- Mobile review cards use manual horizontal scrolling. There is no auto-advancing carousel.

## Service planner

The planner validates the vehicle and selected service, creates a local note, supports copying and editing, and links to the real shop’s telephone number. It does not send a request or reserve an appointment. No browser storage or backend holds planner input. A real appointment-delivery endpoint and shop approval would be needed to replace this with online booking.

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
- WebP encoding preserves the complete frames. Framing and subdued color treatment are applied through CSS.
- A generic garage illustration was generated early in the session, then superseded by the user’s real photos. It is not included in the deployed site or repository.

## Portable source

Serve `dist/` directly. There is no package installation or framework build. The collection’s `npm run check` and `npm run build` include this site. Each private preview has its own hosting identity; the other two sites are maintained separately.
