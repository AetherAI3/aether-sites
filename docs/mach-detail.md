# Mach Detail — concept and handoff

Built September 13, 2026 in `mach-detail/`. Preview: https://aethersites.net/mach-detail/.

An independent, unofficial Aether Sites concept. It is not commissioned or endorsed by Mach Detail. The original kit is preserved in `reference/mach-detail/`; the published page uses an adapted visual system and rewritten interactions.

## What works

- Responsive matte-black/cyan HUD design using the supplied Space Grotesk / JetBrains Mono tokens, restrained glass cards, pointer lighting, and progressive section entrances.
- Nine optimized local photographs, category filters, full-photo dialog, previous/next buttons, keyboard arrows, Escape, and focus return. With JavaScript off, every gallery image remains an ordinary image link.
- A service menu with quote-based calls to action, two supplied customer review excerpts, address, directions, hours, verified listing contact, FAQs, and a mobile call/request bar.
- Local request planner: service, name, vehicle, preferred date, arrival preference, and optional notes. Date validation uses `America/New_York`; tomorrow through 90 days ahead, excluding Sundays. Arrival windows are preferences and do not represent free slots. Same-day inquiries go to the shop by phone.
- Request text is generated locally. The visitor can copy it or open a text draft to the listed shop number. The visitor must review/send it in their messaging app. Edits invalidate an earlier draft. Clipboard failure falls back to selecting text.
- No PII enters URLs until the visitor chooses the clearly labeled SMS handoff. No analytics, cookies, storage, form API, or automatic messaging. No-JS forms are disabled; phone and social links remain available.

## Factual grounding

| Item | Basis | Presentation |
| --- | --- | --- |
| Business name and location | User brief and [MachDetail Facebook listing](https://www.facebook.com/TorringtonAutoDetailingnMore/) search result, checked September 13, 2026 | Mach Detail, 644 Main Street, Torrington, CT 06790 |
| Phone | Same business listing search result | `(347) 725-6349`, working `tel:` and user-initiated SMS draft links |
| Rating | Facebook listing search result showed 5.0 (14) at lookup time | 5.0 with **Facebook listing** label and a link to current reviews; no claim of perpetual perfection or Google rating verification |
| Hours | Supplied by Brandon: Mon–Fri 8am–5pm, Sat 9am–2pm, Sunday closed | Published with a short confirm-hours note; holiday exceptions have not been independently checked |
| Service families | User brief: interior/exterior details, correction, coatings | Consultation/quote wording. No fabricated dollar prices, duration, ceramic warranty, coating brand, paint-depth procedure, or guaranteed scratch removal |
| Reviews | Excerpts and original Google links supplied by Brandon during the build | Short exact excerpts credited to James Martel and Dom P. No invented remainder, review dates, star counts, avatars, or review schema |
| Photos | Nine uploads supplied with the brief | Real supplied images, neutral subject captions. No assertion that a given car received ceramic coating or a specific repair |

Direct Facebook page retrieval was unavailable; the listing facts above came from its search result. The user supplied review links and excerpts; full reviews have not been independently retrieved. No claim that every business detail has been independently verified.

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
