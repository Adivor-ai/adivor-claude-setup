---
name: frontend-designer
description: >-
  Construye un componente, página o artifact aislado desde cero, cuando no hay proyecto, design
  system ni brief que respetar. Cubre design thinking, CSS moderno, patrones de componente y
  accesibilidad base. Triggers: «haz un componente», «arma esta página suelta», «créame un card»,
  'build a component'. NO usar cuando el proyecto ya tiene código o tokens que respetar: eso es
  impeccable. NO usar para una landing con brief: eso es design-taste-frontend.
---

# Frontend Designer

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Design Thinking Protocol

Before coding, **understand context**, then **commit boldly** to a distinctive direction.

### Questions to Ask First
1. **Purpose**: What problem does this solve? Who uses it?
2. **Tone**: What aesthetic extreme fits? (see Tone Palette below)
3. **Constraints**: Framework, performance, accessibility requirements?
4. **Differentiation**: What makes this UNFORGETTABLE?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, TypeScript, etc.) that is production-grade, visually striking, cohesive, and meticulously refined.

### Tone Palette (Pick an Extreme)

**Structural aesthetics:**
Brutally minimal · Editorial/magazine · Neo-Swiss Grid · Anti-Grid Experimental · Monochrome High-Contrast · Bauhaus Modernism · Constructivist Propaganda · Isometric Systems · Data-Driven Dashboard · Scientific/Technical · Military/Command UI · Architectural Blueprint

**Expressive & warm:**
Organic/natural · Soft/pastel · Whimsical Storybook · Coastal/Airy · Desert Modern · Botanical Apothecary · Nordic Calm · Playful Minimal · Weathered/Vintage Patina · Monastic/Wabi-Sabi

**Bold & energetic:**
Retro-futuristic · Brutalist/raw · Art Deco/geometric · Duotone Pop · Memphis Playful · Futurist Speed · Kinetic Typography · Riso Print

**Digital & immersive:**
Glitch/Digital Noise · Y2K Cyber Gloss · Vaporwave Nostalgia · Synthwave Night Drive · Cinematic Noir · Modern Skeuomorphic · Clay/Soft 3D

**Commercial & polished:**
Startup Crisp · High-Fashion Lookbook · Museum Exhibition · Liquid Glass (2025 trend)

Use these as launch points — blend, subvert, or invent new directions.

---

## Core Design Principles

### 1. Visual Hierarchy Is the Skeleton

Use **size, color/contrast, typography, position, and whitespace** — no more than three size variations and three contrast levels for clear primary/secondary/tertiary tiers.

**Scan patterns:** F-pattern for content-heavy pages, Z-pattern for minimal landing pages. Place key messages along natural scan paths. Use the **squint test** and **grayscale test** — hierarchy should survive on structure alone.

**Gestalt:** Proximity is the most powerful grouping cue. Chunk related elements. A 12-field form grouped into three clusters of four feels dramatically less daunting.

### 2. Typography as Primary Design Element

**For detailed typography specs, scales, and pairing strategies → read `./references/TYPOGRAPHY.md`**

- **Headlines**: Emotional, personality-driven, UNEXPECTED
- **Body**: Functional, highly legible
- 2–3 typefaces max, but CHARACTERFUL and distinctive
- Mathematical scale ratios (Major Third 1.25× as versatile default)
- Fluid typography via `clamp()` — always combine `rem` + `vw` units

**NEVER default to**: Inter, Roboto, Arial, Space Grotesk, Poppins, or system fonts as primary.

### 3. Color Systems That Work

**For detailed color architecture, dark mode, and accessibility specs → read `./references/COLOR.md`**

- **60-30-10 rule**: 60% dominant/background, 30% secondary, 10% accent
- **Use OKLCH color space** — perceptually uniform, supports Display P3 gamut
- WCAG AA minimum: **4.5:1** for normal text, **3:1** for large text and UI components
- Dark mode: Use #121212 not #000000. Desaturate accents 20–30%
- Derive palettes with `oklch()` relative syntax and `color-mix()`

