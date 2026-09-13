# EMBER & IRON — Website Creative Directive v1

**Wood-Fired Pizza Co. — Lawrenceville, Pittsburgh, PA**
Tagline: **FIRE DOES THE TALKING.**
Style lane: bold industrial / brutalist-warm / scroll-driven boxes that breathe.

---

## 1. The Company

**Ember & Iron** is a wood-fired pizza shop opened in 2019 inside a decommissioned
tool-and-die works on Butler Street. The bones stayed: 20-foot ceilings, riveted
steel columns, the original crane rail overhead. In the middle of the room sits a
3-ton Neapolitan Acunto oven running at 900°F, visible from every seat.

Everything is built around one discipline: **72-hour cold-ferment dough, live fire,
90-second bakes.** No freezers, no heat lamps, no shortcuts. 60 seats, counter +
communal steel tables, walk-ins first.

Positioning: blue-collar precision. The room is heavy — steel, soot, brick — but
the hospitality is warm. Not a white-tablecloth "artisan" place and never says
the word artisan.

**One-line positioning:** *A foundry that happens to make the best pizza in the city.*

---

## 2. The Vibe

**Three words: HEAVY. HOT. HONEST.**

- **Heavy** — mass, steel, thick type, boxes with weight. Nothing floats, nothing is dainty.
- **Hot** — one accent only: ember orange. It appears like fire does — at the edges, in glows, in motion.
- **Honest** — no decoration without function. Mono labels read like stencil markings on crates. Prices in plain sight.

**Voice rules (all copy):**
- Short declaratives. Sentences under 8 words where possible. ("Dough rests three days. Fire finishes it.")
- Shop-floor nouns: heat, char, steel, batch, shift, the oven, the bench.
- No exclamation marks. No "delicious", no "mouth-watering", no emoji.
- Numbers are proud: 900°F, 72 HOURS, 90 SECONDS — set them big, in mono.

**Never:** pastel, script fonts, stock-photo smiles, chalkboard whimsy, "est. 2019" in a badge with laurels.

---

## 3. Location & Facts (site content)

| Field | Content |
|---|---|
| Address | 4411 Butler Street, Lawrenceville, Pittsburgh, PA 15201 |
| Room | Former McKenna Tool & Die Works (built 1927) |
| Hours | Tue–Thu 5–11 · Fri–Sat 12–12 · Sun 12–9 · Mon closed (oven rest) |
| Phone | (412) 555-0900 |
| Seating | 60 — counter, communal steel tables, walk-ins first |
| Reservations | Parties of 6+ only, by phone |
| Social | @emberandiron |

---

## 4. The Food (menu content)

**Style:** Neo-Neapolitan, wood-fired. Charred, blistered crust; center stays soft.
12" pies, one size, no substitutions printed — "the oven decides."

### PIES
| Name | Build | Price |
|---|---|---|
| **900 DEGREES** | San Marzano, fior di latte, basil, cold-pressed olive oil | 16 |
| **THE FURNACE** | Tomato, fior di latte, spicy soppressata, hot honey, basil | 19 |
| **PIG IRON** | Fennel sausage, provolone, pickled long hots, oregano | 19 |
| **SLAG HEAP** | Smoked mozzarella, roasted maitake, thyme, black garlic | 18 |
| **RIVET** | Marinara, garlic confit, oregano, chili crumb — no cheese | 15 |
| **COAL MINER** *(rotating)* | Whatever the season burns well. Ask the counter. | MKT |

### PLATES
Cast-iron meatballs, pecorino, Sunday sauce — 12 · Ember bread, whipped ricotta,
charred scallion — 9 · Charred broccolini, anchovy, lemon — 10 · Burrata,
blistered tomato, basil oil — 13

### DRINKS
Natural wines by the glass (rotating chalk), local lager on two taps, amaro list,
house birch soda, drip coffee.

---

## 5. Reviews / Social Proof

Aggregate strip: **4.9 — 1,240+ Google reviews · "Best Pizza in Pittsburgh" — City Paper, 2024 & 2025**

Placeholder pull-quotes (swap with real reviews at build time — marked `PLACEHOLDER`):

1. "The crust blisters like it means it. Best char east of Naples." — **Pittsburgh City Paper** `PLACEHOLDER`
2. "Loud, hot, perfect. The Furnace with hot honey is the order." — **Google review ★★★★★** `PLACEHOLDER`
3. "You watch a 900-degree oven do in 90 seconds what your oven never could." — **Yelp review ★★★★★** `PLACEHOLDER`

---

## 6. Visual System

### Palette (all tokens in `assets.css`)
| Token | Hex | Use |
|---|---|---|
| `--ink` | #0D0C0B | Page base — warm near-black |
| `--coal` | #161413 | Box surfaces |
| `--slate` | #1E1B19 | Raised steel panels |
| `--bone` | #F3EDE3 | Primary type / light surfaces |
| `--ash` | #8F8880 | Secondary type, hairlines |
| `--ember` | #F04E14 | THE accent — glows, hover, price |
| `--flame` | #FF7A29 | Gradient mid |
| `--amber` | #FFB25E | Gradient hot tip |
| `--deep` | #8F1D04 | Gradient root (deep heat) |
| `--steel` | #A7AEB6 | Mono labels on light |

### Gradients (pure CSS — no image assets needed)
- **`--grad-fire`** — deep red → ember → amber. CTA fills, active states, the "heat" gradient.
- **`.hero-fire`** — layered radial ember glow rising from the bottom of the charcoal hero, plus SVG-noise grain. Stands in for oven photography until generation unblocks.
- **`.surface-steel`** — brushed-steel repeating gradient for raised panels.
- **`.wash-ember`** — faint edge glow for cards (firelight at the seams).

