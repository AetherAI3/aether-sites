# MACH//DETAIL — Front-End Handoff Kit

Code-only asset package for the Mach Detail web presence. No build step, no
dependencies — open `index.html` and it runs. Everything is handoff-ready.

## File map

```
mach-detail-kit/
├── index.html          # Full wireframe: hero, ticker, tiers, gallery, shop, booking, footer
├── styles/
│   ├── tokens.css      # Design tokens + the 10-recipe gradient library
│   └── main.css        # HUD system, glassmorphism, layout, components
└── js/
    ├── scroll.js       # All scroll-driven interactions (8 modules)
    └── booking.js      # Booking engine wireframe + live OPEN/CLOSED status
```

## The gradient library (tokens.css)

| Class          | Use                                                        |
|----------------|------------------------------------------------------------|
| `.g-horizon`   | Hero backdrop — cyan glow rising from the floor            |
| `.g-sheen`     | Diagonal light sweep on glass cards / pricing tiers        |
| `.g-cta`       | Cyan gradient fill for booking + contact buttons           |
| `.g-edge-fade` | Dark overlay on photos so HUD text stays legible           |
| `.g-ring`      | Conic rating dial (driven by `--val`, 0–100)               |
| `.g-scanlines` | Faint CRT scanline texture (fixed global overlay)          |
| `.g-grid`      | Blueprint grid section background                          |
| `.g-tier-glow` | Cyan halo behind the featured Ceramic tier                 |
| `.g-fade-x`    | Horizontal edge mask for the services ticker               |
| `.g-terminal`  | Phosphor wash inside the booking terminal window           |

Palette: matte black `#050607` stack, signal cyan `#22d3ee`, amber reserved
for closed-state only. Type: Space Grotesk (display) + JetBrains Mono (HUD).

## Scroll-driven interactions (scroll.js)

1. **Progress rail** — top cyan bar; uses native `animation-timeline: scroll()`
   where supported, rAF fallback elsewhere.
2. **Staggered reveals** — `.reveal` + `--i` delay, IntersectionObserver.
3. **Hero parallax** — media drifts at 0.32× scroll speed.
4. **Shop image parallax** — bidirectional, viewport-relative.
5. **Scroll-spy nav** — active section gets the `//` prefix.
6. **Glass card tilt** — pointer-driven 3D, capped at ±4°, pointer:fine only.
7. **Animated counters** — `data-count` attributes (5.0 dial, stats).
8. **Terminal boot** — ledger lines cascade in on first view.

`prefers-reduced-motion` disables all of it.

## Booking engine (booking.js)

- Hours config matches the shop exactly: Mon–Fri 8–5, Sat 9–2, **Sun locked out**.
- Next-7-days chip row, hourly slot grid, service select, live summary ledger.
- Confirm writes to the terminal feed and flags the SMS confirmation.
- **Integration point** is marked: swap `pushLine` for a POST to the Nano
  endpoint that writes the appointment ledger on Aether Cloud and triggers
  confirmation + 24h reminder texts.
- The nav pill computes OPEN/CLOSED live from the same hours config.

## Imagery

The two shop photos are wired in via their hosted URLs: the red hatch anchors
the hero + gallery slot 01, the bay shot backs the Shop section. Gallery slots
02–04 are dashed HUD drop zones labeled with the intended shots (McLaren 720s,
Porsche, Mustang) — swap in finals by replacing the `.g-item--empty` blocks
with `.g-item` figures.

## To ship

Static hosting anywhere (Netlify/Cloudflare Pages) as-is, or lift the tokens,
components, and JS modules into the production framework when the Nano +
Aether Cloud booking backend lands.
