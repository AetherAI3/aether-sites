# GARY'S HILLTOP AUTO REPAIR — Website Wireframe Directive
**Client:** Gary's Hilltop Auto Repair — 1294 E Main St, Torrington, CT 06790
**Reputation anchor:** 4.7★ across 120+ reviews
**Direction:** Bold industrial mechanic × precision HUD. Scroll-driven cinematic.
**Rule zero:** Photoreal assets carry NO text. All type is CSS/HTML. No AI-looking gloss, no clip-art cars, no stock-photo smiles.

---

## 1. CREATIVE CONCEPT — "THE PRECISION GARAGE"

Frame a blue-collar shop through a high-tech lens. The garage is honest and utilitarian; the website treats that work like engineering telemetry. Think: matte-black service bay meets diagnostic terminal. Rough textures (diamond plate, brushed steel, oil sheen) underneath a clean data layer (mono type, thin rules, cyan readouts).

One-sentence vibe: *"A shop you trust, presented like a machine you respect."*

---

## 2. COLOR SYSTEM

| Token | Hex | Use |
|---|---|---|
| `--black` | `#0A0B0D` | Page background |
| `--gunmetal` | `#14171B` | Section backgrounds, cards base |
| `--steel` | `#1E2329` | Raised surfaces, card borders at 40% |
| `--smoke` | `#8A9199` | Muted text, labels |
| `--white` | `#E8EAED` | Headlines, primary text |
| `--cyan` | `#22D3EE` | Primary accent: links, readouts, active states, glows |
| `--amber` | `#F59E0B` | Sparingly: hazard details, ratings stars, warning ticks |
| `--red` | `#EF4444` | Form errors only |

**Gradients (clean, CSS-only):**
```css
/* Page base — subtle shop glow from top */
background: radial-gradient(1200px 600px at 50% -10%, #1B2129 0%, #0A0B0D 60%);

/* Card steel sheen */
background: linear-gradient(180deg, #1E2329 0%, #14171B 100%);

/* Hero vignette over photo */
background: linear-gradient(180deg, rgba(10,11,13,0.25) 0%, rgba(10,11,13,0.92) 100%);

/* Cyan glow line (dividers, underlines) */
background: linear-gradient(90deg, transparent, #22D3EE, transparent);

/* Heat accent for CTA hover (rare use) */
background: linear-gradient(90deg, #22D3EE, #0EA5B7);
```
Rule: gradients stay dark and quiet. Cyan appears as light — never as a fill over big areas.

---

## 3. TYPOGRAPHY (all Google Fonts, free)

| Role | Font | Weight / Style | Use |
|---|---|---|---|
| Display | **Anton** | 400, uppercase, +0.02em | H1/H2, huge section titles |
| Sub-head | **Oswald** | 500–600, uppercase, +0.08em | H3, eyebrow labels, nav |
| HUD / data | **JetBrains Mono** | 400–500 | Specs, hours, prices, counters, ticket-style labels |
| Body | **Inter** | 400–500 | Paragraphs, form fields |

Scale (desktop): H1 clamp(3.5rem–7rem), H2 clamp(2.5rem–4.5rem), body 1rem/1.6.
Pairing rule: Anton for attitude, mono for trust (numbers, facts), Inter so nobody has to squint.

---

## 4. TONE OF VOICE

Direct, honest, zero fluff. A mechanic who tells you what it is, what it costs, and when it's done.

- Do: "Fixed right. Priced straight. Done when we say."
- Do: "4.7 stars from 120+ Torrington drivers."
- Don't: "Welcome to our family-owned automotive solutions center."
- CTAs are verbs: **Book Service**, **Get a Diagnostic**, **Call the Shop**.
- Enthusiast nod (for tuning/exhaust content): precise, respectful of the platform — "GTI specialists" not "we soup up rides."

---

## 5. SITE MAP + WIREFRAME (single-page scroll, sections in order)

### S0 — HUD Header (sticky, h:72px)
Left: `GARY'S HILLTOP` in Oswald + small mono tag `AUTO REPAIR — TORRINGTON, CT`. Right: nav (Services / Diagnostics / Reviews / Contact) + cyan-outline button **Book Service** + phone number in mono. On scroll: background fades from transparent to `rgba(10,11,13,0.85)` + blur(12px), bottom 1px steel border.

### S1 — HERO (100vh, pinned, scroll-driven)
Full-bleed dark garage photo (Asset A1). Car on a lift, low key, one cyan light source. Overlay vignette.
- Eyebrow (mono, cyan): `EST. TORRINGTON — 1294 E MAIN ST`
- H1 (Anton, massive): `STRAIGHT WORK. SOLID CARS.`
- Sub (Inter, smoke): "Full-service auto repair on the hill. Diagnostics, maintenance, and performance — done right the first time."
- Two buttons: solid cyan **Book Service** / ghost **See What We Fix**
- Bottom edge: mono ticker strip (infinite marquee): `OIL & FLUIDS — DIAGNOSTICS — BRAKES — EXHAUST — TUNING — INSPECTIONS —`
- Scroll cue: thin cyan line animating downward.

