# Mach Detail — concept and handoff

Built September 13, 2026 in `mach-detail/`. Preview: https://aethersites.net/mach-detail/.

An independent, unofficial Aether Sites concept. It is not commissioned or endorsed by Mach Detail. The original kit is preserved in `reference/mach-detail/`; the published page uses an adapted visual system and rewritten interactions.

## What works

- Responsive matte-black/cyan HUD design with locally hosted Barlow Condensed Black display type, Space Grotesk body copy, JetBrains Mono labels, selected chamfered frames, pointer lighting, and scroll-driven presentation.
- Nine optimized local photographs, category filters, full-photo dialog, previous/next buttons, keyboard arrows, Escape, and focus return. With JavaScript off, every gallery image remains an ordinary image link.
- A service menu with quote-based calls to action, two verified five-star Google review excerpts in a manual cinematic carousel, address, directions, hours, verified listing contact, FAQs, and a mobile call/request bar.
- Local request planner: service, name, vehicle, preferred date, arrival preference, and optional notes. Date validation uses `America/New_York`; tomorrow through 90 days ahead, excluding Sundays. Arrival windows are preferences and do not represent free slots. Same-day inquiries go to the shop by phone.
- Request text is generated locally. The visitor can copy it or open a text draft to the listed shop number. The visitor must review/send it in their messaging app. Edits invalidate an earlier draft. Clipboard failure falls back to selecting text.
- The prepared text is encoded in a local SMS link; no request details leave the page until the visitor chooses that handoff. No analytics, cookies, storage, form API, or automatic messaging. No-JS forms are disabled; phone and social links remain available.

## Factual grounding

