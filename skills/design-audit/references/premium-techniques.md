# Premium Techniques Reference

Exact values, formulas, and implementation patterns for premium UI refinement. Reference this
file when specifying implementation details in audit findings. Every technique includes the
"why" (research/principle), the "what" (exact values), and the "how" (CSS/token spec).

---

## Table of Contents

1. Shadow & Elevation System
2. Animation & Motion Timing
3. Typography Scale & Line Height
4. Spacing System (8px Grid)
5. Color System & Dark Mode
6. Border Radius & Concentric Rule
7. Glassmorphism & Surface Effects
8. Texture & Noise Overlays
9. Focus States & Accessibility
10. Responsive Breakpoints & Fluid Values
11. Component State Matrix
12. Optical Alignment Corrections
13. Common Anti-Patterns (What to Flag)

---

## 1. Shadow & Elevation System

Premium shadows use two layers: a sharp key shadow (directional light) and a soft ambient
shadow (environmental light). Single box-shadows look flat.

### Recommended 6-Level Ramp

```
shadow.xs:   0 1px 2px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
shadow.sm:   0 1px 3px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.04)
shadow.md:   0 2px 4px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)
shadow.lg:   0 4px 8px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.06)
shadow.xl:   0 8px 16px rgba(0,0,0,0.10), 0 16px 32px rgba(0,0,0,0.08)
shadow.2xl:  0 16px 32px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.10)
```

### Dark Mode Shadow Ramp (increase opacity ~1.5–2x)

```
shadow.xs-dark:   0 1px 2px rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.10)
shadow.sm-dark:   0 1px 3px rgba(0,0,0,0.24), 0 2px 4px rgba(0,0,0,0.12)
shadow.md-dark:   0 2px 4px rgba(0,0,0,0.24), 0 4px 8px rgba(0,0,0,0.16)
shadow.lg-dark:   0 4px 8px rgba(0,0,0,0.28), 0 8px 16px rgba(0,0,0,0.16)
shadow.xl-dark:   0 8px 16px rgba(0,0,0,0.28), 0 16px 32px rgba(0,0,0,0.20)
shadow.2xl-dark:  0 16px 32px rgba(0,0,0,0.32), 0 32px 64px rgba(0,0,0,0.24)
```

### Usage by Component

| Component | Resting | Hover | Active/Pressed |
|-----------|---------|-------|----------------|
| Card | shadow.sm | shadow.md | shadow.xs |
| Button (elevated) | shadow.sm | shadow.md | shadow.xs |
| Dropdown/Select | shadow.lg | — | — |
| Popover/Tooltip | shadow.lg | — | — |
| Modal/Dialog | shadow.xl | — | — |
| Toast/Notification | shadow.xl | — | — |

### Transition

All shadow transitions: `box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)`.
Avoid transitioning shadows with too many layers — it can be GPU-intensive. For performance,
consider transitioning opacity of a pseudo-element instead.

---

## 2. Animation & Motion Timing

### Duration Tokens

```
motion.duration.instant:  0ms     (state changes, no animation)
motion.duration.fast:     100ms   (button feedback, toggle)
motion.duration.normal:   200ms   (standard transitions, hover)
motion.duration.moderate:  300ms   (expand/collapse, tab switch)
motion.duration.slow:     500ms   (page transitions, reveal)
motion.duration.slower:   700ms   (complex choreography, maximum)
```

### Easing Tokens

```
motion.easing.standard:   cubic-bezier(0.4, 0, 0.2, 1)   — general movement
motion.easing.enter:      cubic-bezier(0.0, 0, 0.2, 1)   — elements appearing
motion.easing.exit:       cubic-bezier(0.4, 0, 1, 1)     — elements leaving
motion.easing.spring:     cubic-bezier(0.34, 1.56, 0.64, 1) — playful bounce
motion.easing.linear:     linear                          — opacity fades only
```

### Common Patterns

**Fade in + slide up (list items, cards):**
```css
opacity: 0 → 1, translateY(8px) → translateY(0)
Duration: 200ms, Easing: motion.easing.enter
Stagger: +60–100ms per item (max 5 items, then batch)
```

**Fade out (removing elements):**
```css
opacity: 1 → 0
Duration: 150ms, Easing: motion.easing.exit
No translateY on exit (subtler than enter)
```

