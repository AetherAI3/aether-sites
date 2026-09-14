# Weathershield website

Standalone source: `weathershield/`. Intended route after merge and a successful deployment: `/weathershield/`.

## Implementation and photographs

The standalone site, collection card, town-level map entry, build registration, and source checks are implemented. All five original photographs were imported byte-for-byte from the reuploaded attachments on September 14, 2026. Their PNG dimensions and SHA-256 digests are recorded in `weathershield/assets/required-images.json`.

- `05af93b1-9641-44f3-8d91-734e5df3c4f7.png`: Blue-gray house; hero and gallery.
- `d1eab729-94df-4d9f-a409-4d956f03b8e2.png`: Green building; expertise section and gallery.
- `6ca1ab7b-6382-4a35-95fd-e62e9af05a7b.png`: Shingle close-up; gallery and contact texture.
- `da45e7e4-d61d-43e1-a603-63ab8262268b.png`: Unfinished roof; work-in-progress gallery.
- `74f5fbd0-4387-480a-babb-3af4a451673c.png`: Chimney and flashing; gallery.

The build preflight requires all five original PNG files; the HTML checks validate local references. No generated or stock substitutes are used. Image dimensions in markup match the files. The roof image with exposed wood is explicitly labeled as work in progress.

The interface and motion were authored directly from the visible brief. The earlier supplemental motion-kit attachments were unavailable and are not represented as imported source.

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

## Validation

`npm ci`, `npm run check`, and `npm run build` pass with the original photographs present. This covers JavaScript syntax, existing contact and planner tests, TypeScript, local references, fragment links, unique IDs, image labels, concept noindex, and versioned production assets.

Browser review on the Cloudflare preview confirmed the original images load, the desktop composition, 390px phone and 768px tablet layouts, and no horizontal overflow at those review widths. The mobile menu opens and closes on navigation. Gallery filters show the expected 5/4/2 photographs; the filtered lightbox navigates its visible subset, closes with Escape, and restores focus. Project notes validate required fields, prepare the visitor’s text, copy successfully, and preserve text when edited. The download control issued its request, but the managed browser did not expose a download event; receipt of the downloaded file was not independently verified.

The browser review found and fixed the desktop menu-toggle visibility. The temporary responsive review page is removed from the final source. Reduced-motion and no-JavaScript behavior of this standalone site were reviewed in source; the collection’s existing CI separately exercises those modes for the homepage.

GitHub validation run 34851587349 passed source checks, the production build, all nine collection cards at 1440/768/390/320px, reduced motion, no-JavaScript fallback, and the deployed contact route without sending an inquiry. Cloudflare successfully deployed the original-photo commit. Inspect PR #4 for the final-commit checks and merge status.

## Collection integration update

Merged the concurrent main update into this branch without discarding its Blackstar-style carousel, AE identity, contact endpoint, or CI browser checks. Weathershield is the ninth carousel card and a selectable Aether website style. The existing contact endpoint's style map accepts that choice; no enquiry has been sent. The existing browser checks now expect nine cards and include the new card and its original photograph.
