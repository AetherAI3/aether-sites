# Aether Sites project map

The collection hero contains a lightweight US map with a Connecticut close-up. It uses static SVG boundaries, CSS surface lift/shadows, and a dependency-free script. It does not require map tiles, an API key, WebGL, or a framework.

## What the points represent

The points are independent website concepts based on real businesses, not claims of commissioned clients, offices, service coverage, or business endorsement. The current four projects all belong to Connecticut. Locations are approximate town-level positions; nearby/same-town points fan out with leader lines in the closer view. They are not navigation coordinates.

| Project | Location shown | Basis checked September 13, 2026 |
| --- | --- | --- |
| Reworx | Watertown; Morris also named in the project link | [Official website](https://www.reworxct.com/) lists the shop at 30 Echo Lake Road, Watertown, and studio at 310 Watertown Road, Morris. One site receives one point, using the shop town. |
| Gary’s Hilltop | Torrington | [CARFAX business profile](https://www.carfax.com/Reviews-Garys-Hilltop-Auto-Repair-Torrington-CT_QETDMGJ001) and the existing [shop source notes](garys-hilltop.md) identify 1294 E Main Street, Torrington. |
| Mach Detail | Torrington | [Existing verified source notes](mach-detail.md), including the supplied business profile, identify 644 Main Street, Torrington. |
| Waterbury Aquarium | Waterbury | [Seachem dealer directory](https://www.seachem.com/SDL/SDLDealerDetail.php?recID=75108) identifies 406 Watertown Avenue, Waterbury. |

Ember & Iron is a fictional restaurant concept and Harbor & Hollow is an illustrative product brand. Both remain in the collection; neither is assigned a real-business map point. This avoids implying business locations that have not been established.

## Geography and license

`assets/map/us-states.svg` contains 50 states and the District of Columbia, with Alaska and Hawaii insets. Paths are derived from [US Atlas 3.0.1](https://github.com/topojson/us-atlas), using its [projected states TopoJSON](https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-albers-10m.json). US Atlas redistributes the Census Bureau's 2017 cartographic boundary data. This is a portfolio locator, not a current legal-boundary reference.

The original quantized arcs were decoded, stitched in their specified direction, and rounded to two projected decimal places. The Albers USA projection uses scale 1300 and translation [487.5, 305], matching US Atlas. The copyright and ISC license are shipped in `assets/map/us-atlas-LICENSE.txt`.

## Add a project as the collection grows

The ordinary links inside `#map-projects` in `index.html` are the single source of project data. Add a link with:

- `data-map-project`, its real site `href`, `data-label`, and `data-city`.
- `data-state`: a zero-padded state FIPS code, such as `09` for Connecticut or `12` for Florida.
- `data-lon` and `data-lat`: verified approximate town coordinates, not invented street precision.
- Visible project name and location text, which also provide the no-JavaScript navigation.

The script groups projects by state, lights the corresponding state, computes its node/count, and draws the closer state view from the same SVG geometry. Alaska and Hawaii use the corresponding inset projections. With one project the national marker opens that website; multiple projects share a counted cluster that opens the closer view. Update any static fallback labels/counts and the no-JS illuminated state classes when adding locations. Do not add demonstration pins to imply a larger footprint.

## Interaction and verification

- A stationary state hit surface owns pointer events; only its visual surface lifts. This avoids hover jitter when the raised edge moves.
- Native buttons switch views; project points and the adjacent list are ordinary links. Counted clusters support keyboard activation and focus returns to the view control after opening a closer view. Link hover/focus highlights the matching point and updates the readout.
- On small screens the map stacks below the headline; the full-size project links remain easy to tap. Reduced motion removes surface movement, perspective, and transitions. There is no idle animation, scroll listener, external script, or continuous rendering loop.
- Without JavaScript the national map and all four project links remain available; view buttons stay hidden.
- Validation: script/CSS parsing, collection link/asset checks, all existing request/date tests, production build, and all 51 SVG fragment references. DOM simulations verified cluster activation, Connecticut projection bounds, non-overlapping point targets, four correct destinations, view-button state, focus/highlight synchronization, repeated view changes, no-JS links, and automatic illumination after adding a synthetic future Florida project (test-only, not published). No browser-layout or physical-device certification is claimed.
