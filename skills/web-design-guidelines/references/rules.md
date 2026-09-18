# UI Compliance Rules Reference

Complete rule set for the four-layer UI compliance review. Each rule includes its layer, severity default, and what to flag.

---

## Table of Contents

1. [Layer 1 — Token & Value Audit](#layer-1--token--value-audit)
2. [Layer 2 — Structure & Semantics](#layer-2--structure--semantics)
   - Accessibility
   - Focus States
   - Forms
   - Semantic HTML
   - Heading Hierarchy
3. [Layer 3 — Visual & Interaction Rules](#layer-3--visual--interaction-rules)
   - Animation & Motion
   - Typography & Content
   - Images & Media
   - Performance
   - Navigation & State
   - Touch & Interaction
   - Safe Areas & Layout
   - Dark Mode & Theming
   - Locale & i18n
   - Responsive Design
   - Hydration Safety (SSR frameworks)
4. [Layer 4 — Design System Governance](#layer-4--design-system-governance)
   - Component Consistency
   - State Coverage
   - Naming Alignment
   - Design Drift Indicators
5. [Anti-patterns (always flag)](#anti-patterns-always-flag)

---

## Layer 1 — Token & Value Audit

**Purpose**: Catch hardcoded design values that should reference tokens/variables. This is the highest-ROI automated check — Shopify reports 50% reduction in design QA time after enforcing token usage via Stylelint Polaris.

### Colors 🟡
- Flag hardcoded `#hex`, `rgb()`, `rgba()`, `hsl()`, `hsla()` values in CSS/style props
- Exception: `transparent`, `currentColor`, `inherit`, `0 0 0 / 0` (fully transparent) are OK
- Suggest semantic token: `var(--color-text-primary)`, `var(--color-bg-surface)`, etc.
- In Tailwind: flag raw `bg-[#xxx]` or `text-[#xxx]` arbitrary values — prefer configured palette classes

### Spacing 🟡
- Flag hardcoded `margin`, `padding`, `gap` values that don't align with a spacing scale (4px/8px grid)
- Exception: `0`, `auto`, `100%` are OK
- In Tailwind: flag arbitrary spacing `p-[13px]` — prefer scale values `p-3`, `p-4`
- Suggest token: `var(--space-2)`, `var(--space-4)`, etc.

### Typography 🟡
- Flag hardcoded `font-size`, `line-height`, `letter-spacing`, `font-weight` values
- Suggest semantic tokens: `var(--font-size-body)`, `var(--font-weight-bold)`, etc.
- In Tailwind: flag arbitrary `text-[17px]` — prefer configured scale `text-sm`, `text-base`

### Z-index 🟡
- Flag raw numeric z-index values (`z-index: 999`, `z-index: 50`)
- Suggest token: `var(--z-dropdown)`, `var(--z-modal)`, `var(--z-toast)`, etc.
- In Tailwind: flag arbitrary `z-[999]` — prefer configured z-scale

### Shadows 🟡
- Flag hardcoded `box-shadow` values
- Suggest token: `var(--shadow-sm)`, `var(--shadow-md)`, etc.
- In Tailwind: flag arbitrary shadow values — prefer `shadow-sm`, `shadow-md`

### Border Radius 🟡
- Flag hardcoded `border-radius` values
- Suggest token: `var(--radius-sm)`, `var(--radius-md)`, etc.

### Transitions & Durations 🟡
- Flag hardcoded `transition-duration`, `animation-duration` values
- Suggest motion tokens: `var(--duration-fast)`, `var(--duration-normal)`, `var(--ease-out)`, etc.

### Breakpoints 🟡
- Flag hardcoded media query breakpoint values (`@media (min-width: 768px)`)
- Suggest token/mixin usage or configured Tailwind breakpoints

---

## Layer 2 — Structure & Semantics

### Accessibility 🔴

- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Interactive elements need keyboard handlers (`onKeyDown`/`onKeyUp`) in addition to mouse/pointer events
- Use `<button>` for actions, `<a>`/`<Link>` for navigation — never `<div onClick>`
- Images need `alt` (or `alt=""` if decorative)
- Decorative icons need `aria-hidden="true"`
- Async updates (toasts, validation, live regions) need `aria-live="polite"` (or `"assertive"` for errors)
- Use semantic HTML (`<button>`, `<a>`, `<label>`, `<table>`, `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`) before ARIA roles
- Headings must be hierarchical `<h1>`–`<h6>` — no skipped levels
- Include skip link for main content: `<a href="#main" class="sr-only focus:not-sr-only">`
- `scroll-margin-top` on heading anchors (prevents fixed header overlap)
- Color must not be the only way to convey information (add icons, text, or patterns)
- Contrast ratios: 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- Touch targets: minimum 44×44px (WCAG 2.5.5)
- Do not disable browser zoom (see anti-patterns)
- Modals need focus trap and return focus to trigger on close
- `role="dialog"` and `aria-modal="true"` on modal containers
- Tables need `<caption>`, `<thead>`, `<th scope>` for data tables

### Focus States 🔴

- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent outline
- Never `outline-none` / `outline: none` without a visible focus replacement
- Use `:focus-visible` over `:focus` (avoids focus ring on mouse click, shows on keyboard)
- Group focus with `:focus-within` for compound controls (e.g., search bar with button)
- Focus order must follow visual order (no `tabindex > 0`)
- `tabindex="-1"` for programmatically focusable but not tab-reachable elements
- Skip links should become visible on focus

### Forms 🔴/🟡

- 🔴 Labels: every input needs a `<label>` with `htmlFor`/`for` or wrapping the control
- 🔴 Never block paste (`onPaste` + `preventDefault`) — flag as anti-pattern
- 🟡 Inputs need `autocomplete` attribute with correct value and meaningful `name`
- 🟡 Use correct `type` (`email`, `tel`, `url`, `number`, `search`) and `inputmode`
- 🟡 Labels clickable: `htmlFor` matches input `id`, or label wraps control
- 🟡 Disable spellcheck on emails, codes, usernames: `spellCheck={false}`
- 🟡 Checkboxes/radios: label + control share single hit target (no dead zones between)
- 🟡 Submit button stays enabled until request starts; show spinner/loading during request
- 🟡 Errors inline next to fields; focus first error field on submit
- 🟡 Placeholders end with `…` and show example pattern (not used as label substitute)
- 🟡 `autocomplete="off"` on non-auth fields to avoid password manager false triggers
- 🟡 Warn before navigation with unsaved changes (`beforeunload` or router guard)
- 🟡 File inputs: show accepted formats and max size; handle drag-and-drop

### Semantic HTML 🟡

- `<nav>` for navigation menus, with `aria-label` if multiple navs
- `<main>` for primary content (exactly one per page)
- `<aside>` for supplementary content
- `<header>` and `<footer>` for page/section headers/footers
- `<article>` for self-contained content blocks
- `<section>` with heading for thematic groups
- `<dl>` / `<dt>` / `<dd>` for definition lists and key-value pairs
- `<time datetime="...">` for dates and times
- `<abbr title="...">` for abbreviations
- `<blockquote cite="...">` for quotations
- Avoid `<div>` soup — if an element has semantic meaning, use the right tag

---

## Layer 3 — Visual & Interaction Rules

### Animation & Motion 🟡

- Honor `prefers-reduced-motion`: provide reduced variant or disable animation entirely
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```
- Animate only `transform` and `opacity` (compositor-friendly, avoids layout thrash)
- Never `transition: all` — list properties explicitly (`transition: opacity 200ms, transform 200ms`)
- Set correct `transform-origin` for scale/rotate animations
- SVG animations: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`
- Animations must be interruptible — respond to user input mid-animation
- Avoid flashing content (3 flashes/second limit — WCAG 2.3.1)
- Use `will-change` sparingly and only on elements about to animate (remove after)

### Typography & Content 🟡

- Use proper ellipsis `…` not three dots `...`
- Use curly quotes `"` `"` `'` `'` not straight quotes `"` `'`
- Non-breaking spaces for units and keyboard shortcuts: `10&nbsp;MB`, `⌘&nbsp;K`
- Loading states end with `…`: `"Loading…"`, `"Saving…"`, `"Uploading…"`
- `font-variant-numeric: tabular-nums` on number columns, counters, prices
- `text-wrap: balance` or `text-wrap: pretty` on headings (prevents orphan/widow words)
- Text containers handle overflow: `truncate`, `line-clamp-*`, or `overflow-wrap: break-word`
- Flex children need `min-w-0` (or `min-width: 0`) to allow text truncation
- Handle empty states — don't render broken UI for empty strings/arrays/null
- User-generated content: anticipate and handle short, average, and extremely long inputs
- Avoid long words breaking layout: use `hyphens: auto` or `overflow-wrap: anywhere` where needed

### Content & Copy 🔵

- Active voice: "Install the CLI" not "The CLI will be installed"
- Title Case for headings and button labels (Chicago style)
- Numerals for counts: "8 deployments" not "eight deployments"
- Specific button labels: "Save API Key" not "Continue" or "Submit"
- Error messages include fix/next step, not just the problem: "File too large. Max size is 5MB." not just "Upload failed"
- Use second person ("your", "you") — avoid first person ("I", "my")
- `&` over "and" where space-constrained (tabs, compact UI)
- Confirmation dialogs: action button matches the action ("Delete project" not "OK")

### Images & Media 🟡

- `<img>` needs explicit `width` and `height` attributes (prevents CLS — Cumulative Layout Shift)
- Below-fold images: `loading="lazy"`
- Above-fold critical images: `fetchpriority="high"` (or framework equivalent like `priority`)
- Use `<picture>` with `<source>` for responsive images / format fallbacks (WebP → JPEG)
- SVG icons: inline for styling control, `<img>` for static/decorative; always with `aria-hidden` if decorative
- Avatar / user images: provide fallback (initials, placeholder) for missing images
- Background images: provide solid background-color fallback during load

### Performance 🟡/🔵

- 🟡 Large lists (>50 items): virtualize with `virtua`, `react-window`, `@tanstack/virtual`, or `content-visibility: auto`
- 🟡 No layout reads in render: avoid `getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `scrollTop` during render/paint
- 🟡 Batch DOM reads then writes — avoid interleaving reads/writes (causes forced reflows)
- 🟡 Prefer uncontrolled inputs for non-validated fields; controlled inputs must keep per-keystroke processing cheap
- 🔵 Add `<link rel="preconnect">` for CDN and third-party asset domains
- 🔵 Critical fonts: `<link rel="preload" as="font" crossorigin>` with `font-display: swap` (or `optional`)
- 🔵 Debounce search/filter inputs (150–300ms typical)
- 🔵 Use `loading="lazy"` on `<iframe>` embeds below the fold
- 🔵 Code-split heavy components with lazy loading (`React.lazy`, dynamic `import()`)

### Navigation & State 🟡

- URL reflects UI state: filters, tabs, pagination, sort, expanded panels in query params
- Links use `<a>` / `<Link>` — must support Cmd/Ctrl+click and middle-click (new tab)
- Deep-link all stateful UI: if it uses `useState`/`ref` for user-visible state, consider URL sync
- Destructive actions need confirmation modal or undo window — never immediate deletion
- Back/forward browser navigation must work correctly (no broken history entries)
- Loading states during navigation transitions (skeleton screens or progress bar)

### Touch & Interaction 🟡

- `touch-action: manipulation` on interactive areas (prevents 300ms double-tap zoom delay)
- `-webkit-tap-highlight-color` set intentionally (transparent or themed)
- `overscroll-behavior: contain` in modals, drawers, sheets, scroll containers
- During drag operations: disable text selection (`user-select: none`), `inert` on dragged elements
- `autoFocus` sparingly — desktop only, single primary input; avoid on mobile (keyboard popup)
- Click targets: minimum 44×44px (WCAG), 48×48dp (Material Design) for touch
- Hover states: must have non-hover alternative for touch devices (hover not reliable on mobile)

### Safe Areas & Layout 🟡

- Full-bleed layouts need `env(safe-area-inset-*)` for notch/Dynamic Island avoidance
- Avoid unwanted scrollbars: `overflow-x: hidden` on body/container when horizontal scroll not intended
- Prefer CSS flex/grid over JS measurement for layout
- Avoid `100vh` on mobile — use `100dvh` (dynamic viewport height) or `min-height: 100svh`
- Sticky elements: account for multiple sticky areas stacking (`top` values must coordinate)
- Fixed-position elements: test with virtual keyboards, browser chrome, and safe areas

### Dark Mode & Theming 🟡

- `color-scheme: dark` on `<html>` when dark theme active (fixes scrollbar, inputs, form controls)
- `<meta name="theme-color" content="...">` matches page background (updates browser chrome)
- Native `<select>`, `<input>`: set explicit `background-color` and `color` (Windows dark mode renders white-on-white otherwise)
- Use semantic color tokens (`--color-bg-primary`, `--color-text-primary`) not raw colors — theme switch should only change token values
- Test both themes: check images, shadows, borders, dividers — some need different values per theme
- Avoid pure black `#000` backgrounds in dark mode — prefer `#111`, `#0a0a0a`, or `hsl(0 0% 7%)` for reduced eye strain
- `prefers-color-scheme` media query for auto-detection

### Locale & i18n 🟡

- Dates/times: use `Intl.DateTimeFormat` — never hardcoded format strings
- Numbers/currency: use `Intl.NumberFormat` — never hardcoded separators or symbols
- Detect language via `Accept-Language` header / `navigator.languages` — not IP geolocation
- `dir="auto"` or `dir="rtl"` support if content may include RTL scripts
- Pluralization: use proper plural rules (not just `count === 1 ? '' : 's'`)
- Date-relative displays ("2 hours ago") should use `Intl.RelativeTimeFormat`

### Responsive Design 🟡

- Mobile-first approach: base styles for mobile, `min-width` media queries for larger screens
- Test at all defined breakpoints (typically: 320px, 375px, 768px, 1024px, 1280px, 1440px)
- Text readability: maintain 45–75 character line length on wide screens (`max-width` on text containers)
- Navigation: collapsible/hamburger for mobile, expanded for desktop
- Tables: responsive strategy (horizontal scroll, card layout, or column hiding)
- Images: responsive with `srcset` and `sizes` attributes
- Touch targets: 44px minimum on mobile, can be smaller on desktop
- Font sizes: minimum 16px for body text on mobile (prevents iOS zoom on input focus)
- Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1">`

### Hydration Safety (SSR frameworks) 🟡

- Inputs with `value` need `onChange` handler (or use `defaultValue` for uncontrolled)
- Date/time rendering: guard against server/client mismatch (use `useEffect` for client-only timestamps)
- `suppressHydrationWarning` only where truly needed (random IDs, timestamps) — not as a blanket fix
- Avoid `typeof window !== 'undefined'` checks in render — use `useEffect` or `useLayoutEffect` instead
- `useId()` for SSR-safe unique IDs (React 18+)

---

## Layer 4 — Design System Governance

### Component Consistency 🟡

- Flag components that duplicate design system components (custom `<Button>` when system provides one)
- Flag near-identical variants: `ButtonPrimary`, `ButtonMain`, `ButtonNew` → should be one component with variants
- Component props should mirror design system API (if system uses `variant="primary"`, don't use `type="primary"`)
- Imported components should come from the design system package, not local copies

### State Coverage 🟡

Every interactive component should handle all relevant states. Flag missing:
- **Hover**: visual feedback on hover (buttons, links, cards, rows)
- **Active/Pressed**: visual feedback during click/tap
- **Focus**: visible focus indicator (see Focus States above)
- **Disabled**: distinct visual + `aria-disabled` or `disabled` attribute + no click handler
- **Loading**: skeleton, spinner, or progress indicator during async operations
- **Error**: error styling + error message for form inputs and async failures
- **Empty**: meaningful empty state for lists, tables, search results (not blank space)
- **Overflow/Truncation**: graceful handling when content exceeds expected length

### Naming Alignment 🔵

- Component names in code should match design file component names (e.g., Figma component "Card/Elevated" → `<CardElevated>` or `<Card variant="elevated">`)
- CSS class names or token references should match design token names
- File/folder structure should mirror component hierarchy in the design system

### Design Drift Indicators 🟡

These patterns indicate the team is drifting away from the design system:
- CSS `!important` overriding design system styles
- Inline styles that override component library values
- Wrapper `<div>` with custom styles around design system components to "fix" spacing/sizing
- Copy-pasted component code (detached from the source library)
- Multiple `.css` / `.module.css` files with overlapping selectors for the same component type
- Growing number of "one-off" components not in the design system

---

## Anti-patterns (always flag)

Flag these patterns regardless of context — they are universally problematic:

| Pattern | Severity | Fix |
|---------|----------|-----|
| `user-scalable=no` or `maximum-scale=1` | 🔴 | Remove — never disable browser zoom |
| `onPaste` + `preventDefault` | 🔴 | Remove — never block paste |
| `transition: all` | 🟡 | List properties explicitly |
| `outline: none` / `outline-none` without focus replacement | 🔴 | Add `focus-visible` ring or outline |
| `<div onClick>` / `<span onClick>` for actions | 🔴 | Use `<button>` |
| Inline `onClick` navigation without `<a>` | 🔴 | Use `<a>` / `<Link>` for navigation |
| Images without `width`/`height` | 🟡 | Add explicit dimensions |
| Large `.map()` without virtualization (>50 items) | 🟡 | Add virtualization |
| Form inputs without labels | 🔴 | Add `<label>` or `aria-label` |
| Icon buttons without `aria-label` | 🔴 | Add `aria-label` |
| Hardcoded date/number formats | 🟡 | Use `Intl.DateTimeFormat` / `Intl.NumberFormat` |
| `autoFocus` without justification | 🟡 | Remove or document reason |
| `cursor: pointer` on `<button>` | 🔵 | Unnecessary — browser default handles it |
| Nested interactive elements | 🔴 | `<button>` inside `<a>` or vice versa is invalid |
| Missing `key` prop in `.map()` renders | 🟡 | Add stable unique `key` |
| Index as `key` in dynamic lists | 🟡 | Use stable ID instead of array index |
| `dangerouslySetInnerHTML` without sanitization | 🔴 | Sanitize with DOMPurify or similar |
| Console.log left in production code | 🔵 | Remove or convert to proper logging |
| Commented-out code blocks | 🔵 | Remove — use version control |
| Empty `catch` blocks swallowing errors | 🟡 | Log or handle the error |

---

## Quick Reference: Severity Guide

| Severity | When to use | Examples |
|----------|-------------|---------|
| 🔴 Critical | Accessibility blocker, security issue, broken functionality | Missing labels, disabled zoom, XSS vector, blocked paste |
| 🟡 Warning | Design drift, missing state, hardcoded value, UX degradation | Hardcoded colors, missing hover state, no empty state, `transition: all` |
| 🔵 Info | Optimization, minor improvement, code quality | Preconnect hints, console.log cleanup, naming suggestions |
