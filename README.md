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
├── index.html      → all page markup & content
├── style.css        → design tokens + every style/animation
├── main.js          → scroll reveals, nav, accordion, parallax (vanilla JS)
└── README.md         → this file
```

Everything is self-contained. There's no `assets/` folder shipped with this
repo — image areas are styled as soft gradient placeholders so you can drop
in real photography without fighting existing files.

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
- **Breathing hero** — two blurred SVG blobs behind the headline gently
  scale and drift (`@keyframes breathe`), plus a soft glow that follows the
  cursor on desktop.
- **Ambient particles** — small drifting dots rise through the hero, the
  "we see you" section, and the final CTA for quiet atmosphere. Generated
  once on load (`.particles` containers + `main.js`), pure CSS animation
  after that — no per-frame JS cost.
- **Custom cursor** — a trailing dot-and-ring replaces the system cursor on
  desktop, and gently expands over anything clickable. Falls back to the
  normal cursor on touch devices and when reduced motion is requested.

**Motion & navigation**
- **Scroll-triggered reveals** — every section fades/rises into view once
  using `IntersectionObserver` (`data-reveal` attribute + `.in-view` class).
- **Scroll progress rail** — a thin gradient bar at the very top fills as
  you scroll the page.
- **Sticky nav** — shrinks and gains a blurred background past 40px of
  scroll; the active link is highlighted automatically as you scroll.
- **Quick-nav side dots** — a scrollspy rail on the right edge (desktop only)
  that jumps straight to any section, with a label tooltip on hover.
- **Parallax** — the hero blobs drift at different speeds on scroll for
  subtle depth.

**Content interactions**
- **Rotating hero word** — "deserves to be *held*, too" cycles through
  held / seen / supported / cared for with a soft crossfade.
- **Scrolling values marquee** — an infinite-loop banner ("Simplicity •
  Gentleness • Trust • Mother-first") between the hero and the story
  section; pauses on hover.
- **3D tilt cards** — the philosophy and offerings cards tilt toward the
  cursor on desktop (`data-tilt` attribute), with a soft lift.
- **Magnetic buttons** — primary CTAs nudge toward the cursor within their
  bounds, then spring back (`.magnetic` class).
- **Testimonial carousel** — three autoplaying slides with dot and arrow
  navigation; autoplay pauses on hover/focus.
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
- **Respects `prefers-reduced-motion`** — particles, tilt, magnetic buttons,
  the custom cursor, petal bursts, and the hero word rotation are all
  skipped for users who've asked for reduced motion; smooth-scroll falls
  back to instant jumps.
- Touch and non-hover devices automatically skip cursor/tilt/magnetic
  effects (detected via `(hover: hover) and (pointer: fine)`), so nothing
  breaks or feels sticky on mobile.

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
wire up. Search for the section `id`s (`story`, `pillars`, `offerings`,
`product`, `faq`, `final-cta`) to find each block quickly.

To add/remove an FAQ item, copy one `.accordion-item` block in the `#faq`
section — the JS automatically wires up any new `.accordion-trigger` /
`.accordion-panel` pair.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari — last 2 versions).
Uses `IntersectionObserver`, CSS custom properties, `clamp()`, and
`aspect-ratio` — all widely supported since ~2021.

---

## License

Use this freely as a starting point for your own project.
