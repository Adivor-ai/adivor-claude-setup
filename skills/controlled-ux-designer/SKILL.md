---
name: controlled-ux-designer
description: Expert UI/UX design guidance for unique, accessible interfaces with research-backed decision-making. Use this skill when the user asks to build web components, pages, or applications — including websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI. Also trigger for visual decisions about colors, typography, layouts, spacing, animation, responsive design, accessibility, dark mode, data tables, forms, navigation, loading states, or any design system question. Always ask before making design decisions. Generates creative, polished, WCAG-compliant code that avoids generic AI aesthetics. Covers the full spectrum from single buttons to full application architecture. Do NOT use for design audits of existing code (use design-audit), code compliance reviews (use web-design-guidelines), or when the user already has a clear design direction and just needs code (use frontend-designer).
---

# UX Designer

Expert UI/UX design skill that creates unique, accessible, research-backed interfaces. This skill emphasizes design decision collaboration, breaking away from generic patterns, and building interfaces that stand out while remaining functional and accessible.

## Core Protocol

**CRITICAL: Design Decision Protocol**
- **ALWAYS ASK** before making any design decisions (colors, fonts, sizes, layouts)
- Never implement design changes until explicitly instructed
- Present alternatives with trade-offs, not single "correct" solutions
- The guidelines below are practical guidance for when decisions are approved

## Quick Reference: Design Thinking Sequence

Before coding, run through this sequence:

1. **Purpose** — What problem does this solve? Who uses it?
2. **Tone** — Pick a bold direction: brutally minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial, etc.
3. **Differentiation** — What makes this UNFORGETTABLE? What's the one thing users will remember?
4. **Constraints** — Framework, performance budget, accessibility tier, device targets
5. **Approval** — Present 2-3 alternatives with rationale before implementing

## Visual Hierarchy

Visual hierarchy determines the order users process information. Use five core tools: **size, color/contrast, typography, position, and whitespace**.