**Scale feedback (button press):**
```css
transform: scale(0.97) on :active
Duration: 100ms, Easing: motion.easing.standard
Return: 200ms (slower return feels more natural)
```

**Accordion expand:**
```css
max-height: 0 → auto (use grid-template-rows: 0fr → 1fr for modern approach)
Duration: 300ms, Easing: motion.easing.standard
Opacity: 0 → 1 with 50ms delay after height begins
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Individual component override: use instant opacity change instead of removing all feedback.

---

## 3. Typography Scale & Line Height

### Major Third Scale (ratio 1.250) — recommended for most UIs

From 16px base:

```
type.size.xs:     13px (0.8125rem)
type.size.sm:     14px (0.875rem) — half-step, use sparingly
type.size.base:   16px (1rem)
type.size.md:     18px (1.125rem) — half-step
type.size.lg:     20px (1.25rem)
type.size.xl:     25px (1.5625rem)
type.size.2xl:    32px (2rem)
type.size.3xl:    40px (2.5rem)
type.size.4xl:    48px (3rem) — hero/display only
```

### Perfect Fourth Scale (ratio 1.333) — for content-rich apps

From 16px base:

```
type.size.xs:     12px (0.75rem)
type.size.sm:     14px (0.875rem)
type.size.base:   16px (1rem)
type.size.lg:     21px (1.333rem)
type.size.xl:     28px (1.778rem)
type.size.2xl:    38px (2.369rem)
type.size.3xl:    50px (3.157rem)
```

### Line Height Tokens

```
type.leading.none:    1.0   — display text only, never body
type.leading.tight:   1.15  — headings ≥ 24px
type.leading.snug:    1.3   — subheadings, large text
type.leading.normal:  1.5   — body text (the standard)
type.leading.relaxed: 1.625 — small text, captions
type.leading.loose:   1.75  — extra-small text for readability
```

### Font Weight Tokens

```
type.weight.regular:   400 — body text
type.weight.medium:    500 — subtle emphasis, labels
type.weight.semibold:  600 — headings, buttons, navigation
type.weight.bold:      700 — primary headings only
```

Limit to 2–3 weights per project. More weights = more visual noise.

### Letter Spacing

```
type.tracking.tight:    -0.02em  — display/heading text (≥24px)
type.tracking.normal:    0em     — body text
type.tracking.wide:      0.05em  — all-caps labels, overlines
type.tracking.wider:     0.1em   — small all-caps, legal text
```

---

## 4. Spacing System (8px Grid)

### Token Scale

```
spacing.0:    0px
spacing.px:   1px      — borders, dividers only
spacing.0.5:  2px      — fine adjustment
spacing.1:    4px      — tight internal padding
spacing.2:    8px      — base unit
spacing.3:    12px     — compact padding
spacing.4:    16px     — standard padding
spacing.5:    20px     — medium padding
spacing.6:    24px     — standard gap
spacing.8:    32px     — section internal spacing
spacing.10:   40px     — section gap
spacing.12:   48px     — large section gap
spacing.16:   64px     — page section separation
spacing.20:   80px     — major section break
spacing.24:   96px     — hero/landing spacing
```

### Application Rules

| Context | Token | Notes |
|---------|-------|-------|
| Button internal padding (vertical) | spacing.2–spacing.3 | 8–12px |
| Button internal padding (horizontal) | spacing.4–spacing.6 | 16–24px |
| Card internal padding | spacing.4–spacing.6 | 16–24px |
| Card gap (between cards) | spacing.4–spacing.6 | Must be ≥ card padding |
| Form field spacing | spacing.4–spacing.5 | 16–20px between fields |
| Label to field gap | spacing.1–spacing.2 | 4–8px |
| Section heading to content | spacing.3–spacing.4 | 12–16px |
| Section to section | spacing.10–spacing.16 | 40–64px |
| Page padding (mobile) | spacing.4 | 16px |
| Page padding (desktop) | spacing.6–spacing.8 | 24–32px |
| Container max-width | 1280px | Common standard |

### The Proximity Rule

Internal spacing of a group ≤ external spacing between groups. Always.

```
Card padding: 24px  →  Card gap must be ≥ 24px
List item padding: 12px  →  Group separator must be ≥ 12px
```

---

## 5. Color System & Dark Mode

### Semantic Token Architecture

```
Light Mode:
  color.bg.primary:        #FFFFFF
  color.bg.secondary:      #F9FAFB
  color.bg.tertiary:       #F3F4F6
  color.text.primary:      #111827  (contrast ~19:1 on white)
  color.text.secondary:    #6B7280  (contrast ~5.7:1 on white)
  color.text.tertiary:     #9CA3AF  (contrast ~3.5:1 — large text/icons only)
  color.text.disabled:     #D1D5DB  (contrast ~2.1:1 — with disabled state styling)
  color.border.default:    #E5E7EB
  color.border.strong:     #D1D5DB