| Item | Basis | Presentation |
| --- | --- | --- |
| Business name and location | User brief and [MachDetail Facebook listing](https://www.facebook.com/TorringtonAutoDetailingnMore/) search result, checked September 13, 2026 | Mach Detail, 644 Main Street, Torrington, CT 06790 |
| Phone | Same business listing search result | `(347) 725-6349`, working `tel:` and user-initiated SMS draft links |
| Rating | Google Maps profile observed September 13, 2026: 5.0, 35 reviews | 5.0 with **Google reviews** label and a link to the current listing. Review count is omitted from the page so it does not imply live synchronization |
| Hours | Supplied by Brandon and matched against the expanded Google Maps weekly schedule, September 13, 2026 | Mon–Fri 8am–5pm, Sat 9am–2pm, Sunday closed. Confirm holiday exceptions with the shop |
| Service families | User brief: interior/exterior details, correction, coatings | Consultation/quote wording. No fabricated dollar prices, duration, ceramic warranty, coating brand, paint-depth procedure, or guaranteed scratch removal |
| Reviews | Original review links and excerpts supplied by Brandon; both full Google reviews opened and both five-star ratings confirmed September 13, 2026 | Exact excerpts credited to James Martel and Dom P, five visible stars, original Google links. Initials are UI marks, not invented profile photos. No review schema |
| Photos | Nine uploads supplied with the brief | Real supplied images, neutral subject captions. No assertion that a given car received ceramic coating or a specific repair |

The initial Facebook lookup used its search result. A later direct Google Maps check independently matched the name, address, phone, rating, and both review excerpts. Google lists an existing business website at `https://www.tad-plus.com/` and Instagram at `https://www.instagram.com/machcollision/`; this concept does not claim the business has no website. The business description states that quotes and appointments are handled in person. The page now presents the text planner as a way to arrange that conversation, not as online confirmation. Holiday exceptions and current package prices remain unverified.

## Image provenance

All originals remain unchanged; exported WebP files preserve aspect ratio. The nine images total about 724 KiB. Only the hero loads eagerly; gallery/process images are lazy. The user's photos do not include verified McLaren, Porsche, or Mustang work, so those kit placeholders were removed.

| Upload prefix | Site asset | Subject |
| --- | --- | --- |
| 7967cdbe | `red-hatch.webp` | Red performance hatch outside shop |
| acc43ec3 | `night-sedan.webp` | White sedan and violet underglow |
| b9ae591d | `work-in-progress.webp` | Yellow vehicle with bumper removed |
| 7c86b3b5 | `wash-bay.webp` | Truck wheel being washed |
| f5769114 | `shop-bay.webp` | Commercial chassis in workshop |
| 7dd9da62 | `red-audi.webp` | Red Audi exterior; hero |
| 87d7139a | `motorcycle.webp` | Motorcycle in workshop |
| 72dcf1e7 | `jeep.webp` | Jeep exterior |
| 93a5e388 | `corvette.webp` | Corvette in bay |

## Booking integration boundary

The original kit claimed a synced ledger, reserved slots, and scheduled SMS without implementing them. Those claims and its fake phone number were removed. The live concept does not book appointments, accept payments, or send automated messages. There is no provider deployment behind it.

The proposed API, calendar invariants, outbox, and Nano/Aether Cloud mapping are documented in [the integration plan](../integrations/mach-detail/README.md), with a SQL reference schema and OpenAPI contract. These are proposed integration artifacts, not deployed infrastructure.

Before activating real bookings, the shop must establish service durations/buffers, bays and staff capacity, holiday overrides, cancellation policy, verified contact channels, and access to its actual calendar. Connect one authoritative ledger, then verify concurrency and message delivery. Keep request acceptance distinct from appointment confirmation.

## Checks and publishing

`npm run check` includes request/date regression tests, script parsing, and all collection link/asset checks. `npm run build` includes `dist/mach-detail/` while excluding `reference/`, `docs/`, and `integrations/`. The concept carries `noindex, nofollow`; the build adds matching Cloudflare headers. The collection root remains indexable and its sitemap stays root-only.

Keep the concept disclosure, correct contact details, and noindex until the business approves an official launch. No live test message was sent to the shop during this build. Synthetic tests verify date/validation/request construction, not provider connectivity or delivery.

## Typography and scroll polish

The second supplied kit adds `type-overhaul.css`, retained in `reference/mach-detail/`. Its condensed uppercase type and selective cut corners informed `styles/presentation.css`. The source uses a locally hosted [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) 900 face; its SIL Open Font License is included beside the WOFF2 file. Body copy and field labels remain sentence case.

`js/motion.js` coordinates a scroll-moving typographic ribbon, hero drift, service/gallery entrances, a shop process trace, subtle photo movement, review-backdrop movement, and a request-route trace. One scheduled animation frame reads only nearby scene geometry before applying style updates. There is no scroll interception, infinite animation loop, pinned scene, or runtime dependency. Compact screens use short entrances and the ribbon; desktop parallax is disabled. Reduced motion disables decorative movement, keyboard focus cancels a target's entrance, and content is visible without observers or JavaScript.

Gallery thumbnails now use equal frames with consistent crops; every image opens uncropped in a modal with a fixed header and footer. The image track shrinks to the available viewport height, the background cannot scroll while the dialog is open, and Escape restores focus without moving the page.

### Browser verification — September 13, 2026

- Desktop: heavy display font rendered; all nine thumbnail frames measured 399 × 299 CSS pixels at the tested desktop width. The shop filter returns five photos.
- Responsive frame checks at 360, 390, and 768 pixels found no horizontal overflow. These are browser layout checks, not physical-device certification. The phone menu opens and closes after choosing a section.
- At the narrowest test width, the full-photo modal, image, caption, and previous/next/close controls fit inside the viewport. Next advances the photo; Escape closes the modal, removes the background scroll lock, and returns focus to the original thumbnail.
- Scroll scene styles update as sections enter the viewport. The active navigation state and ribbon progression were observed. No application errors were reported in the tested flow; the browser extension produced unrelated metadata warnings.
- The appointment request regression checks and collection build passed. The previous live form check covered Sunday rejection, a valid request draft, and invalidating the SMS link when details change. No test message was sent.

The responsive test surface was used only in a preview deployment and is excluded from the production source.


## Cinematic reviews and quality sweep

The review section gives one real customer excerpt the full frame, backed by supplied workshop imagery. Background photos are decorative and are not identified as either reviewer’s vehicle. Warm five-star marks, clear attribution, and individual Google links remain readable on the dark surface.

- `js/reviews.js` handles previous/next, direct selectors, Arrow keys, Home/End, and deliberate horizontal touch gestures. Vertical scroll and pinch zoom stay native. There is no automatic rotation.
- Inactive slides are inert, hidden from the accessibility tree, and removed from keyboard order. Changing a slide from a focused review link moves focus to its selector. A polite live region announces the selected author and position.
- Shared grid sizing prevents the layout from jumping between the two quote lengths. CSS respects reduced motion. Without JavaScript both excerpts are visible; controls appear only after initialization.
- The compact menu has a two-column layout with a full-width request action. Header navigation, gallery introduction, correction description, and appointment wording were tightened for clarity.
- The rating strip now points to Google. Facebook remains available, and the business’s listed Instagram was added to the footer.

### Google destinations

- Place ID: `ChIJx3Hy5BCZ54kRyHgIYuYDmQw`, matched through the Mach Detail profile’s own write-review control.
- [Google business profile](https://www.google.com/maps/place/?q=place_id:ChIJx3Hy5BCZ54kRyHgIYuYDmQw).
- [Write a review](https://search.google.com/local/writereview?placeid=ChIJx3Hy5BCZ54kRyHgIYuYDmQw): opened the public Google review form with the Mach Detail heading, unselected rating stars, an empty review field, and Post disabled. The dialog was canceled. No rating, text, or review was submitted.
- Individual reviewer URLs remain the exact links supplied by Brandon and verified against Google Maps.