**Research-backed rules:**
- No more than 3 size variations and 3 contrast levels for clear primary/secondary/tertiary tiers
- Headlines should be 2-3× body text size (16px body → 32-48px headings)
- Users scan in **F-pattern** (content-heavy pages) or **Z-pattern** (minimal landing pages) — place key messages along these paths
- The **squint test**: squint at your design — the most important elements should still be distinguishable
- The **grayscale test**: remove all color — hierarchy should work through structure alone
- Limit each page to roughly **15 points of attention** (Paul Boag's heuristic)

**Gestalt principles for spatial organization:**
- **Proximity** is the most powerful grouping — items close together are perceived as related (chunking a 12-field form into 3 groups of 4 feels dramatically less daunting)
- **Similarity** — shared visual characteristics imply relationship
- **Continuity** — elements on a line are perceived as connected
- **Closure** — the mind fills gaps to complete patterns
- **Figure-ground** — distinguishing foreground from background (critical for modals)

## Color System

**Architecture — every interface needs two color roles:**

1. **Base/Neutral Palette (4-5 colors):**
   - Backgrounds (lightest), surfaces, borders, secondary text, primary text
   - Use slightly desaturated warm or cool greys based on brand intent

2. **Accent Palette (1-3 colors):**
   - Primary CTA, status indicators, focus/hover states
   - Use saturated colors for clear contrast against neutrals

**The 60-30-10 Rule:**
- 60% dominant/background color (neutral)
- 30% secondary supporting color
- 10% accent — CTAs, key interactive elements, highlights
- Scarcity of accent color is what makes it magnetic (Spotify's green appears only on Play and active toggles)

**Color Application Rules:**
- Backgrounds: Lightest neutral
- Primary text: Darkest neutral (slate-900), secondary: mid-tone (slate-600)
- Primary buttons: Accent color with white text
- Secondary buttons: Neutral with border and dark text
- Status: green=success, red=error, amber=warning, blue=info
- Hover: darken 10-15% or shift hue slightly
- Focus: ring/outline in accent color
- Disabled: reduce opacity to 40-50%, remove hover

**Accessibility (non-negotiable):**
- WCAG 2.1 AA: minimum **4.5:1** for normal text, **3:1** for large text (18pt+ or 14pt+ bold)
- UI components and graphical objects: **3:1** against adjacent colors
- Pure red (#FF0000) on white = only 4:1 — barely passes for large text
- Pure green (#00FF00) on white = 1.4:1 — fails entirely
- Never rely on color alone — pair with icons, labels, or shape changes
- ~8% of men are colorblind (~300M people worldwide)
- Blue + orange combination remains distinguishable across most color vision deficiency types

**Dark Mode (not a simple inversion):**
- Never use pure black (#000000) — causes halation for users with astigmatism. Use **#121212** (Material Design recommendation)
- Text: avoid pure white — use #E0E0E0 for softer contrast while meeting WCAG
- Desaturate accent colors by 20-30% for dark backgrounds (vibrant colors cause eye strain)
- Depth comes from progressively lighter surface colors (4-5 elevation levels), not shadows

**Unique Color Strategy (avoid generic AI aesthetics):**
- Avoid default SaaS blue (#3B82F6) unless it fits the brand
- Consider unexpected neutrals: warm greys, soft off-whites, deep charcoals
- Pair neutrals with distinctive accents: terracotta + charcoal, sage + navy, coral + slate
- Test against "does this look AI-generated?" filter

## Typography

**Font Selection Philosophy:**
- **Headlines/Display**: Prioritize emotion, personality, attention
- **Body Text**: Prioritize legibility, reading comfort, accessibility
- **UI/Labels**: Prioritize clarity, scannability, consistency
- Use 2-3 typefaces maximum, limit to 3 weights per typeface
- Prefer variable fonts for fine-tuned control and performance
- High x-height, consistent stroke widths, clear I/l/1/O/0 distinction

**NEVER** default to generic AI choices (Inter, Roboto, Arial, system fonts for display). Choose fonts with character that serve the brand's purpose.

**Typographic Scale (mathematical ratios):**
- Major Third (1.250): versatile default for most UI
- Perfect Fourth (1.333): dramatic headlines, marketing sites
- Minor Third (1.125-1.200): dense dashboards, product interfaces
- Base size: 16px (1rem) — Apple HIG uses 17pt default

**Spacing & Readability:**
- Line height: **1.5-1.6** for body (browser default 1.2 is too tight), **1.1-1.2** for headings, up to **1.8-2.0** for dyslexia accommodation
- WCAG 1.4.12 requires line height ≥ 1.5× font size
- Optimal line length: **55-75 characters per line**
- Letter spacing: tighten headlines (-0.02em to -0.01em), open small text (+0.02em to +0.05em), all-caps always gets +0.05em to +0.1em

**Fluid Typography (modern standard):**
```css
font-size: clamp(1.5rem, 1rem + 3vw, 3rem);
```
Always combine `rem` + `vw` in the preferred value (never pure `vw`) so text scales when users zoom.

**Font Pairing Logic:**
- Serif + Sans-serif (editorial, trustworthy)
- Geometric + Humanist (modern + warm)
- Display + System (distinctive + efficient)
- Bold sans headlines + Light sans body (modern, clean)

## Layout & Spacing

**The 8px Grid (industry standard):**
- All spacing, sizing, padding, margins use multiples of 8 (8, 16, 24, 32, 40, 48, 64px)
- 4px sub-grid for fine adjustments (icon alignment)
- Token scale: XS(4px), S(8px), M(16px), L(24px), XL(32px), 2XL(48px), 3XL(64px)

**12-Column Grid:**
- Standard for web (divisible by 1, 2, 3, 4, 6, 12)
- Desktop: 12 columns → Tablet: 8 → Mobile: 4
- Gutters: 16px (mobile), 24px (tablet/desktop)
- Max container widths: 960px laptop, 1200px desktop, 1400px large displays

**CSS Grid vs Flexbox:**
- **Flexbox**: one-dimensional (row or column), content-first — nav bars, button groups, card rows, centering
- **CSS Grid**: two-dimensional (rows + columns), layout-first — page skeletons, dashboards, galleries
- Common pattern: Grid for page structure, Flexbox within components
- `repeat(auto-fit, minmax(250px, 1fr))` for automatic responsive reflow without media queries

**Container Queries (full browser support 2025):**
- Components respond to parent container dimensions, not viewport
- Best practice: media queries for macro layout (page columns), container queries for micro layout (component reflow)

**Mobile-First Design:**
- Start with mobile styles, progressively enhance with `min-width` media queries
- 63% of users abandon sites due to mobile usability issues
- Content breakpoints > rigid device breakpoints
- Common breakpoints: 480px, 768px, 1024px, 1280px, 1536px

## Component Patterns

**Buttons:**
- Only ONE primary (filled) button per page section — 48% of e-commerce sites neglect proper hierarchy (Baymard Institute)
- 6 distinct states: default, hover, pressed, focused, disabled, loading
- Touch targets: **44×44px** minimum (Apple HIG), **48×48px** (Material Design), WCAG 2.2 AA minimum **24×24px** with spacing

**Forms:**
- Following usability guidelines nearly doubles first-attempt completion (78% vs 42%, CHI research)
- EAS framework: Eliminate unnecessary fields, Automate what can be inferred, Simplify remaining
- Labels OUTSIDE input fields — never rely on placeholder text alone (NNGroup)
- Single-column layouts (endorsed by Wroblewski, NNGroup, Material Design, Apple HIG)
- Error messages near the field with both color AND icons, explaining how to fix

**Navigation:**
- Visible navigation consistently outperforms hidden navigation across all UX metrics (NNGroup, 179 participants)
- Desktop: never use hamburger when space permits; "combo" approach (some visible, overflow in menu) performs best
- Mobile: bottom navigation for 3-5 top-level destinations in thumb zone
- Persistent collapsible sidebars with icons-only mode for large applications

**Modals:**
- Only for: critical confirmations, focused short tasks, required acknowledgments
- Never for: non-critical info or unsolicited content
- Focus must be trapped within modal, returned to trigger element on close
- Mobile: bottom sheets often feel more natural than centered modals

**Landing Pages:**
- Must answer "What's in it for me?" within 50ms
- Formula: benefit-driven headline + supporting subtext + single clear CTA + supporting visual
- Multiple competing CTAs decrease conversion by up to 266%
- Social proof delivers 19-34% conversion lift near CTAs

**Dashboards:**
- Average SaaS dashboard: 67 data points vs cognitive capacity of ~7±2 chunks
- Progressive disclosure: surface key metrics, detailed analysis behind intuitive navigation
- Overview <40% information density → 63% faster pattern recognition
- Poorly designed dashboards: 23% higher churn, 40% lower feature adoption

**Data Tables:**
- Left-align text, right-align numbers, never center-align
- Monospace or tabular figures for number alignment
- Mobile strategies: stack rows into cards, column toggling, or horizontal scroll with fixed first column

**Loading States (time-based framework):**
- <1s: no indicator needed
- 1-10s: skeleton screens (shimmer animation) or spinners
- >10s: progress bar with duration estimates

## Animation & Motion

**Purposeful Animation — every animation must serve a function:**
- Orient users during navigation changes
- Establish relationships between elements
- Provide interaction feedback
- Guide attention to important changes

**Timing Guidelines:**
- Micro-interactions (button press, toggle): 100-150ms
- State changes (accordion, tab switch): 200-300ms
- Page transitions (route changes, modal open): 300-500ms
- Attention-directing (notification, error): 200-400ms

**Easing:**
- ease-out for entrances: `cubic-bezier(0.0, 0.0, 0.2, 1)`
- ease-in for exits: `cubic-bezier(0.4, 0.0, 1, 1)`
- ease-in-out for transitions: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- Avoid linear easing (feels robotic) except continuous loops

**Performance (non-negotiable):**
- Only animate `transform` and `opacity` (GPU-accelerated)
- Never animate `width`, `height`, `top`, `left`, `margin` (causes reflow)
- Respect `prefers-reduced-motion` — ~35% of adults over 40 affected by motion sensitivity
- Prefer CSS animations over JS for simple transitions

**Background animations (CSS/SVG):** slow, looping, subtle — add atmosphere without distraction.

For detailed motion specs, easing curves, and state-specific patterns, see `./references/MOTION-SPEC.md`.

## Accessibility (Foundation, Not Feature)

**WCAG 2.2 (published Oct 2023): 86 success criteria across three levels. Target Level AA.**

**Key requirements:**
- 2.5.8 Target Size: interactive targets ≥ 24×24 CSS pixels (AA)
- 2.4.11 Focus Not Obscured: focused elements not hidden behind sticky headers
- 2.5.7 Dragging Movements: single-pointer alternatives for all drag interactions
- 3.3.8 Accessible Authentication: no cognitive function tests (CAPTCHAs) as sole auth method

**Semantic HTML before ARIA:**
- Pages with ARIA averaged **41% more detected errors** than those without (WebAIM study of 1M+ homepages)
- W3C's first ARIA rule: "If you can use native HTML, do so"
- Use `<button>` not `<div role="button">`, `<nav>` not `<div role="navigation">`
- Never remove focus indicators (`outline: none`) — enhance them (2px+ thickness, 3:1 contrast)

**The Inclusive Design Spectrum (Microsoft):**
- Permanent (one arm), temporary (arm injury), situational (holding a baby) — all face similar challenges
- Solutions for one benefit all — the "curb cut effect"
- Keyboard nav for motor disabilities → power user efficiency
- Alt text for screen readers → improved SEO
- Captions for deaf users → serve gym-goers, commuters, non-native speakers

**Legal context:**
- European Accessibility Act: enforcement began June 28, 2025, penalties up to €500,000
- US: DOJ April 2024 rule references WCAG 2.1 AA for Title II
- ADA lawsuits average $25K-$100K+ to settle

**Testing:**
- No automated tool catches more than ~40% of issues
- Required supplements: keyboard-only testing + screen reader testing (NVDA/VoiceOver)
- Chrome DevTools Lighthouse, WAVE extension, axe DevTools

For full implementation patterns (ARIA, keyboard nav, focus management, forms, screen reader content), see `./references/ACCESSIBILITY.md`.

## Styling Implementation

**Component Library:**
- Strongly prefer shadcn components (v4, `@/components/ui`)
- Import individually: `import { Button } from "@/components/ui/button";`
- Avoid creating custom components that clash with shadcn names

**Styling Engine:**
- Tailwind utility classes exclusively
- Adhere to CSS custom properties in `index.css`
- Inline styles or CSS modules only when absolutely necessary

**Icons:** `@phosphor-icons/react` — use color for plain icon buttons, don't override default size/weight unless requested

**Notifications:** `sonner` for toasts

**Loading:** Always add loading states, spinners, skeleton animations

**Spacing Strategy:**
- Grid/flex wrappers with `gap` for spacing
- Prioritize wrappers over direct margins/padding on children

## 2025-2026 Trends

**Task-Oriented AI Patterns:** Moving away from chat-first toward visual node connections, structured templates, and semantic canvases. Google's Generative UI (Nov 2025) creates entire interactive experiences. NNGroup declared 2026 "the year of AI fatigue" — thoughtful > gimmicky.

**Liquid Glass (Apple):** Physically accurate lensing and refraction across all Apple platforms. Prediction: glassmorphism fully replaces flat design as dominant aesthetic by 2026-2027. CSS `backdrop-filter` has broad browser support.

**W3C Design Tokens (2025.10):** First stable vendor-neutral JSON format for tokens. Supports Display P3, Oklch color spaces. Implementation: Tokens Studio, Style Dictionary, Figma Variables.

**Bento Grid Layouts:** Carousel slides <1% click rates; bento grids surface more content in modular blocks.

**Motion as Component System:** Tied to design tokens. Motion library (formerly Framer Motion): 16M+ npm downloads monthly.

## Design Inspiration Sources

Draw from, don't copy:
- Modern landing pages: Perplexity, Comet Browser, Dia Browser
- Framer templates and innovative approaches
- Leading brand studios
- Historical movements (Bauhaus, Otl Aicher, Braun) — as inspiration, not imitation
- Leading design systems: Linear (keyboard-first, opinionated), Stripe (calm technology), Airbnb DLS (platform-agnostic), IBM Carbon (50% dev time reduction), Shopify Polaris (30% design time reduction)

## Design Decision Checklist

Before presenting any design, verify:

1. **Purpose**: Does every element serve a clear function?
2. **Hierarchy**: Is visual importance aligned with content importance?
3. **Consistency**: Do similar elements look and behave similarly?
4. **Accessibility**: Meets WCAG 2.2 AA? (contrast, touch targets, keyboard nav, semantic HTML)
5. **Responsiveness**: Works on mobile, tablet, desktop?
6. **Uniqueness**: Breaks from generic SaaS/AI-generated patterns?
7. **Performance**: Only animating transform/opacity? Respecting prefers-reduced-motion?
8. **Approval**: Have I asked before implementing colors, fonts, sizes, layouts?

## Reference Files

For detailed implementation patterns beyond this overview:

- `./references/ACCESSIBILITY.md` — Full WCAG implementation: semantic HTML, ARIA, keyboard nav, focus management, forms, screen reader content, testing checklists
- `./references/DESIGN-SYSTEM-TEMPLATE.md` — Meta-framework for fixed/project-specific/adaptable elements, project kickoff template, complete system examples
- `./references/MOTION-SPEC.md` — Easing curves, duration tables, state-specific animations (hover, focus, active, loading, success, error), Gestalt motion principles, performance checklist
- `./references/RESPONSIVE.md` — Mobile-first implementation, breakpoint strategy, responsive typography, touch interfaces, navigation patterns, form layouts, performance optimization

Read the relevant reference file when you need detailed implementation guidance for that domain.

## Troubleshooting

### User doesn't provide enough design context
Ask the four design thinking questions upfront: (1) Purpose — what problem does this solve and who uses it? (2) Tone — pick a bold direction (minimal, maximalist, retro, organic, luxury, playful). (3) Differentiation — what makes this unforgettable? (4) Constraints — framework, performance, accessibility tier, device targets. Document answers before sketching alternatives.

### Design alternatives look too similar
Vary across different dimensions, not just color swaps. Try: different layouts (stacked vs grid), different color temperatures (warm vs cool), different typographic hierarchies, or different visual densities. Each alternative should feel like a distinct choice, not a minor tweak.

### Accessibility conflicts with visual design
Accessibility is the foundation, not a constraint to work around. Find creative solutions within it: high contrast doesn't mean boring (use distinctive colors like terracotta + charcoal instead of gray + white). Larger touch targets can feel premium (generous spacing = luxury). Test with axe or WAVE; don't remove focus indicators — enhance them instead.

### User keeps changing design direction mid-project
Document each approved decision and reference it when direction shifts. Create a lightweight decision log: "We chose brutalist design (Nov 2) → sans-serif typography (Nov 3) → 60-30-10 color rule (Nov 5)." This provides continuity and prevents restarting from scratch.

## Version History

- v2.0.0: Major enhancement with research-backed data, quantitative benchmarks, 2025-2026 trends, expanded component guidance, legal accessibility context, progressive disclosure via reference files
- v1.0.0 (2025-10-18): Initial release

## Integration with Other Skills

- **frontend-designer**: Once design decisions are approved, hand off to frontend-designer for production-grade implementation
- **core-components**: Use core-components for token architecture, design system setup, and component composition patterns
- **design-audit**: For auditing existing interfaces rather than building new ones
