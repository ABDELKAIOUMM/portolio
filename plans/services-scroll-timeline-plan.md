# Plan: Apply Scroll-Timeline Design to the Services Section

Target file: [`index.html`](index.html:1) — the static site (NOT the Next.js app).

## 1. Current State

The Services section lives in [`index.html`](index.html:2113) inside `#about`:

- Section head: [`index.html`](index.html:2116) with eyebrow "Services" and title.
- Grid: [`index.html`](index.html:2124) `.grid` with 5 `.card` articles:
  - `landing` (feature panel + fallback), `portfolio`, `wordpress`, `shopify`, `performance`.
- CSS: `.grid` at [`index.html`](index.html:620), `.card` at [`index.html`](index.html:656), feature panel logic.
- JS: feature-panel swap + magnetic tilt at [`index.html`](index.html:3020).

## 2. Goal

Replace the bento grid with a **vertical scroll-driven timeline** matching the `scroll-timeline` component:

- A center (desktop) / left (mobile) vertical line.
- A faded background line + an animated foreground line that draws as you scroll.
- 5 milestone cards alternating left/right on desktop, stacked on mobile.
- A dot per milestone that activates when the line reaches it.
- Smooth GSAP ScrollTrigger animation (GSAP is already loaded in [`index.html`](index.html)).

## 3. Content Mapping

| Service | Date/Badge | Title | Description |
|---|---|---|---|
| landing | 01 | Landing Pages | High-converting pages that load in under a second and turn visitors into customers. |
| portfolio | 02 | Portfolio Sites | Personal portfolio websites that present your work and skills better than a plain CV. |
| wordpress | 03 | WordPress Stores | WooCommerce stores and blogs built on WordPress — easy to manage, ready to sell. |
| shopify | 04 | Shopify Stores | Fast, conversion-focused Shopify storefronts with clean product and checkout flows. |
| performance | 05 | Performance & SEO | Faster pages, better Core Web Vitals, and stronger visibility in search. |

Keep the existing SVG icons from each card.

## 4. Implementation Steps

1. **HTML** — Replace the `.grid` block in [`index.html`](index.html:2124) with a new `.services-timeline` structure:
   - `.services-timeline` wrapper (ref for ScrollTrigger).
   - `.services-line-bg` (faded line) and `.services-line-fg` (animated line, `transform-origin: top`, animated via `scaleY`).
   - `.services-track` containing 5 `.service-milestone` items, each with `.service-dot`, `.service-badge` (number), `.service-card` (icon + h3 + p).
   - Alternate class `is-even` / `is-odd` for left/right placement.

2. **CSS** — Add a new block (near the existing `.grid` styles) for:
   - `.services-timeline` (relative, max-width, centered).
   - `.services-line-bg` / `.services-line-fg` (absolute, 2px, centered on desktop, left on mobile).
   - `.service-milestone` (flex row, alternating direction on desktop).
   - `.service-dot` (absolute, centered on the line, active/inactive states).
   - `.service-card` (reuse existing glass tokens `--glass`, `--line`, `--radius`, `--elev-1`).
   - Responsive rules: single column + left line under 760px.
   - `prefers-reduced-motion` fallback (line fully drawn, cards visible).

3. **JS** — Add a new IIFE (after the existing services script) that:
   - Registers `ScrollTrigger` (already available).
   - Animates `.services-line-fg` with `gsap.fromTo(scaleY: 0 → 1)` + `scrub`.
   - Reveals each `.service-milestone` with `gsap.fromTo(y, opacity)` staggered.
   - Toggles `.is-active` on dots based on scroll progress.
   - Respects `prefers-reduced-motion` (show final state, no animation).
   - Uses `gsap.context()` for cleanup.

4. **Remove/neutralize** the old bento grid CSS + feature-panel JS only if it no longer applies. Prefer keeping the old CSS untouched (unused) to avoid breaking other sections, and simply stop rendering `.grid` in the services area.

## 5. Risks / Notes

- The old feature-panel JS at [`index.html`](index.html:3020) queries `#featurePanel`; if removed from HTML, the script returns early safely (`if (!grid || !panel) return;`). Verify no console errors.
- Keep the section head ([`index.html`](index.html:2116)) or restyle it to match the timeline intro.
- Ensure dark theme tokens are used (site is dark by default).

## 6. Verification

- Open [`index.html`](index.html:1) in a browser.
- Confirm: line draws on scroll, dots activate in order, cards slide in, alternating layout on desktop, stacked on mobile (375px), no console errors, reduced-motion shows static final state.

## 7. Execution Order

1. Add timeline CSS.
2. Replace services grid HTML with timeline markup.
3. Add timeline JS (ScrollTrigger).
4. Verify in browser at desktop + 375px + reduced-motion.
