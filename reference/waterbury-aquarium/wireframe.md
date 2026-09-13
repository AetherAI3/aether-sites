# Waterbury Aquarium — Website Wireframe + UI Handoff

**Client:** Waterbury Aquarium — 406 Watertown Ave, Waterbury, CT
**Type:** Single-page scroll experience (Phase 1), expandable to multi-page (Phase 2)
**Companion files:** `waterbury-aquarium.css` (tokens, gradients, glass, animations) · `motion.js` (scroll scrub, reveals, bubble spawner, pager sync)

---

## 0. Project snapshot

| | |
|---|---|
| Business | Family-run aquarium shop, nearly 30 years in business |
| Reputation | Healthier livestock and better prices than big-box pet stores; loyal local hobbyist base |
| Physical vibe | No-frills, famously cramped — tanks packed wall-to-wall in a small footprint |
| Digital gap | Exists only on Google Maps / auto-generated directories |
| Operational pain | Staff too busy for 1:1 beginner help; constant phone calls asking "what fish came in this week" |

**The website must do three jobs:**
1. Look like the warm, loved local institution it is (not a sterile corporate template).
2. Answer the two phone-call questions on the page itself: **live arrivals ticker** + **care guides**.
3. Convert visitors into store visits: **Book / Call / Directions** buttons always one tap away.

---

## 1. Creative concept — "The Descent"

The whole page is **one continuous dive**. Scroll = depth. The visitor starts at the sunlit surface and ends on the reef floor (the footer).

- The **page background is a single vertical depth gradient** (sky → aqua → teal → ocean → abyss) defined once as `--depth-gradient`. Sections are transparent; depth does the storytelling.
- The hero's **glass tank column** is the anchor. Bubbles from it "escape" and trail down the left edge of every later section — a living scroll-progress indicator.
- Signature moment: **the Porthole** — a tank window that expands to full-screen as you scroll through it, then shrinks back into a card that docks into the location section.
- Tone: warm mom-and-pop, premium but cozy. Copy speaks like the owner, not a brand deck.
- Motion personality: **buoyant** — everything rises, drifts, sways. Nothing snaps. Easing curves are in the CSS (`--ease-buoy`, `--ease-drift`).

---

## 2. Design tokens (summary — full values in `waterbury-aquarium.css`)

| Token group | Values | Use |
|---|---|---|
| Depth palette | `--sky-050` → `--abyss-950` (11 steps) | Page gradient, section tints |
| Warm accents | `--coral-300…600`, `--sand-200/300` | Primary CTA, highlights, price chips — the "mom-and-pop warmth" |
| Kelp green | `--kelp-400/600` | Plant/aquascaping tags, success states |
| Glass | `--glass-gradient`, `--glass-edge` | The hero column, nav, ghost buttons |
| Radius | `--r-card: 28px`, `--r-pill: 999px` | Cards, buttons |
| Easing | `--ease-buoy`, `--ease-drift` | All motion |

**Typography**
- Display / headlines: **Fraunces** (Google Fonts, optical sizing, soft warm serif — reads "family shop", not "tech startup")
- Body / UI: **Public Sans** or Inter
- Accent (stickers, hand-notes like "just in!"): **Caveat** — used sparingly, max 1–2 per viewport

**Depth text colors:** sections above the "waterline" use `--ink-900` on light; everything below mid-water uses `--paper` / `--fg-dim`. Utility classes `.depth--surface`, `.depth--mid`, `.depth--floor` set this automatically.

---

## 3. Global chrome

**Sticky nav** (glassy, appears after 40px scroll)
- Left: wordmark "Waterbury Aquarium" + small fish mark (placeholder SVG in §9)
- Center links: Livestock · Arrivals · Care Guides · Visit
- Right: **[Book a Visit]** (coral pill) + phone icon button

**Mobile:** nav collapses to logo + hamburger; a **fixed bottom thumb-bar** carries the three money buttons: Book · Call · Directions.

**Depth gauge** (desktop, fixed left rail): 7 small bubbles, one per section. Active section's bubble is filled and gently bobs; click = smooth-scroll. This is the "bubbles leading down" device made functional.

---

## 4. Section-by-section wireframe

### SECTION 1 — HERO · "The Surface" (100dvh)