Dark Mode:
  color.bg.primary:        #121212
  color.bg.secondary:      #1E1E1E
  color.bg.tertiary:       #2A2A2A
  color.text.primary:      #E5E7EB  (not #FFFFFF — reduces glare)
  color.text.secondary:    #9CA3AF
  color.text.tertiary:     #6B7280
  color.text.disabled:     #4B5563
  color.border.default:    #374151
  color.border.strong:     #4B5563
```

### Accent Color Pairing

Use OKLCH for perceptually uniform palette generation. Generate 10 steps per hue:
50 (lightest), 100, 200, 300, 400, 500 (base), 600, 700, 800, 900 (darkest).

Ensure each step has predictable contrast against both light and dark backgrounds.

### Contrast Ratio Requirements

| Element | Minimum | Target | Standard |
|---------|---------|--------|----------|
| Body text (< 24px) | 4.5:1 | 7:1 | WCAG AA / AAA |
| Large text (≥ 24px) | 3:1 | 4.5:1 | WCAG AA / AAA |
| UI components / icons | 3:1 | 4.5:1 | WCAG 2.1 |
| Focus indicators | 3:1 | 4.5:1 | Adjacent contrast |
| Placeholder text | 4.5:1 | — | Often violated |

---

## 6. Border Radius & Concentric Rule

### Token Scale

```
radius.none:   0px
radius.sm:     4px    — small elements, badges, chips
radius.md:     8px    — buttons, inputs, small cards
radius.lg:     12px   — cards, modals, panels
radius.xl:     16px   — large cards, hero sections
radius.2xl:    24px   — pill shapes, special elements
radius.full:   9999px — circles, fully rounded pills
```

### The Concentric Rule

When a rounded element contains a rounded child, the outer radius must equal the inner
radius plus the padding between them:

```
outer-radius = inner-radius + padding

Example:
  Card padding: 16px
  Inner element radius: 8px
  Card radius must be: 8px + 16px = 24px (or use radius.2xl)
```

If the math doesn't work with existing tokens, the padding or inner radius should adjust.
Never violate concentricity — it creates a subtle visual wrongness.

---

## 7. Glassmorphism & Surface Effects

Use sparingly (≤ 3 glass elements per viewport). Never on buttons or inputs.

### Standard Glass Panel

```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(12px) saturate(150%);
-webkit-backdrop-filter: blur(12px) saturate(150%);
border: 1px solid rgba(255, 255, 255, 0.20);
border-radius: var(--radius-lg);
```

### Dark Mode Glass

```css
background: rgba(30, 30, 30, 0.60);
backdrop-filter: blur(12px) saturate(120%);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### Performance Notes

- Reduce blur to 6–8px on mobile
- Avoid animating backdrop-filter
- Use will-change: backdrop-filter only when needed, remove after
- Test on low-end devices — backdrop-filter is GPU-intensive

---

## 8. Texture & Noise Overlays

### Noise Grain (Premium Gradient Enhancement)

```css
.surface-with-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* or noise texture image */
  opacity: 0.03; /* 2–5%, never higher */
  mix-blend-mode: overlay;
  pointer-events: none;
  border-radius: inherit;
}
```

Apply to: gradient backgrounds, hero sections, large surface areas.
Never apply to: text, interactive elements, small components.

### Subtle Image Containment Border

```css
.image-container {
  position: relative;
}
.image-container::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  pointer-events: none;
}
```

This creates a subtle inner border that prevents images with white/light backgrounds from
blending into the page surface.

---

## 9. Focus States & Accessibility

### Focus Ring Standard