### S2 — TRUST BAR (auto height)
Four mono stat blocks, count-up on entry: `4.7★ GOOGLE RATING` / `120+ REVIEWS` / `[XX]+ YEARS ON THE HILL` (confirm with owner) / `SAME-WEEK APPOINTMENTS`. Separated by 1px steel rules. Stars render amber.

### S3 — SERVICES (glassmorphism grid)
Section title: `WHAT WE FIX`. 6 glass cards (`background: rgba(30,35,41,0.55); backdrop-filter: blur(14px); border: 1px solid rgba(232,234,237,0.08)`), 3×2 desktop, stacked mobile. Each card: mono index `01`, icon (simple line SVG, cyan), Oswald title, 1-line description, mono spec line.
1. **Diagnostics** — OBD-II scan, electrical, check-engine. `READOUT IN MINUTES`
2. **Oil & Fluids** — oil, coolant, transmission, brake fluid. `FULL FLUID SERVICE`
3. **Brakes** — pads, rotors, lines, ABS. `INSPECTED & TORQUED TO SPEC`
4. **Exhaust** — repair, replacement, custom & performance systems. `STOCK TO MODIFIED`
5. **Tuning & Performance** — VW GTI platform specialty: tuning, intake/exhaust, handling. `ENTHUSIAST WELCOME`
6. **Inspections & Maintenance** — scheduled service, tires, batteries, belts. `KEEP IT RUNNING`

### S4 — DIAGNOSTIC TERMINAL (signature cinematic section)
Full-width dark panel styled like a scan-tool readout: mono type, thin cyan rules, scanline texture overlay at 4% opacity. Sticky left column: `RUNNING DIAGNOSTIC…` types out line-by-line on scroll (typed effect tied to scroll progress): `> CONNECT OBD-II`, `> SCAN SYSTEMS`, `> IDENTIFY FAULT`, `> FIX IT RIGHT`. Right column: Asset A3 (diagnostic screen photo) in a steel frame. Ends with CTA **Get a Diagnostic**.

### S5 — THE SHOP (story split)
Left: Asset A5 (exterior/interior shot). Right: Anton H2 `THE SHOP ON THE HILL.` + 3 short paragraphs (honest history placeholder — interview Gary for real copy) + mono fact list (address, hours, phone). Amber hazard-stripe divider (CSS repeating-linear-gradient, 24px tall) tops this section.

### S6 — REVIEWS
H2 `WORD FROM THE ROAD.` 3 review cards (glass, like S3), 5 amber stars, quote, first name + town. Pull REAL reviews from Google before launch — placeholders must be replaced. Auto-advance carousel on mobile.

### S7 — BOOKING (conversion)
H2 `BOOK YOUR SERVICE.` Split: left = form; right = shop info panel (mono: address, phone, hours, "Walk-ins welcome for oil changes").
Form fields: Name / Phone / Vehicle (year, make, model) / Service needed (dropdown of the 6) / Preferred date / Notes. Submit: solid cyan **Request Appointment** → confirmation state `REQUEST RECEIVED — WE'LL CALL TO CONFIRM`. Note under form (mono, smoke): "No account needed. We confirm every appointment by phone."

### S8 — FOOTER
Ø-style minimal: logo text left; center mono: address, phone, hours; right: Facebook link (their only current channel) + Google Maps embed (dark-styled). Bottom line: `© 2026 GARY'S HILLTOP AUTO REPAIR — TORRINGTON, CT`.

---

## 6. SCROLL-DRIVEN CINEMATIC DIRECTIVES

Engine: GSAP + ScrollTrigger (or Framer Motion `useScroll`). Easing: `power3.out` for entrances, `linear` for scroll-scrubbed. Everything scrubbed ties to scroll progress; nothing autoplay-loops except the ticker.

| # | Section | Animation |
|---|---|---|
| A | Hero | Photo scales 1.15 → 1.0 while pinned (first 50% of scroll). H1 lines slide-up stagger 0.12s on load. Vignette darkens with scroll. |
| B | Ticker | Infinite marquee, 30s loop, pauses on reduced-motion. |
| C | Trust bar | Numbers count up 0 → value over 1.2s when 60% in view. Once only. |
| D | Services | Cards stagger in: translateY(40px)+opacity, 0.1s apart. Hover: border shifts to cyan at 60% opacity, icon glows, translateY(-4px). |
| E | Terminal | Typed lines advance with scroll progress (scrub). Each completed line gets a cyan `OK`. Photo frame parallaxes -8% against scroll. |
| F | Shop | Image clip-path reveal `inset(0 0 100% 0 → 0)` scrubbed. Text slides in after. |
| G | Reviews | Cards fade-up stagger; mobile carousel auto 5s. |
| H | Booking | Form fields rise in sequence 0.06s apart. Submit button: cyan pulse ring on hover. |
| I | Global | Section eyebrows (mono labels) get a 24px cyan line that draws left→right on entry. |

