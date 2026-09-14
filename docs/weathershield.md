# Weathershield website

Standalone source: `weathershield/`. Intended route after merge and a successful deployment: `/weathershield/`.

## Delivery status

The HTML, CSS, JavaScript, collection card, town-level map entry, build registration, and source checks are authored. The execution workspace is unavailable. The five original photo attachments and uploaded motion kit could not be read from scratch; no original attachment bytes have been uploaded to this branch. This is a DRAFT and must not be merged or presented as a complete deployed website until those assets are imported and the checks below pass.

The interface was authored directly from the visible brief and mockup. It does not claim to reproduce the contents of the unread `weathershield.js`, `weathershield.css`, `index (1).html`, `README (1).md`, or `weathershield-motion-kit.zip` attachments.

## Original photographs

Import the original PNG files into `weathershield/assets/`, retaining the following names. The page, gallery links, collection card, and background texture already refer to these exact paths. Do not substitute generated imagery or unrelated stock work.

- `05af93b1-9641-44f3-8d91-734e5df3c4f7.png`: Blue-gray house; hero and gallery.
- `d1eab729-94df-4d9f-a409-4d956f03b8e2.png`: Green building; expertise section and gallery.
- `6ca1ab7b-6382-4a35-95fd-e62e9af05a7b.png`: Shingle close-up; gallery and contact texture.
- `da45e7e4-d61d-43e1-a603-63ab8262268b.png`: Unfinished roof; work-in-progress gallery.
- `74f5fbd0-4387-480a-babb-3af4a451673c.png`: Chimney and flashing; gallery.

The upload directory supplied for this conversation is `/workspace/scratch/e90e7fba5df5/upload/`. Use those files when the execution workspace reconnects. The manifest in `weathershield/assets/required-images.json` documents the required assets. The build preflight checks that all five files are present and have PNG signatures. Existing HTML checks also require their local references to exist. Missing images deliberately prevent publication.

Image dimensions in markup are based on the visible attachments and should be confirmed against the imported bytes. Preserve the roofs and house architecture. The fourth image contains exposed wood and is explicitly labeled as work in progress.

## Design and interactions

- Navy and slate surfaces, copper gradients, large grotesk headings with restrained italic serif accents.
- Full-height hero, asymmetric photographic grid, white expertise and process sections, and a glass project planner.
- One animation-frame controller handles native-scroll parallax and progress. No scroll hijacking, autoplay, or continuous rendering loop.
- Content is visible without JavaScript. Native service and FAQ disclosures work without enhancement.
- Mobile navigation preserves ordinary anchors, closes on selection, outside click and Escape, and resets at the desktop breakpoint.
- Gallery filters use pressed-state buttons and hide actual figures. The native dialog supports Escape, arrow keys, previous/next controls, focus return, and explicit image-error text.
- The planner validates town and project details, prepares plain text, and supports copy, download, and editing. Data remains in page memory. No endpoint, analytics, local storage, or simulated successful submission is involved.
- Reduced-motion preferences cancel reveal animations and parallax, including preference changes during a visit.

## Business truth and contact

This remains an independent unofficial concept, consistent with the collection. The main page has a visible disclosure and noindex metadata. The build adds a noindex response header for the route.

The user brief says Bristol. The following sources identify East Hartford, so the site says Connecticut and claims no verified service-area boundary or headquarters:

- https://www.angi.com/companylist/us/ct/east-hartford/weathershield-roofing-masonry-llc-reviews-1.htm
- https://www.buildzoom.com/contractor/weathershield-roofing-masonry-llc

Reviewed September 14, 2026. The map labels Bristol as the concept's town from the supplied brief, rather than a verified business address. Photo authorship and locations are not independently verified. No ratings, customer quotes, license or insurance badges, prices, warranties, or direct contact numbers have been invented. The call to action opens the verified Angi profile; inspection requests must be arranged through that external listing.

A future direct enquiry form requires the business's verified recipient, an approved delivery endpoint, accurate privacy copy, spam protection, and a real delivery check. The current page does not represent local draft preparation as a submitted lead.

## Validation performed and remaining

Performed in the orchestration runtime:
- Parsed the new JavaScript with V8.
- Inspected the repository build, HTML checks and versioned static asset flow.
- Reviewed new markup and local asset references.

Remaining:
1. Import all five original photos; read and reconcile the supplied motion kit without replacing the current work blindly.
2. Run `npm ci`, `npm run check`, and `npm run build`.
3. Use a browser at 390px, 768px and 1440px widths; verify 200% zoom, no horizontal overflow, loaded images, native image links without JavaScript, mobile menu, filtered lightbox, focus return, planner validation, copy fallback, download and reduced motion.
4. Confirm the photo rights and business details before any official use.
5. Observe GitHub CI and Cloudflare preview on the final commit. Merge only after the original images are available and the actual checks pass.

Do not claim browser QA, delivery, or production deployment based only on source inspection.
