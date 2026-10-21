# Plan: Integrate `scroll-timeline` React Component

## 1. Codebase Assessment

Project root for the app: [`next-app/`](next-app)

| Requirement | Status | Evidence |
|---|---|---|
| TypeScript | Present | [`tsconfig.json`](next-app/tsconfig.json:1) (`strict: true`) |
| Tailwind CSS | Present | v4 via [`postcss.config.mjs`](next-app/postcss.config.mjs:1) and `@import "tailwindcss"` in [`globals.css`](next-app/app/globals.css:1) |
| shadcn project structure | Missing | No `components.json`, no `@/` alias, no `lib/utils.ts` |

Existing component convention: [`src/components/HowIWork3D.tsx`](next-app/src/components/HowIWork3D.tsx:1) uses `'use client'`, React 19, and GSAP.

## 2. Why `components/ui` Matters

shadcn CLI writes primitives into `components/ui` and treats that folder as CLI-owned. Keeping it separate from app-level components (like [`HowIWork3D.tsx`](next-app/src/components/HowIWork3D.tsx:1)) prevents the CLI from overwriting custom code and keeps imports predictable. The provided demo imports from `@/components/ui/scroll-timeline`, so this path must exist.

## 3. Required Setup (do this first)

1. Add the `@/` path alias to [`tsconfig.json`](next-app/tsconfig.json:1):
   ```json
   "baseUrl": ".",
   "paths": { "@/*": ["./src/*"] }
   ```
   This maps `@/components/ui/...` to `src/components/ui/...`.
2. Create [`next-app/components.json`](next-app/components.json) with `"aliases": { "components": "@/components", "ui": "@/components/ui", "utils": "@/lib/utils" }`, `"tailwind": { "css": "app/globals.css" }`, `"rsc": true`, `"tsx": true`.
3. Create [`next-app/src/lib/utils.ts`](next-app/src/lib/utils.ts) with the standard `cn()` helper (`clsx` + `tailwind-merge`). Install `clsx` and `tailwind-merge` if the CLI does not add them.
4. Create the folder [`next-app/src/components/ui/`](next-app/src/components/ui).

## 4. Files To Create

1. [`next-app/src/components/ui/scroll-timeline.tsx`](next-app/src/components/ui/scroll-timeline.tsx) — the provided component, verbatim (exports `Milestone`, `TimelineProps`, default `Component`).
2. [`next-app/src/app/scroll-timeline/page.tsx`](next-app/src/app/scroll-timeline/page.tsx) — the demo, adapted to a Next.js App Router page (add `'use client'`, import from `@/components/ui/scroll-timeline`).

## 5. Animation Enhancement (smooth motion)

The base component uses a raw `scroll` listener + `setState`, which re-renders on every scroll event and can jank. Enhance with GSAP (already a dependency) for buttery motion:

- Replace the scroll listener with `gsap.to` + `ScrollTrigger` (`scrub: true`) driving a progress value, or keep `requestAnimationFrame` throttling.
- Animate the foreground line height with `scaleY` (transform) instead of `height` to avoid layout thrash.
- Add `will-change: transform` on the animated line and dots.
- Stagger card reveals with `gsap.from` (`y`, `opacity`, `ease: "power2.out"`) triggered by `ScrollTrigger` per item.
- Respect `prefers-reduced-motion` via `gsap.matchMedia()` — show final state without animation.
- Keep the dot activation logic but drive it from the same progress value.

## 6. Verification

- Run `npm run dev` inside [`next-app/`](next-app) and open `/scroll-timeline`.
- Confirm: line draws on scroll, dots activate in order, cards fade/slide in, dark mode works, no console errors.
- Test at 375px (mobile) and desktop; verify reduced-motion fallback.

## 7. Execution Order

1. Add `@/` alias + `components.json` + `lib/utils.ts` + `components/ui` folder.
2. Add `scroll-timeline.tsx`.
3. Add the demo page.
4. Apply GSAP animation enhancements.
5. Verify in dev server.