```
┌────────────────────────────────────────────────────────────────────┐
│ ◉ Waterbury Aquarium     Livestock  Arrivals  Guides  Visit [Book] │
│────────────────────────────────────────────────────────────────────│
│                                                                    │
│  WATERBURY, CT · FAMILY-RUN SINCE THE MID-90s      ┌─────────────┐ │
│                                                    │ ░ GLASS   ░ │ │
│  Healthy fish.                                     │ ░ COLUMN  ░ │ │
│  Honest prices.                                    │ ░░░░░░░░░░░ │ │
│  Waterbury raised.                                 │  o     o    │ │
│                                                    │ o   o       │ │
│  A family-run shop packing more                    │    o  ~~fish│ │
│  life into one little storefront                   │  o     ~~   │ │
│  than anywhere on Watertown Ave.                   │  ~plants~   │ │
│                                                    │ ▓▓substrate▓│ │
│  [ Book a visit ]   [ This week's arrivals ↓ ]     └─────────────┘ │
│                                                                    │
│ ○  bubbles start here                    (shark drifts past →)     │
└────────────────────────────────────────────────────────────────────┘
```

**Glass column spec (the hero piece):**
- Right side, `30–34vw` wide, full height below nav, `border-radius: 32px`
- Glassmorphism: `backdrop-filter: blur(10px) saturate(1.15)`, layered `--glass-gradient`, 1px bright edge, inner glare streak (`::before`), dark substrate shade at bottom (`::after`)
- Contents (all CSS/SVG, no video needed): **bubbles rising** (`.bubble`, spawned by `motion.js` with random size/speed/lane), 2–3 small fish silhouettes drifting on long loops, a plant silhouette or two
- **Shark:** a low-opacity (14%) silhouette crosses *behind* the column every ~45s (`shark-drift` keyframes), slight vertical sway, subtle mouse parallax. It should feel like a rumor, not a jumpscare.

**Background:** surface gradient + `.light-rays` (soft conic rays from upper-left, slow sway) + `.caustics` shimmer layer.

**Copy:** see §8 copy deck. Primary CTA coral; secondary is a ghost button that smooth-scrolls to the ticker.

---

