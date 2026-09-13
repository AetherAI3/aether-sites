# Gary's Hilltop - visual upgrade layer

Three files, no dependencies, no build step. Works on any static host.

## Files

| File | What it does |
|---|---|
| `garys-hilltop.css` | The full visual layer: gradients, cards, buttons, header, animations |
| `garys-hilltop.js` | Progressive enhancements: scroll reveals, pointer spotlight, header state, count-up |
| `index-reference.html` | Your page rebuilt with every class wired in - copy from it or diff against it |

## Integrate into the existing page (3 steps)

1. **Link the CSS** in `<head>` after your existing stylesheet:
   ```html
   <link rel="stylesheet" href="garys-hilltop.css" />
   ```
2. **Add the JS** before `</body>`:
   ```html
   <script defer src="garys-hilltop.js"></script>
   ```
3. **Apply the classes** from `index-reference.html` to your existing markup.
   The class map below shows what goes where.

## Class map

| Element on your page | Classes to add |
|---|---|
| Sticky header | `gh-header` (+ `gh-header__row`, `gh-wordmark`, `gh-nav` inside) |
| Primary button (phone CTA) | `gh-btn gh-btn--primary` (add `gh-btn--sm` in the nav) |
| Secondary button | `gh-btn gh-btn--ghost` |
| Inline links ("Get directions") | `gh-link` |
| Hero wrapper | `gh-hero` + `gh-hero__panel` + `gh-hero__grid` |
| Gradient headline word | `gh-text-grad` on a `<span>` |
| Any card (services, reviews, visit) | `gh-card gh-card--pad` (`gh-card--visit`, `gh-card--review` variants) |
| Card icon | `gh-icon` around the SVG |
| "Check-engine" panel | `gh-panel` + `gh-panel__grid` |
| Shop photo frame | `gh-media` + `gh-media__clip` around the `<img>` |
| Bottom CTA band | `gh-cta` + `gh-cta__row` |
| "Prepare a note" | `gh-disclosure` on `<details>`, `gh-input` on fields |
| Anything that should animate in on scroll | `gh-reveal` (+ `style="--i:N"` for stagger, 0-5) |
| Section headings | `gh-h2` + optional `<span class="gh-h-rule">` underline |
| "5.0" rating | `<b class="gh-count" data-to="5.0">5.0</b>` |

## What you get

- **Gradients**: brand-mint gradient text, gradient card borders, gradient
  buttons with a sheen sweep, aurora washes behind the hero and CTA, a fixed
  page atmosphere with grain.
- **Scroll-driven**: a gradient progress hairline at the top, the hero gently
  lifting out as you scroll past (both pure CSS `animation-timeline`, Chromium
  + Safari; other browsers simply skip them), and staggered section reveals
  everywhere via IntersectionObserver.
- **Cards**: glass fill, 1px gradient edge, hover lift, and a pointer-tracked
  spotlight that follows the cursor across each card.
- **Animated details**: header condenses to frosted glass on scroll, icons
  tilt on card hover, the 5.0 rating counts up when it enters view, nav links
  grow a gradient underline.

## Notes

- **No scroll listeners** anywhere; all scroll work uses CSS scroll timelines
  or IntersectionObserver, so mobile scroll stays smooth.
- **Reduced motion**: everything animated collapses to static under
  `prefers-reduced-motion`, and reveals are skipped entirely.
- **No-JS safe**: without the script the page renders fully visible; JS only
  adds motion. Hidden-until-revealed content can never strand a visitor.
- **Font**: uncomment the Archivo `@import` at the top of the CSS for the
  display font, or delete that line to keep your current font.
- **Photo**: replace `shop-exterior.jpg` in the reference HTML with the path
  to the shop photo already on your server.
