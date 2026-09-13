# Empanada's — The place TOGO

Route: `/empanadas-togo/`. Independent concept for the West Main Street location in Meriden. Golden Counter palette from the user-supplied HTML files, preserved in `reference/empanadas-togo/`.

## What ships

- Editable HTML/CSS wordmark, with the supplied business name and tagline. It remains a provisional text treatment, not a recreation of the official logo.
- Self-hosted Barlow Condensed Black headings; cream, charcoal, gold and orange surfaces.
- A framed food hero that contracts as it leaves the viewport; oversized outline type moves with native scrolling.
- Three native, keyboard-accessible menu disclosures. Each can expand independently so visitors can compare categories. Progressive CSS animates their height where supported. Closed frames widen as they enter view; gradients move gently across each frame. Reduced-motion users receive a stable layout.
- Quantity controls, a persistent item-only bag, a native dialog, optional name and visit notes, a generated pickup list, clipboard copying with a manual fallback, and text-file download. Changes invalidate the previous draft.
- Local storage is validated by a fixed item allowlist and integer bounds (20 per item; 60 total). Storage failure keeps the bag usable in memory. Names and notes are never persisted or transmitted.
- Sources page, concept disclosure, noindex metadata and Cloudflare route headers.

## Responsive layout

| Area | Desktop | Mobile |
| --- | --- | --- |
| Header | Wordmark, menu, location, bag count | Wordmark, menu, compact bag count |
| Hero | Two columns: large headline/action and food image | Stacked copy and fixed-height image |
| Menu | Wide expanding frames; copy and add controls share a row | Compact disclosure headings; comfortable tap targets |
| Bag | Centered native dialog; floating review action after adding an item | Bottom bag action; dialog fits the available viewport |
| Visit | Headline and address card side by side | Stacked address card with a full-width directions action |

This implemented page is the desktop/mobile wireframe and component reference. No separate mockup is required to inspect spacing, open states or form behavior.

## Factual basis

The supplied brief identifies the name and 511 W Main Street. [CT Insider, July 28, 2026](https://www.ctinsider.com/food/article/empanadas-togo-meriden-location-22363389.php), checked September 13, supports the menu categories and named fillings, and reports two Meriden locations. The page deliberately scopes itself to West Main Street and asks customers to confirm availability there. No ratings, testimonials, prices, phone numbers, live hours, stock, wait times or payment claims are invented.

The image is AI-generated illustrative food photography. It is locally served in two WebP sizes and disclosed beside the image and on the sources page. The full prompt and the original supplied design references are retained in `reference/empanadas-togo/`.

## Connecting real ordering

The current action is **Create pickup list**, not checkout. Activate order submission only after a merchant-approved menu and prices, stock and hours, tax rules, pickup capacity, and an authenticated order destination are supplied. A backend must validate item IDs and prices, deduplicate submissions, return a confirmed order ID, and expose actual receipt/failure states. Use the merchant's hosted payment provider; never collect payment card details in this static page. Until those pieces exist, keep the local-draft wording and noindex boundaries.

## Implementation handoff

Extend `empanadas-togo/` in place. Preserve the supplied name/tagline and Golden Counter tokens. Keep native document scrolling, native menu disclosures, keyboard focus, reduced-motion behavior and stable image dimensions. Treat the current menu as a sourced preview; replace it with the owner's approved item data before activating checkout. Keep the order draft local until a real merchant endpoint exists. Validate the collection with `npm run check` and `npm run build`, inspect narrow mobile and desktop layouts, and verify add/decrease/remove, persistence, note edits, copying, dialog Escape and the no-JavaScript menu. Add future business-approved assets without removing the concept disclosure until the project's status changes. Publish through the existing GitHub/Cloudflare flow and inspect its actual deployment result.

## Image-generation record

Built-in image-generation tool; source asset generated for this task and exported as `empanadas-togo/assets/empanadas-hero.webp` (1536 × 1024) and `empanadas-hero-small.webp` (768 × 512). Prompt recorded in `reference/empanadas-togo/image-prompt.txt`. No official product or storefront photography is implied.

## Verification

The collection source checks and production build passed locally and in GitHub CI. The hosted desktop preview was visually inspected. Browser checks exercised savory and sweet selections, increasing quantity, removing an item, generating and copying the pickup list, invalidating the draft after note edits, Escape dismissal, and persistence across reloads. No application-origin console warnings or errors were observed; the browser extension reported metadata errors. Mobile breakpoints and reduced-motion handling are implemented; the available browser does not expose a supported viewport-emulation control, so a mobile browser run is not claimed.