### SECTION 2 — BUBBLE TRAIL TRANSITION (60vh, intentionally sparse)

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│   o                                                                │
│      o          "Follow the bubbles down —"                        │
│         o                                                          │
│            o         (small Caveat hand-note, rotated -3deg)       │
│                                                                    │
│                 o                                                  │
└────────────────────────────────────────────────────────────────────┘
```

A quiet beat between hero and porthole. A diagonal trail of CSS bubbles descends across the section. Depth gauge bubble #2 lights up. Nothing else here — restraint is the point.

---

### SECTION 3 — THE PORTHOLE · signature moment (220vh sticky stage)

```
SCROLL PROGRESS 0%                     50%                        100%
┌────────────────────┐   ┌──────────────────────────┐   ┌────────────────────┐
│                    │   │██████████████████████████│   │                    │
│     ╭────────╮     │   │██████████████████████████│   │   ╭────────────╮   │
│     │  tank  │     │ → │████ TANK-WALL VIDEO █████│ → │   │ docks into │   │
│     │  40vw  │     │   │████  full-bleed   ███████│   │   │ §4 as card │   │
│     ╰────────╯     │   │██████████████████████████│   │   ╰────────────╯   │
│                    │   └──────────────────────────┘   └────────────────────┘
```

- Sticky viewport inside a 220vh stage. A rounded-rect "window into the shop" (photo or ≤8s muted loop of the tank wall) starts at 40vw/32px radius, **expands to full-bleed** mid-scroll (holds ~15% of the scrub), then **shrinks** and docks as the intro card of §4.
- Caption fades in only at full expansion: *"Cramped? We prefer full of life."*
- Implementation: CSS scroll-driven animation (`porthole-in-out` keyframes + `view-timeline`) with the `motion.js` rAF fallback for older browsers. Both shipped in companion files.
- **Asset needed (user):** horizontal pan photo or short loop video of the tank wall. Landscape, ≥1920w.

---

### SECTION 4 — LOCATION · "Mid Water" (auto height)

```
┌────────────────────────────────────────────────────────────────────┐
│  FIND US ON WATERTOWN AVE                                          │
│                                                                    │
│  406 Watertown Ave, Waterbury, CT        ┌──────────────────────┐  │
│  ───────────────────────────────         │                      │  │
│  Nearly 30 years in the Brass City.      │    [ GOOGLE MAPS     │  │
│  The shop is no-frills on purpose —      │      EMBED CARD ]    │  │
│  every square foot is tanks, floor       │                      │  │
│  to ceiling. Locals will tell you:       │    Hours grid        │  │
│  healthier fish and fairer prices        │    Parking note      │  │
│  than any big-box store.                 │    [ Get directions ]│  │
│                                          └──────────────────────┘  │
│  ┌─ porthole card docks here ─┐                                    │
│  └────────────────────────────┘                                    │
│                                                                    │
│  "────────── rotating review quote ──────────"  ★★★★★              │
└────────────────────────────────────────────────────────────────────┘
```

- Two columns: story left, map card right (Google Maps iframe in a glass card; hours + parking + directions button below it).
- The shrunken porthole card docks top-left of this section — the scroll sequence visually "delivers" you into the shop.
- **Review strip:** single rotating quote (placeholder quotes; user pulls real ones from Google Reviews). Caveat font for the quote, star row in coral.
- Bubbles denser here; background now in `--ocean-600…700` territory, text flips to light (`depth--mid`).

---

### SECTION 5 — FAMILY ACTIVITIES · "The Reef" (slide cards)

```
┌────────────────────────────────────────────────────────────────────┐
│  BRING THE KIDS. SERIOUSLY.                  (‹ drag / arrows ›)   │
│                                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│  │  PHOTO  │  │  PHOTO  │  │  PHOTO  │  │  PHOTO  │  → snap-x     │
│  │ 16:10   │  │ 16:10   │  │ 16:10   │  │ 16:10   │               │
│  ├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤               │
│  │ SAT chip│  │ FREE chip  │  chip   │  │  chip   │               │
│  │ Weekend │  │ Kid's   │  │ Birthday│  │ First   │               │
│  │ Feeding │  │ Scavenger│ │ Behind- │  │ Tank    │               │
│  │ 1 line… │  │ Hunt    │  │ Scenes  │  │ Workshop│               │
│  │ Book →  │  │ Book →  │  │ Book →  │  │ Book →  │               │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘               │
│                                                                    │
│            ○     ●     ○     ○     ○      ← bubble pagination      │
└────────────────────────────────────────────────────────────────────┘
```

- Horizontal snap carousel: `scroll-snap-type: x mandatory`, cards `min(78vw, 340px)`, drag + arrow buttons + keyboard (←/→).
- Card anatomy: photo (16:10, `TODO: user photo`), day/price chip, title, one-line description, "Book this →" deep-link (opens booking with that activity preselected).
- **Pagination = bubbles:** dots styled as bubbles; active one filled + bobbing. `motion.js` keeps pager in sync with scroll position.
- Starter card set (edit freely): Weekend Feeding Frenzy · Kid's Tank Scavenger Hunt · Birthday Behind-the-Scenes · First-Tank Family Workshop · Aquascaping Corner. **5–6 photos needed from user.**

---

### SECTION 6 — LIVE ARRIVALS + CARE GUIDES (the operational fix)

```
┌────────────────────────────────────────────────────────────────────┐
│  FRESH OFF THE TRUCK                                updated weekly │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ✦ JUST IN — Neon Tetras · Clownfish · Angelfish · Bettas ·   │  │
│  │   Anubias Nana · Otocinclus · … (loops, pauses on hover)     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  NEW TO THE HOBBY? START HERE.                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                       │
│  │ EASY chip │  │ EASY chip │  │ INTRO chip│                       │
│  │ Your First│  │ Betta     │  │ Saltwater │                       │
│  │ 10-Gallon │  │ Basics    │  │ 101       │                       │
│  │ 5 min read│  │ 4 min read│  │ 8 min read│                       │
│  └───────────┘  └───────────┘  └───────────┘                       │
└────────────────────────────────────────────────────────────────────┘
```

- **Ticker:** marquee strip (`.ticker`), duplicated content for seamless loop, `mask-image` fade at edges, pauses on hover. Species above are placeholders.
- **Dev note — zero-code CMS:** ticker and guides should read from a Google Sheet / Airtable the staff can edit from a phone. This is the feature that kills the daily "what came in?" phone calls — flag it to the client as such.
- Guide cards: difficulty chip, read-time, arrow. Phase 1 can link to simple anchored pages or even well-formatted Google Docs — don't over-build.

---

### SECTION 7 — FOOTER · "The Reef Floor" (CTA)

```
┌────────────────────────────────────────────────────────────────────┐
│  (deepest navy — --abyss-950, tiny fish silhouettes at base)       │
│                                                                    │
│                     COME SAY HI.                                   │
│              The tank's always warm.                               │
│                                                                    │
│      [  Book a visit  ]   [ Call the shop ]  [ Get directions ]    │
│          coral pill          ghost             ghost               │
│                                                                    │
│   Hours grid        406 Watertown Ave,        FB · IG              │
│   (TODO)            Waterbury, CT             (TODO links)         │
│                                                                    │
│   o  o   o  bubbles rise off the top edge → "back to surface ↑"    │
│   © Waterbury Aquarium · site credit                               │
└────────────────────────────────────────────────────────────────────┘
```

- Three big thumb-friendly buttons. Book = primary coral; Call (`tel:`) and Directions (Google Maps URL) = glass ghost buttons.
- Bubbles animate upward off the footer's top edge — the dive "loops" — plus a "back to surface ↑" text link that smooth-scrolls to top.
- Fine print minimal. No newsletter box (they won't maintain it).

---

## 5. Component specs

| Component | Spec |
|---|---|
| `.btn-primary` | Pill, coral gradient, white label, glow shadow; hover: lift 2px + saturate; active: scale .98 |
| `.btn-ghost` | Pill, glass (blur 8px, 1px edge), inherits section text color |
| `.glass-column` | See §4-S1; `overflow:hidden`; all inner motion is CSS/SVG |
| `.slide-card` | 28px radius, paper background, photo top, content pad 20px, hover: lift + deepen shadow |
| Chip | Pill, 12px uppercase, `kelp` = free/plants, `sand` = schedule, `coral` = booking |
| `.ticker` | 28s loop, edge mask fade, pause on hover |
| Depth gauge | Fixed left, 7 bubbles, click-to-scroll, active = filled + bob |
| Review quote | Caveat 28–32px, coral stars, rotates every 6s (fade) |
| Booking modal | Phase 1: name / phone / date / party size / interest dropdown (activities preselectable). Backend = form → email, or Calendly embed. Keep it dumb. |

**Accessibility (non-negotiable):** visible `:focus-visible` rings (shipped), carousel keyboard support, all scroll animations have `prefers-reduced-motion` fallbacks (shipped — motion removed, content static), glass panels sit on solid-enough backdrops to keep 4.5:1 contrast, shark never carries information.

---

## 6. Animation spec

| Name | Where | Trigger | Duration | Easing | Keyframes / file ref |
|---|---|---|---|---|---|
| Bubble rise | Glass column, trail, footer | Loop | 7–14s staggered | linear | `bubble-rise` |
| Shark drift | Hero background | Loop, 45s | 45s | linear | `shark-drift` |
| Light ray sway | Hero | Loop alt | 14s | ease-in-out | `ray-sway` |
| Caustic shimmer | Hero, mid-water | Loop alt | 18s | linear | `caustic-drift` |
| Porthole open/shrink | §3 | Scroll scrub | 220vh | linear (scrubbed) | `porthole-in-out` |
| Card lift | Cards, buttons | Hover | .35s | `--ease-buoy` | transition |
| Section reveal | All content blocks | IntersectionObserver | .8s | `--ease-drift` | `.reveal`/`.is-in` |
| Ticker | §6 | Loop | 28s | linear | `marquee` |
| Pager bob | §5 active dot | Loop | 2.4s | ease-in-out | `bob` |
| Quote rotate | §4 | Timer 6s | .5s fade | ease | `motion.js` |

---

## 7. Asset checklist (user to upload)

| # | Asset | Where | Spec |
|---|---|---|---|
| 1 | Tank-wall pan (photo or ≤8s muted loop) | §3 Porthole | Landscape, ≥1920w, video ≤2.5MB |
| 2 | 5–6 family activity photos | §5 cards | 16:10 crop-able, real store/kids moments |
| 3 | Storefront exterior | §4 (optional, beside map) | Daylight, ≥1600w |
| 4 | 3–4 livestock close-ups | Ticker avatars / hero column alt | Square-ish |
| 5 | Real Google review quotes (3–5) | §4 strip | Plain text |
| 6 | Logo if one exists | Nav/footer | Else wordmark type only |
| 7 | Hours + phone + social links | §4/§7 | Plain text — currently TODO |

---

## 8. Copy deck (starter — owner should edit in their voice)

- **Hero eyebrow:** WATERBURY, CT · FAMILY-RUN SINCE THE MID-90s
- **Hero H1:** Healthy fish. Honest prices. Waterbury raised.
- **Hero sub:** A family-run shop packing more life into one little storefront than anywhere on Watertown Ave.
- **Porthole caption:** Cramped? We prefer full of life.
- **Location H2:** Find us on Watertown Ave.
- **Location body:** Nearly 30 years in the Brass City. The shop is no-frills on purpose — every square foot is tanks, floor to ceiling. Locals will tell you: healthier fish and fairer prices than any big-box store.
- **Family H2:** Bring the kids. Seriously.
- **Arrivals H2:** Fresh off the truck.
- **Guides H2:** New to the hobby? Start here.
- **Footer H2:** Come say hi. / **Footer sub:** The tank's always warm.

---

## 9. Starter assets in code

**Fish / shark silhouettes:** simple side-profile SVG paths are provided in `waterbury-aquarium.css` comments and usable as masks or inline SVG. They're deliberately stylized — replace with traced silhouettes from real photos later if desired.

**Phase 2 routes (don't build yet, keep URLs in mind):** `/arrivals` (full ticker archive), `/guides/*`, `/livestock` (category index: freshwater, saltwater, plants, hardscape, equipment).

**Performance budget:** hero stays CSS/SVG-only (no video) so LCP is the headline font + column paint; the only heavy media is the porthole loop, lazy-loaded. Target: <200KB CSS+JS, fonts subset, Lighthouse 90+.
