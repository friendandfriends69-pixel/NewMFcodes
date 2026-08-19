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

- **Breathing hero** — two blurred SVG blobs behind the headline gently
  scale and drift (`@keyframes breathe`), plus a soft glow that follows the
  cursor on desktop.
- **Scroll-triggered reveals** — every section fades/rises into view once
  using `IntersectionObserver` (`data-reveal` attribute + `.in-view` class).
  Cheap, no scroll-jank, and only fires once per element.
- **Scroll progress rail** — a thin gradient bar at the very top fills as
  you scroll the page.
- **Sticky nav** — shrinks and gains a blurred background past 40px of
  scroll; the active section is highlighted automatically as you scroll.
- **Parallax** — the hero blobs drift at different speeds on scroll for
  subtle depth.
- **Accordion FAQ** — accessible (`aria-expanded`, keyboard operable),
  animated height, single-open behavior.
- **Micro-interactions** — card lift on hover, underline-draw nav links,
  arrow-nudge on "Explore" links, back-to-top button.
- **Respects `prefers-reduced-motion`** — all decorative animation is
  disabled automatically for users who've asked for reduced motion, and
  smooth-scroll falls back to instant jumps.

Everything is dependency-free vanilla JS (`main.js`, ~150 lines) — no jQuery,
no animation library, so it's easy to read, trim, or extend.

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
