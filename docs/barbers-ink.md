# Barber’s Ink — site and booking handoff

Route: `/barbers-ink/`. This is an independent Aether Sites design concept, not an owner-approved official business site. The public collection and concept disclosures are retained. The concept has HTML `noindex, nofollow` and matching deployment headers.

## What ships

- The supplied Precision Frame art direction: near-black, charcoal, cyan, locally hosted Barlow Condensed ExtraBold, and editable abstract chrome planes.
- A contracting hero (1 → 0.84), an expanding shop frame (0.8 → 1), a bounded scroll response in the wordmark band, and a static service/booking surface. Normal page scrolling remains native; there are no timers, infinite render loops, scroll hijacking or required timeline APIs.
- Desktop/tablet layout plus a linear mobile layout. Reduced motion and the Pause motion control remove the transformations. Navigation, links and form controls sit outside transformed ancestors. Listeners are aborted on disposal, with back-forward cache restoration supported.
- A direct external link to the business’s existing Booksy booking page, plus verified telephone and map directions.
- Appointment and question planners with native labels/radios, New York date boundaries, preferred time windows, a persistent current selection, associated field errors, editable client fields and a copyable plain-text draft. Changes invalidate the previous draft. Mode changes retain the visitor’s entered fields.
- The planner never makes a network request, submits contact details, writes browser storage, creates a hold or reserves an appointment. Real availability and confirmation belong to Booksy/the shop. The form fieldsets are disabled until the local handler is installed, so a missing script cannot leak fields via a default GET submission. On clipboard failure the draft is selected for manual copy.
- The collection card, the new homepage map’s Torrington project list/count, build route list, asset checks, noindex headers and README were updated. Root Vite preview configuration now supports previewing the static collection using the existing installed dependency; production still uses `scripts/build.mjs`.

## Business details checked on 2026-09-13

The brief’s claim that the shop has no online booking is incorrect. Its public [Booksy page](https://booksy.com/en-us/753901_barbers-ink-llc_barber-shop_15384_torrington) has a service menu, pricing, appointment actions, staff, work photos and reviews. It lists Barber’s Ink, LLC at 79 Main St, Torrington, 06790. Regular cuts, taper/shape-up and beard maintenance are listed. The concept links to this page for current prices and available appointments rather than freezing volatile values into the page.

[Torrington Downtown Partners](https://www.torringtondowntownpartners.com/) search results list 79 Main Street, units 14 and 15 and (860) 201-4865. The same phone and address appear in indexed posts from the [shop’s Instagram profile](https://www.instagram.com/barbers_ink_llc/). The directory’s detail page was not retrievable in this session, so the phone/unit details are supported by indexed primary-source excerpts rather than a fresh rendered directory page.

The brief says appointment-only and Sunday/Monday closed. Some recent indexed shop posts instead mention walk-ins. The current Booksy page showed Sunday closed but did not expose the full week in its public text. Therefore the concept does not publish a permanent weekly schedule or make an appointment-only claim. Visitors are directed to the shop for hours. Draft dates express preferences and do not assert bookable hours or slots.

## Photography and licensing

The user supplied the Barlow font and SIL Open Font License. Those are retained under `barbers-ink/assets/fonts/`. The editable chrome motif is adapted from the user’s supplied handoff; it is nonrepresentational decorative geometry, not a claim about the shop’s actual appearance.

No cleared interior/work photography was supplied. Verified candidates found during research were a 2022 Hearst Connecticut Media interior photo by Emily M. Olson and haircut photographs from the business’s Booksy portfolio. Commercial reuse and customer image permissions were not established, so these photos are not included. The finished shop section uses an address/chrome composition without an unresolved placeholder. Replace it with licensed owner-approved photography when available; do not represent generated or stock images as this shop.

The actual Booksy logo is black/gold; the cyan type treatment remains a proposed concept identity.

## Booking integration remains separate

The original `BUILD-PROMPT.txt`, `HANDOFF.md` and `INTEGRATION.md` remain in the supplied attachments and local working references. They are excluded from the public source release. The integration document is a future server contract, not an implemented service.

No Nano runtime/SDK contract, Aether Cloud tenant/endpoint, owner-authorized staff calendars, datastore or confirmation delivery credentials were supplied for this shop. No backend, database migration, fake endpoint or simulated booking success is shipped. The live booking route goes to the already operational Booksy page. Any custom Nano/Aether booking replacement must be commissioned and connected before replacing that route.

Before enabling custom on-site booking, obtain the owner’s approval, calendar access, service IDs/durations/buffers, staff/resource mappings, working hours/exceptions and cancellation/privacy policies. Then implement and verify the supplied contract: server-authoritative America/New_York dates, atomic overlap protection across the full occupied interval, idempotent submissions, tenant-isolated records and a transactional notification outbox. Real confirmations must follow the ledger commit. Existing external bookings must share the same occupancy source before a second channel accepts appointments.

Concurrent bookings, DST folds/gaps, rescheduling, outbox delivery and customer-record security cannot be asserted from this static concept. Those require tests against the actual production integration. No appointments, leads or messages were sent during development.

## Verification

- Collection source checks and production build passed locally, including local assets/anchors, unique IDs, concept noindex and content-versioned CSS/JS.
- Browser viewport checks: 360, 390, 768, 1024 and 1440px. No document horizontal overflow; hero CTA remained in the first 900px viewport and clear of supporting copy. Desktop and phone screenshots were visually inspected.
- Browser observed hero scale approaching 0.84 and shop expansion reaching 1 after normal anchor scrolling.
- Tested missing required fields, past dates, an appointment draft, a question draft, retained fields on mode changes, draft invalidation on edits and the motion toggle. Draft text and truthful success wording were inspected in the rendered result.
- Clipboard access is unavailable on the HTTP preview; the manual-selection fallback was verified. Successful native clipboard writing on a secure production origin was not exercised in the preview.
- Native labels, field errors and radio groups were inspected in the browser accessibility tree. A dedicated screen-reader session and operating-system reduced-motion emulation were not performed; reduced-motion styles and JavaScript checks were reviewed in source.