Performance: `prefers-reduced-motion` disables all scrub/pin, content fully visible. Images lazy-load below S2. Target LCP < 2.5s.

---

## 7. ASSET GENERATION PROMPTS

Photoreal, cinematic, NO text/logos/watermarks in any image. Aspect ratios noted. Grade: low-key, teal-cyan accent light against near-black, subtle film grain, shot on 35mm, shallow depth where noted.

**A1 — Hero garage bay (16:9 + 9:16 crop)**
"Interior of a working auto repair garage at night, a sedan raised on a two-post hydraulic lift, dramatic low-key lighting, single cool cyan work-light glow from the left, warm tungsten practicals in deep background, oil-stained concrete floor with light reflections, tool chests and air hoses along the walls, cinematic 35mm photo, shallow depth of field, no people, no text, no logos"

**A2 — Mechanic's hands macro (4:3)** *(texture/detail insert, services section)*
"Extreme close-up of a mechanic's gloved hands torquing a bolt with a ratchet wrench, dark workshop bokeh background, cool rim light with faint cyan tint, metallic highlights on the tool, photorealistic macro, gritty skin and nitrile glove texture, no text"

**A3 — Diagnostic screen (16:9)** *(S4 terminal section)*
"Laptop running automotive diagnostic software glowing in a dark repair shop, screen light illuminating an OBD cable and an engine bay out of focus behind it, cool cyan-blue glow, moody low-key photo, realistic screen bloom, no readable text on screen, no logos"

**A4 — GTI on the lift (16:9)** *(S3 performance card hover / S5 alternate)*
"Dark hot-hatch compact car rear three-quarter view on a shop lift, dual exhaust tips, moody garage environment, cyan accent light strip reflecting on the rear quarter panel, photorealistic automotive photography, low angle, no visible badges or license plate text"

**A5 — Shop exterior at dusk (16:9)** *(S5 story section)*
"Small independent auto repair garage on a New England main street at blue hour, bay doors open with warm light spilling out, one car inside on a lift, wet asphalt reflections, quiet small-town street, cinematic realism, no signage text, no people"

**A6 — Oil pour macro (1:1)** *(social/OG fallback, decorative)*
"Golden engine oil pouring in a thin stream against a pure black background, frozen motion, dramatic side lighting, macro photography, high contrast, no text"

**A7 — Diamond plate texture (1:1, tileable)**
"Seamless dark steel diamond plate texture, matte charcoal finish, subtle wear and scratches, evenly lit, top-down, tileable pattern, no text"

**A8 — Brushed metal texture (1:1, tileable)**
"Seamless dark brushed aluminum texture, fine horizontal grain, near-black gunmetal tone, subtle anisotropic sheen, tileable, no text"

**A9 — OG / social card background (1.91:1)**
"Wide dark cinematic shot of a car engine bay with a work light glowing cyan from the left side, deep shadows, generous negative space on the right third for text overlay, photoreal, no text, no logos"

Textures A7/A8 are used at 3–6% opacity as section background layers — subtle, never dominant.

---

## 8. COMPONENT SPECS

- **Primary button:** Anton-free — Oswald 600 uppercase, solid cyan `#22D3EE`, black text `#0A0B0D`, 2px radius (industrial = near-square), hover shifts to gradient + 4px glow `0 0 24px rgba(34,211,238,0.35)`.
- **Ghost button:** 1px cyan border, cyan text, transparent fill → 8% cyan fill on hover.
- **Glass card:** as S3 spec; 16px radius, 24px padding; top-left mono index in smoke.
- **Form inputs:** `--steel` fill, 1px `--steel` border → cyan on focus, mono placeholder, 8px radius.
- **Hazard divider:** `repeating-linear-gradient(45deg, #F59E0B 0 16px, #0A0B0D 16px 32px)`, use once (S5 top) — restraint keeps it special.
- **Icons:** thin 1.5px line SVGs (wrench, gauge, oil can, brake disc, exhaust pipe, clipboard), stroke cyan, no fills.

---

## 9. CONTENT TO CONFIRM WITH GARY (placeholders now)

1. Phone number + preferred contact method
2. Exact hours (all days)
3. Years in business (for trust bar counter)
4. 3–6 real Google review quotes (pull with permission)
5. Shop story facts for S5 (2–3 sentences)
6. Whether to list starting prices (e.g., oil change from $XX) — recommended for the mono "spec" lines

## 10. SEO / TECH BASELINE

- Title: `Gary's Hilltop Auto Repair — Torrington, CT | Diagnostics, Brakes, Oil & Performance`
- Meta description: "Trusted auto repair on East Main St, Torrington. 4.7★, 120+ reviews. Diagnostics, brakes, oil & fluids, exhaust, and VW GTI performance. Book service today."
- Schema: `AutoRepair` LocalBusiness with address, geo, hours, aggregateRating 4.7/120.
- Targets Harwinton + Torrington in one location-mention line in S5 copy.
- Stack suggestion: Next.js/Astro + Tailwind + GSAP. One page, no CMS needed for v1; form posts to email/Formspree until a booking system is chosen.