```css
:focus-visible {
  outline: 2px solid var(--color-action-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

Never use `outline: none` without a visible replacement. Focus must be visible in both light
and dark modes. Test by tabbing through the entire interface.

### Touch Targets

Minimum 44×44px (Apple) / 48×48dp (Android). If the visual element is smaller, expand the
hit area with padding or pseudo-elements:

```css
.small-icon-button {
  position: relative;
  /* Visual size: 24px */
}
.small-icon-button::before {
  content: '';
  position: absolute;
  inset: -12px; /* Expands to 48px hit area */
}
```

---

## 10. Responsive Breakpoints & Fluid Values

### Standard Breakpoints

```
breakpoint.sm:    640px   — large phone / small tablet
breakpoint.md:    768px   — tablet portrait
breakpoint.lg:    1024px  — tablet landscape / small laptop
breakpoint.xl:    1280px  — standard laptop
breakpoint.2xl:   1536px  — large desktop
```

### Fluid Typography (clamp)

```css
/* Heading that scales from 24px (mobile) to 40px (desktop) */
font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem);

/* Body text that stays readable */
font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
```

### Container Queries (modern approach)

Prefer container queries over media queries for component-level responsiveness. Components
should adapt to their container, not the viewport.

---

## 11. Component State Matrix

Every interactive component must have these states defined. Missing states = incomplete.

| State | Visual Change | Required For |
|-------|--------------|--------------|
| Default | Base styling | All components |
| Hover | Slight background shift, shadow increase, or color change | All clickable elements |
| Focus | Visible focus ring (2px outline, 2px offset) | All interactive elements |
| Active/Pressed | Scale(0.97–0.98), shadow decrease, darker background | Buttons, clickable cards |
| Disabled | 50–60% opacity, cursor: not-allowed, no hover effects | All form elements, buttons |
| Loading | Spinner/skeleton replacing content, maintained dimensions | Buttons, cards, data areas |
| Error | Red border/text, error icon, error message below | Form inputs, submission areas |
| Success | Green indicator, check icon, brief confirmation | Form submissions, actions |
| Selected | Highlighted background, check/indicator, border change | Selectable items, tabs |
| Empty | Illustration + helpful text + CTA to populate | Data lists, dashboards |

---

## 12. Optical Alignment Corrections

These manual adjustments override pixel-perfect grid alignment where the eye disagrees
with the math:

| Situation | Correction |
|-----------|-----------|
| Play button triangle in circle | Shift right 2–3% of container width |
| Circle next to same-height square | Enlarge circle 2–3% |
| Text next to icon (vertically centered) | Nudge text down 1–2px |
| Chevron/arrow next to text | May need 1px vertical offset |
| Left-aligned text column with bullets | Hang bullets outside the text margin |
| Centered text under different-width headings | Optical center may differ from mathematical center |
| Mixed-case vs all-caps at same size | All-caps appears ~10% taller; reduce size slightly |

---

## 13. Common Anti-Patterns (What to Flag)

When auditing, these are the most frequent issues to catch:

| Anti-Pattern | Fix |
|-------------|-----|
| Single flat box-shadow | Replace with layered shadow tokens |
| Borders everywhere | Replace most with shadows, spacing, or bg color |
| Pure black (#000) text on white | Use near-black (#111827 or darker gray) |
| Pure black (#000) dark mode background | Use #121212 or #0A0A0A |
| Pure white (#FFF) text in dark mode | Use #E5E7EB |
| More than 3 font families | Reduce to 2 (display + body) |
| Inconsistent border-radius | Audit and normalize to token scale |
| Missing hover states | Add subtle background/shadow change |
| Missing focus-visible | Add 2px outline with offset |
| Animation > 700ms | Reduce to ≤ 500ms for most transitions |
| Hardcoded color values | Replace with semantic tokens |
| Spacing not on 8px grid | Snap to nearest grid value |
| Touch targets < 44px | Expand with padding or pseudo-elements |
| Missing empty/loading/error states | Design and implement for every data-dependent screen |
| Inconsistent icon sizing/weight | Normalize to one icon set, one stroke weight, one size per context |
| Labels far from their fields | Tighten label-to-field gap to 4–8px |
| Equal spacing everywhere | Vary spacing to create hierarchy (more space = more importance) |
| Animations without reduced-motion | Add @media (prefers-reduced-motion) fallbacks |
