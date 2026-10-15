# NAFADH: Redesign Prototype (TRA identity-aligned, v2)

A standalone design experiment, built separately from the NAFADH application. It uses only HTML, CSS and JavaScript, with no build step, backend or API. All data is fictional mock data.
- **Backup of v1** (the version before the identity alignment): `..\NAFADH_Redesign_Prototype_BACKUP_2026-10-15`

## Run it
Open `index.html` in Chrome, Edge or Firefox.
The fonts load from Google Fonts. Offline, the pages fall back to system fonts, and everything else still works.

| Page | File |
|---|---|
| Landing | `index.html` |
| Opportunities Explorer | `opportunities.html` (supports `?type=job`, `?type=free`, `?type=tender`) |
| User Dashboard | `dashboard.html` |

## Identity source
`الهوية .pdf` has three pages: theme colors, design elements and fonts.

### Official (from the PDF)
| Item | Value |
|---|---|
| Navy (TRA logo color: blue, technology) | `#000792` |
| Cyan (TRA logo color) | `#33DEF2` |
| Teal (Green ICT) | `#00B2B2` |
| Fresh green (Green ICT) | `#58E99B` |
| Gradient | `#58E99B` → `#000A88` |
| Gradient | `#00C6C6` → `#000A88` |
| Gradient | `#33DEF2` → `#000792` |
| Contact-bar navy | `#001C91` |
| Network element | Triangulated ribbon of thin lines and nodes, running cyan → teal → blue → navy |
| Contact bar | 1000 · www.tra.gov.om · consumer@tra.gov.om · @TRA_OMAN |
| Fonts | GE SS Two (Arabic) and Myriad Pro (English) |

The hex values were read from the PDF's vector data (in an ICC-based RGB color space). They are representative screen values, not a print specification.

### Design decisions (not official specs)
- **Derived tones:**
  - `--tra-blue #0057A8`: the medium blue, sampled from the middle of the official gradient.
  - `--teal-ink #007A80` and `--green-ink #0B7044`: teal and green darkened so text meets 4.5:1 contrast on white.
  - Dark-mode surfaces: built from the official navy.
- **Service colors** (Jobs blue / Freelance teal-cyan / Tenders green):
  - These are brand-derived.
  - They were tuned until a color-vision-deficiency validator passed in both light and dark modes.
  - The exact official teal and green are too close to each other to be told apart in charts.
- **Fonts:**
  - The official faces are referenced by name only, so a device with legitimately installed copies uses them.
  - Otherwise, Arabic uses **Cairo** and English uses **Source Sans 3**, an open Adobe humanist sans and the closest open match to Myriad Pro.
  - No licensed font files are copied or bundled.
- **Network element:**
  - It is reproduced procedurally: a Delaunay-triangulated ribbon whose colors come from CSS variables.
  - In the hero it is animated: it reacts to the cursor, drifts with scroll and sends travelling signals along its edges.
  - It also appears, static, in the footer and in one section corner.
  - Ribbons stay at the edges, and the network fades behind the headline.

All colors are CSS variables in `assets/css/style.css`; the JavaScript reads the palette from those variables.

## Structure
```
assets/css/style.css         tokens (official + derived), typography, shared components, footer + contact bar
assets/css/logos.css         NAFADH logo and mark (original asset) inlined as recolorable masks
assets/css/{landing,opportunities,dashboard}.css
assets/js/main.js            icons, theme, reveals, counters, magnetic, spotlight, toast, mesh generator
assets/js/data.js            mock opportunities and user
assets/js/{landing,opportunities,dashboard}.js
assets/img/                  original NAFADH and TRA logo files (unaltered copies from the app)
```
