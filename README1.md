# Mumma First — Redesign Concept

A from-scratch, animated redesign of [mummafirst.com](https://www.mummafirst.com/) —
same warm, mother-first spirit and color story, rebuilt with dynamic scroll
reveals, a breathing hero, a hover-glow, and an accessible FAQ accordion.
**Plain HTML / CSS / JS — no build step, no framework.** Copy the four files
into a repo and it just works.

> This is an independent redesign concept inspired by the public copy and
> structure of mummafirst.com. No original code or imagery was copied —
> layout, CSS, JS and photography placeholders are all original. Swap in the
> brand's real product photography before shipping (see **Adding your own
> images** below).

---

## File structure

```
mummafirst-redesign/
├── index.html                      → homepage markup & content
├── dirizo-electric-breast-pump.html → product page for the featured pump
├── style.css                        → design tokens + every style/animation (shared)
├── main.js                          → site-wide JS: nav, cursor, reveals, accordion,
│                                       carousel, theme toggle, back-to-top (shared)
├── product.js                       → product-page-only JS: image gallery, quantity
│                                       stepper, sticky buy bar (loaded only by the
│                                       product page, alongside main.js)
└── README.md                        → this file
```

Everything is self-contained. There's no `assets/` folder shipped with this
repo — image areas are styled as soft gradient placeholders so you can drop
in real photography without fighting existing files.

---

## Product pages

`breast-pump.html` is the first product page, built on the
exact same design system as the homepage (it links the same `style.css` and
loads `main.js` for all the shared nav/cursor/scroll behavior, plus a small
`product.js` for its own gallery, quantity stepper and sticky buy bar).

A few things to know before publishing it:

- **Price, rating, and every row in the specifications table are
  placeholders.** They're marked with `<!-- EDIT ME -->` comments in the
  HTML — search for `EDIT ME` and update each one to match your actual
  Flipkart listing before this goes live. Prices and ratings change, so
  don't leave the placeholders in.
- **The three customer quotes in the "What moms are saying" section are
  sample text**, not real reviews — replace them with genuine, verified
  customer feedback before publishing.
- The **"Buy Now" buttons link straight to the Flipkart listing** in a new
  tab, since this is a static site with no cart/checkout of its own. If you
  later add your own checkout, update the three `href`s that start with
  `https://www.flipkart.com/...`.
- The homepage's "Feeding & Pumping" offering card, the "Explore the
  product →" link, and the final "Shop the Collection" button all now
  point to this page.

To add a second product page later, duplicate
`dirizo-electric-breast-pump.html`, swap the copy/specs/links, and reuse the
same `style.css` + `main.js` + `product.js` — no new CSS or JS should be
needed for a straightforward product page.

---
## Quick start

**Option A — just open it**
Double-click `index.html`. It works with zero setup (no build tools, no npm).

**Option B — local server (recommended, avoids font/CORS quirks)**
```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```
Then visit `http://localhost:8000`.

**Option C — GitHub Pages**
1. Push these files to the root of your repo (or a `/docs` folder).
2. Repo → **Settings → Pages** → set the source branch/folder.
3. Your site is live at `https://<username>.github.io/<repo>/`.

---

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FBF6F1` | Base ivory background |
| `--bg-alt` | `#F3E7E2` | Alternating section wash |
| `--rose` | `#D98C93` | Primary accent (dusty rose) |
| `--rose-deep` | `#B65F68` | Buttons, links, hover states |
| `--sage` | `#93A984` | Secondary accent |
| `--gold` | `#D3A45C` | Sparing warm highlight |
| `--ink` | `#3A2A28` | Headings / body text |
| `--ink-soft` | `#6E5B57` | Secondary/muted text |