### Typography
| Role | Font | Treatment |
|---|---|---|
| Display | **Anton** | Uppercase, tight (-0.01em), huge — 12–18vw hero, 6–8vw section |
| Body | **Archivo** | 400/500, 1.6 line-height, max 60ch |
| Labels / prices / data | **IBM Plex Mono** | Uppercase, +0.12em tracking, 12–13px — the "stencil" layer |

### Imagery direction (for later, when generation unblocks)
CSS carries the whole look today. When image generation is available, the brief is:
1. Macro of leopard-spotted crust char, single light, black background.
2. Wide of the oven mouth with flame lick, dark room, steel edge.
3. Overhead of a whole pie on brushed steel, one shadow.
4. Texture sheet: soot, brushed steel, torn flour-dusted linen.
All: dark, warm blacks, orange only from fire. No people, no props styling.

---

## 7. Motion System (all in `assets.css`)

Signature: **boxes that breathe** — sections scale in on entry and ease out on exit
(CSS scroll-timelines), and menu cells physically expand on hover.

| # | Name | Class | Trigger | Behavior |
|---|---|---|---|---|
| 1 | Hero shrink | `.hero-shrink` | page scroll | Hero box scales 1→.92 + gains 28px radius over first 60vh — "steps back" into the page |
| 2 | Section squeeze | `.sqx` | in-view | Every major box: scale .9→1 on entry 0–15%, holds, →.94 at exit. The breathing rhythm |
| 3 | Expanding cells | `.grow-row > .grow-cell` | hover | Flex-grow 1→2.4, siblings shrink; ember wash fades in. Menu + review columns |
| 4 | Ticker | `.ticker` | always | 22s linear marquee: 900°F ✦ 72 HOURS ✦ 90 SECONDS ✦ WALK-INS |
| 5 | Ember rise | `.embers i` | always | 6 CSS ember particles drift up the hero, staggered |
| 6 | Glow flicker | `.flicker` | always | Oven-light opacity flicker on glows (subtle, 3s) |
| 7 | Reveal up | `.reveal-up` | in-view | translateY(24px)+clip → clear, staggered via `--d` delay var |
| 8 | Link sweep | `.link-sweep` | hover | Ember underline sweeps left→right |
| 9 | Button fill | `.btn-fill` | hover | Ember fills from bottom, text goes ink |
| 10 | Stamp | `.stamp` | load | Logo stamp rotates -6°→0 with a heavy snap, once |

**Easings:** `--ease-out: cubic-bezier(.22,1,.36,1)` (everything), `--ease-snap: cubic-bezier(.7,0,.2,1)` (boxes).
**Fallbacks:** browsers without scroll-timeline get IntersectionObserver adding `.in` (snippet in wireframe.html);
`prefers-reduced-motion` kills all animation globally. No GSAP required — this layer is dependency-free.

---

## 8. Wireframe (section-by-section)

Full annotated skeleton: **`wireframe.html`** (open in a browser, scroll).

| § | Section | Height / behavior | Content |
|---|---|---|---|
| 00 | Header | 64px sticky, ink/blur | Stamp logo E&I · mono nav (MENU / STORY / FIND US) · BOOK CTA |
| 01 | Hero | 92vh box, **hero-shrink** | Mono kicker (LAWRENCEVILLE · EST. 2019) → 15vw ANTON "FIRE DOES THE TALKING." → one-line sub → CTAs (SEE THE MENU / BOOK A TABLE). `.hero-fire` + embers + grain |
| 02 | Ticker | 48px strip | Marquee of the numbers |
| 03 | Manifesto | `.sqx` box, bone on ink | 8vw statement: "DOUGH RESTS THREE DAYS. FIRE FINISHES IT." + 60ch paragraph |
| 04 | Menu | `.grow-row` ×5 cells | Pie name / build / price per cell; hover expands. Below: two-col plates+drinks in mono table |
| 05 | Process | sticky stack ×3 panels | 01 DOUGH — 72 hours · 02 FIRE — 900°F · 03 CHAR — 90 seconds. Panels stick at 12vh and scale down as the next covers them |
| 06 | Reviews | 3 `.grow-cell` cards + aggregate badge | Pull-quotes from §5 |
| 07 | Location | split box | Left: mono fact table (address/hours/phone). Right: dark map placeholder block (swap for Mapbox later) |
| 08 | Final CTA | 70vh, fire gradient | "WALK IN HUNGRY." + giant `.btn-fill` button |
| 09 | Footer | ink | Stamp, mono address, socials, hours |

**Mobile (<760px):** grow-rows stack vertically (expansion becomes tap), display type
clamps via `clamp()`, sticky stack stays (it works well small), ticker slows to 30s.

---

## 9. Handoff Package

| File | What it is |
|---|---|
| `DIRECTIVE.md` | This document — brand, content, motion, wireframe spec |
| `assets.css` | Complete token + gradient + animation layer. Drop into any stack; class-driven, no JS dependency |
| `wireframe.html` | Self-contained scrollable wireframe using assets.css + Google Fonts. Includes the IntersectionObserver fallback snippet |

**Run it:** put `assets.css` next to `wireframe.html`, open the html. No build, no server.

**Next steps when you're ready:**
1. Confirm/adjust brand facts (name, city, menu prices are all placeholders I invented).
2. When generation unblocks: produce the 4 image briefs in §6, swap the CSS stand-ins.
3. Build the real site on this directive — sections map 1:1 to the wireframe.