**NEVER use**: Generic SaaS blue (#3B82F6), purple gradients on white, default Tailwind palette unmodified.

### 4. Layout & Spatial Composition

- **8px grid** (Material Design + Apple HIG). CSS Grid for structure, Flexbox within components.
- **Mobile-first always** — 63% of users abandon sites over mobile usability issues
- **Container queries** for component-responsive design (full browser support 2025)
- `repeat(auto-fit, minmax(250px, 1fr))` for responsive grids without media queries
- Create spatial interest through asymmetry, overlap, diagonal flow, grid-breaking elements

### 5. Motion & Interaction

**For detailed easing curves, duration tables, and animation patterns → read `./references/MOTION-SPEC.md`**

- Only animate `transform` and `opacity` (GPU-accelerated)
- Follow Stripe's hierarchy: CSS transitions → CSS animations → Web Animations API → `requestAnimationFrame`
- Focus on **high-impact moments**: one orchestrated page load with staggered reveals
- **Scroll-driven animations** (`animation-timeline: scroll()`) run on compositor, jank-free
- **View Transitions API** for smooth DOM state changes (Baseline October 2025)
- Always respect `prefers-reduced-motion`

### 6. Backgrounds & Visual Atmosphere

Don't default to solid colors. Create atmosphere:
- Gradient meshes (2–4 radial gradients, offset from corners)
- Grain/noise via `::before` pseudo-element (opacity 0.03–0.08)
- Layered shadows (2–3 per element, never single flat shadows)
- Layered transparencies for depth
- Custom cursors for brand differentiation

---

## Modern CSS (2024–2026)

These native capabilities eliminate JavaScript dependencies:

- **Scroll-driven animations**: `animation-timeline: scroll()` and `view()` — GPU-accelerated parallax and reveal-on-scroll
- **View Transitions API**: `document.startViewTransition()` for smooth state changes
- **OKLCH**: `oklch()` + relative color syntax + `color-mix()` — the new color standard
- **Container queries + Subgrid**: Component-responsive design, perfect nested alignment
- **CSS Cascade Layers**: `@layer` for specificity control without `!important`
- **Native nesting + `:has()`**: Parent selector finally available, no preprocessor needed
- **`interpolate-size: allow-keywords`**: Animate to `height: auto` natively

---

## Component & Page Patterns

**For detailed component specs, page patterns, and UX guidance → read `./references/COMPONENTS.md`**

- **Buttons**: One primary per section. Six states. Min touch target **44×44px**.
- **Forms**: Single-column. Labels outside fields. Inline validation.
- **Navigation**: Visible nav outperforms hidden. Never hamburger on desktop.
- **Landing pages**: Answer "what's in it for me?" in 50ms. One CTA per section.
- **Dashboards**: <40% information density. Progressive disclosure.

### React/JSX Architecture

- **Headless + styled**: Radix UI / Base UI for accessibility, custom styling on top
- **shadcn/ui as copy-paste foundation**: Import, then heavily customize. Never ship defaults unchanged.
- **Single-file artifacts**: For Claude artifacts, keep everything in one file. Use Tailwind utility classes.
- Use `useState`, `useReducer` for state. NEVER use `localStorage`/`sessionStorage` in artifacts.
- Available libraries: lucide-react, recharts, d3, three.js, Tone.js, lodash, mathjs, Plotly, shadcn/ui.

### Design Tokens

For token architecture and theming, use the `core-components` skill. Key principles:
- Three-tier architecture: Primitive → Semantic → Component tokens
- CSS custom properties as the runtime foundation
- `@theme` directive in Tailwind v4 for token definition

---

## Accessibility Foundation

**For complete accessibility reference → read `./references/ACCESSIBILITY.md`**

Non-negotiable baseline:
- Semantic HTML before ARIA
- Keyboard navigable: Tab, Enter/Space, Escape for modals, visible focus indicators
- Contrast: 4.5:1 text, 3:1 large text and components
- Touch targets: 44×44px minimum
- `prefers-reduced-motion` always implemented
- European Accessibility Act (EAA) enforced since June 2025

---

## Anti-Sameness Protocol

Before implementing, force variety across these dimensions:

| Dimension | Roll Options |
|-----------|-------------|
| Color temperature | Warm (terracotta, ochre, cream) vs Cool (slate, ice blue, charcoal) |
| Layout direction | Left-heavy · Right-heavy · Center with edge tension · Diagonal/rotated |
| Type personality | Geometric sans · Humanist sans · Serif · Slab serif · Display · Monospace |
| Motion philosophy | Minimal · Choreographed · Playful |
| Density | Generous whitespace · Controlled density |
| Theme | Light · Dark · Duotone · Gradient-dominant |

---

## What Never to Do

- Inter, Roboto, Arial, Space Grotesk, Poppins as primary fonts
- Generic SaaS blue (#3B82F6) or purple gradients on white
- Apple design mimicry or glass morphism (unless Liquid Glass is explicitly the direction)
- Cookie-cutter layouts that look AI-generated
- Animations that delay user actions
- Pure black (#000000) in dark mode
- `outline: none` without replacement focus styles
- Placeholder text as the only label
- Center-aligned numbers in data tables
- HSL for color — use OKLCH
- Animate `width`, `height`, `margin`, or `padding`
- Ship without `prefers-reduced-motion` support

---

## When to Break the Rules

Break them when: client brand uses a "banned" font, the aesthetic demands a "forbidden" pattern, or you have a stronger idea. **Rule-breaking checklist:** Is it conscious, not lazy? Does it serve the user/brand/context? Can you explain the creative intent? If yes → break it confidently.

---

## Creative Reframing (When Stuck)

**Designer lens:** "What would Sagmeister do?" · "Neville Brody?" · "Studio Dumbar?" · "Dieter Rams?" · "David Carson?"

**Context shift:** "What if this was a magazine spread?" · "A museum exhibit?" · "Street signage?" · "A vinyl record cover?"

**Era lens:** "1960s Swiss International?" · "1990s Emigre/Ray Gun?" · "1920s Bauhaus?" · "2000s Flash era?"

---

## Reference Files

Read these for detailed specs when needed:
- `references/TYPOGRAPHY.md` — Font selection, scales, pairing, fluid type, variable fonts
- `references/COLOR.md` — Color architecture, 60-30-10, dark mode, psychology, accessibility
- `references/MOTION-SPEC.md` — Easing curves, durations, animation patterns, performance
- `references/ACCESSIBILITY.md` — WCAG 2.2, semantic HTML, ARIA, keyboard nav, legal requirements
- `references/RESPONSIVE.md` — Breakpoints, mobile-first, container queries, fluid layouts
- `references/RESPONSIVE-DESIGN.md` — Additional responsive patterns and mobile strategies
- `references/COMPONENTS.md` — Buttons, forms, navigation, modals, tables, dashboards, loading states
- `references/DESIGN-SYSTEM-TEMPLATE.md` — Meta-framework for fixed vs. project-specific vs. adaptable elements

## Integration with Other Skills

- **core-components**: Use for token architecture, component composition patterns, and design system setup
- **react-ui-patterns**: Use for UI state patterns (loading, error, empty states) inside designed interfaces
- **testing-patterns**: Snapshot tests sparingly for design regression; prefer visual regression tools
- **design-audit**: Use for auditing existing designs against quality standards
- **web-design-guidelines**: Use for design compliance reviews and guideline enforcement
- **controlled-ux-designer**: Use when collaborative design decisions are needed before coding

## Troubleshooting

- **Fonts not loading**: Check CORS headers on font files, ensure WOFF2 format, verify `font-display: swap` is set
- **OKLCH colors not rendering**: Falls back to sRGB in older browsers. Provide `@supports` fallbacks.
- **Scroll-driven animations not working**: Chrome 116+ and Safari 26+ required. Use Intersection Observer as fallback.
- **View Transitions glitchy**: Ensure unique `view-transition-name` per element. Debug with Chrome DevTools Animation panel.
- **Container queries ignored**: Verify parent has `container-type: inline-size` set
- **Dark mode contrast issues**: Re-check semantic token mappings. Desaturate accent colors 20-30% for dark backgrounds.
- **Touch targets too small on mobile**: Use `min-height: 44px; min-width: 44px` on all interactive elements
- **CLS (Cumulative Layout Shift)**: Reserve space for dynamic content, set explicit `width`/`height` on images, use `font-display: optional` for non-critical fonts