**Type:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display,
used in italics for warmth) + [Inter](https://fonts.google.com/specimen/Inter)
(body). Loaded from Google Fonts in `index.html` — swap the `<link>` tags if
you'd rather self-host.

All tokens live at the top of `style.css` under `:root`, so re-theming the
whole site is a matter of editing a handful of hex values in one place.

---

## Interactive / animated features

**Atmosphere**
- **Ambient aurora background** — three huge, softly blurred color blooms
  (rose / gold / sage) drift slowly behind the entire page, fixed to the
  viewport (`.aurora`). Pure CSS, GPU-friendly, paused under reduced motion,
  and toned down on small screens for performance.
- **Breathing hero + liquid-morph blobs** — the two hero blobs now scale,
  rotate and skew through a slow organic cycle (`@keyframes liquidMorph`)
  instead of a simple pulse, so they read as gently "alive" rather than
  static shapes; a soft glow still follows the cursor on desktop.
- **Floating glass orbs** — two small glassmorphic spheres drift near the
  hero copy for extra depth (desktop only, hidden ≤720px).
- **Floating trust badges** — three glass "chips" (dermatologist tested,
  mother count, returns policy) gently bob around the hero on desktop and
  settle into a static row below the CTAs on mobile/tablet.
- **Ambient particles** — small drifting dots rise through the hero, the
  "we see you" section, and the final CTA for quiet atmosphere. Generated
  once on load (`.particles` containers + `main.js`), pure CSS animation
  after that — no per-frame JS cost.
- **Custom cursor** — a trailing dot-and-ring replaces the system cursor on
  desktop, and gently expands over anything clickable. Falls back to the
  normal cursor on touch devices and when reduced motion is requested.
- **Cursor-reactive glow zones** — the hero's cursor-follow glow is now
  reused across the stats band, the featured-product section and the final
  CTA (`[data-cursor-glow]` + `.zone-glow`), so more of the page feels alive
  to mouse movement on desktop.

**Motion & navigation**
- **Scroll-triggered reveals** — every section fades/rises into view once
  using `IntersectionObserver` (`data-reveal` attribute + `.in-view` class).
- **Scroll progress rail** — a thin gradient bar at the very top fills as
  you scroll the page.
- **Circular progress ring** — the back-to-top button now has an SVG ring
  that fills in as you scroll down the page, not just a plain arrow.
- **Sticky nav** — shrinks and gains a blurred background past 40px of
  scroll; the active link is highlighted automatically as you scroll.
- **Quick-nav side dots** — a scrollspy rail on the right edge (desktop only)
  that jumps straight to any section, with a label tooltip on hover.
- **Floating "Shop the Edit" dock** — a persistent CTA appears once you've
  scrolled past the hero (a glass pill bottom-left on desktop, a full-width
  dock on mobile with safe-area padding for notched phones), and hides again
  near the final CTA so it never feels redundant. Reuses the same magnetic +
  petal-burst behavior as the other primary buttons.
- **Parallax** — the hero blobs drift at different speeds on scroll for
  subtle depth.

**Content interactions**
- **Rotating hero word** — "deserves to be *held*, too" cycles through
  held / seen / supported / cared for with a soft crossfade.
- **Animated stats band** — four count-up figures (mothers supported,
  products, rating, materials) animate into place the first time the band
  scrolls into view. **These are illustrative placeholders — swap them for
  your real numbers in `index.html` (`data-count-to` / `data-suffix`) before
  shipping.**
- **Scrolling values marquee** — an infinite-loop banner ("Simplicity •
  Gentleness • Trust • Mother-first") between the hero and the story
  section; pauses on hover.
- **3D tilt cards** — the philosophy and offerings cards tilt toward the
  cursor on desktop (`data-tilt` attribute), with a soft lift.
- **Animated gradient glow border** — pillar and offer cards get a slowly
  rotating conic-gradient border glow on hover (desktop); touch devices get
  the same glow as a one-time pulse the first time the card scrolls into
  view, so the flourish isn't lost on mobile.
- **Idle floating icons** — every pillar and offer icon bobs gently and
  continuously, staggered per card, so the grid feels alive even without
  hovering — this is the one motion effect visible on both desktop and touch.
- **Curtain-wipe image reveals** — the photo/product placeholders wipe open
  (rather than simply fading) the first time they scroll into view,
  direction-aware so left/right layouts wipe from the correct edge.
- **Magnetic buttons** — primary CTAs nudge toward the cursor within their
  bounds, then spring back (`.magnetic` class).
- **Tap/click ripple** — every button gets a soft ripple from the point of
  contact (`pointerdown`), so touch users get the same tactile feedback
  desktop users get from hover/magnetic effects.
- **Testimonial carousel** — three autoplaying slides with dot and arrow
  navigation, plus touch swipe support; autoplay pauses on hover/focus/swipe.
- **Accent theme toggle** — a swatch pair in the nav flips the whole site's
  accent from rose to sage and back, persisted in `localStorage`. Because
  every accent color in `style.css` is drawn from two CSS variables
  (`--rose` / `--rose-deep`), the whole palette re-themes from one JS
  function.
- **Petal burst** — a small delight on primary-button clicks: a handful of
  soft petals burst from the click point and fade.
- **Accordion FAQ** — accessible (`aria-expanded`, keyboard operable),
  animated height, single-open behavior.
- **Micro-interactions** — card lift on hover, underline-draw nav links,
  arrow-nudge on "Explore" links, back-to-top button.

**Accessibility**
- **Respects `prefers-reduced-motion`** — the aurora, particles, tilt,
  magnetic buttons, the custom cursor, petal bursts, glow borders, floating
  badges/orbs, ripples, and the hero word rotation are all skipped for users
  who've asked for reduced motion; smooth-scroll falls back to instant jumps;
  stat counters render their final number immediately instead of animating.
- Touch and non-hover devices automatically skip cursor/tilt/magnetic
  effects (detected via `(hover: hover) and (pointer: fine)`), so nothing
  breaks or feels sticky on mobile — and get touch-appropriate substitutes
  instead (swipeable carousel, tap ripples, one-time glow pulses).

Everything is dependency-free vanilla JS (`main.js`) — no jQuery, no
animation library — so it's easy to read, trim, or extend.

---

## Adding your own images

The redesign intentionally ships with styled placeholder panels
(`.visual-placeholder`) instead of stock photography, so you don't inherit
copyrighted images. To swap one in:

1. Add your image to an `assets/` folder, e.g. `assets/story.jpg`.
2. In `index.html`, replace the relevant `.visual-placeholder` block:
   ```html
   <div class="visual-frame">
     <img src="assets/story.jpg" alt="Describe the photo here" style="width:100%;height:100%;object-fit:cover;">
   </div>
   ```
3. Done — the rounded corners and layout are already handled by
   `.visual-frame` in `style.css`.

---

## Customizing content

All copy lives directly in `index.html` — there's no CMS or data file to
wire up. Search for the section `id`s (`stats`, `story`, `pillars`,
`offerings`, `product`, `faq`, `final-cta`) to find each block quickly.

To add/remove an FAQ item, copy one `.accordion-item` block in the `#faq`
section — the JS automatically wires up any new `.accordion-trigger` /
`.accordion-panel` pair.

To update the stats band, edit the four `.stat-card` blocks in `#stats` —
change `data-count-to` (the target number), `data-suffix` (text appended
after, e.g. `+` or `%`), and `data-decimal` (how many implied decimal places,
e.g. `data-count-to="49" data-decimal="1"` renders as `4.9`). Remember these
ship as illustrative placeholders, not real figures.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari — last 2 versions).
Uses `IntersectionObserver`, CSS custom properties, `clamp()`, and
`aspect-ratio` — all widely supported since ~2021.

The redesign also uses a few newer CSS features for the animated glow
borders and ripple effect: `@property` (animatable custom properties) and
`color-mix()`. Both are supported in current Chrome, Edge, Safari and
Firefox; on an older browser these simply degrade gracefully to a static
gradient border / a fixed ripple tint rather than breaking anything.

---

## License

Use this freely as a starting point for your own project.
