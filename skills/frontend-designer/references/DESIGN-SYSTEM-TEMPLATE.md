# Design System Template

Meta-framework for understanding what's fixed, project-specific, and adaptable in your design system.

## Purpose

This template helps you distinguish between:
- **Fixed Elements**: Universal rules that never change
- **Project-Specific Elements**: Filled in for each project based on brand
- **Adaptable Elements**: Context-dependent implementations

---

## I. FIXED ELEMENTS

These foundations remain consistent across all projects, regardless of brand or context.

### 1. Spacing Scale

**Fixed System:**
```
4px | 8px | 12px | 16px | 24px | 32px | 48px | 64px | 96px
```

**Usage:**
- Margins, padding, gaps between elements
- Mathematical relationships ensure visual rhythm
- Use multipliers of base unit (4px)
- For fluid spacing, wrap in `clamp()` — see RESPONSIVE-DESIGN.md

**Why Fixed:**
Consistent spacing creates visual rhythm regardless of brand personality.

### 2. Grid System

**Fixed Structure:**
- **12-column grid** for most layouts (divisible by 2, 3, 4, 6)
- **16-column grid** for data-heavy interfaces
- **Gutters**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Subgrid** for perfect nested alignment across sibling components

**Why Fixed:**
Grid provides structural order. Brand personality shows through color, typography, content — not grid structure.

### 3. Accessibility Standards

**Fixed Requirements:**
- **WCAG 2.1 AA** compliance minimum
- **Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Touch targets**: Minimum 44×44px
- **Keyboard navigation**: All interactive elements accessible
- **Screen reader**: Semantic HTML, ARIA labels where needed
- **Reduced motion**: Always respect `prefers-reduced-motion`

**Why Fixed:**
Accessibility is not negotiable. It's a baseline requirement for ethical, legal, and usable products.

### 4. Typography Hierarchy Logic

**Fixed Structure:**
- **Mathematical scaling**: 1.25× (major third) or 1.333× (perfect fourth)
- **Hierarchy levels**: Display → H1 → H2 → H3 → Body → Small → Caption
- **Line height**: 1.5× for body text, 1.15–1.25× for headlines
- **Line length**: 45–75 characters optimal (`max-width: 65ch`)
- **Letter spacing**: Tighter for large text (−0.02em), default for body, looser for small (+0.02em)
- **Fluid sizing**: Use `clamp()` for smooth viewport-responsive scaling

**Why Fixed:**
Mathematical relationships create predictable, harmonious hierarchy. Specific fonts change, but the logic doesn't.

### 5. Component Architecture

**Fixed Patterns:**
- **Button states**: Default, Hover, Active, Focus-visible, Disabled, Loading
- **Form structure**: Label above input, error below, helper text optional
- **Modal pattern**: Overlay + centered content + close mechanism + focus trap
- **Card structure**: Container → Header → Body → Footer (optional)
- **Headless primitives**: Separate behavior/accessibility from styling (Radix, Ark UI, React Aria)
- **Compound components**: Parent manages state, children consume via Context

**Why Fixed:**
Users expect consistent component behavior. Architecture is fixed; appearance is project-specific.

### 6. Animation Timing Framework

**Fixed Physics Profiles:**
- **Lightweight** (icons, chips): 100–150ms
- **Standard** (cards, panels): 200–300ms
- **Weighty** (modals, pages): 400–500ms

**Fixed Easing:**
- **Ease-out**: Entrances (fast start, slow end)
- **Ease-in**: Exits (slow start, fast end)
- **Ease-in-out**: Transitions (smooth both ends)
- **Rule**: Exits are ~30% faster than entrances

**Why Fixed:**
Natural physics feel consistent across brands. Duration and easing create that feeling.

### 7. Design Token Architecture

**Fixed Three-Tier Structure:**
```
TIER 1: Primitive/Global → raw values (colors, sizes, radii)
TIER 2: Semantic/Alias  → intent-based (color-primary, space-component)
TIER 3: Component       → scoped (btn-bg, card-padding)
```

**Why Fixed:**
The W3C Design Tokens Community Group v1.0 spec (October 2025) standardized this structure. Semantic tokens enable theming by swapping a single layer.

### 8. Layered Shadow System

**Fixed Pattern — never single flat shadows:**
```css
:root {
  --shadow-sm:
    0 1px 2px oklch(0 0 0 / 0.04),
    0 1px 3px oklch(0 0 0 / 0.06);
  --shadow-md:
    0 2px 4px oklch(0 0 0 / 0.04),
    0 4px 8px oklch(0 0 0 / 0.06),
    0 8px 16px oklch(0 0 0 / 0.04);
  --shadow-lg:
    0 4px 8px oklch(0 0 0 / 0.03),
    0 8px 16px oklch(0 0 0 / 0.05),
    0 16px 32px oklch(0 0 0 / 0.07);
}
```
Dark mode: Replace shadows with elevated surface colors (lighter backgrounds).

**Why Fixed:**
Layered shadows create natural depth on any brand. Single flat shadows always look amateurish.

---

## II. PROJECT-SPECIFIC ELEMENTS

Fill in these for each project based on brand personality and purpose.

### 1. Brand Color System (OKLCH)

**Template Structure:**
```css
:root {
  /* NEUTRALS (4–5 colors): */
  --surface-0: oklch(___);    /* Lightest background */
  --surface-1: oklch(___);    /* Card/input surface */
  --border:    oklch(___);    /* Dividers, borders */
  --text-2:    oklch(___);    /* Secondary text */
  --text-1:    oklch(___);    /* Primary text */

  /* ACCENTS (1–3 colors): */
  --accent:    oklch(___);    /* Primary CTA */
  --accent-2:  oklch(___);    /* Secondary action (optional) */

  /* STATUS: */
  --success:   oklch(___);    /* Green-ish */
  --warning:   oklch(___);    /* Amber-ish */
  --error:     oklch(___);    /* Red-ish */
  --info:      oklch(___);    /* Blue-ish */

  /* DERIVED (computed from base): */
  --accent-hover: color-mix(in oklch, var(--accent) 85%, black);
  --accent-muted: oklch(from var(--accent) l calc(c * 0.4) h);
  --accent-bg:    oklch(from var(--accent) 0.97 calc(c * 0.1) h);
}
```

**Questions to Answer:**
- What emotion should the brand evoke? (Trust, excitement, calm, urgency)
- Warm or cool neutrals?
- Conservative or bold accents?
- What do competitors use? → Do something different

**Examples:**

**Project A: Fintech App**
```css
:root {
  --surface-0: oklch(0.98 0.005 250);  /* Cool near-white */
  --text-1:    oklch(0.15 0.03 250);   /* Deep navy text */
  --accent:    oklch(0.45 0.18 250);   /* Deep blue — trust */
  /* Why: Financial products need trust, not playfulness */
}
```

**Project B: Creative Community**
```css
:root {
  --surface-0: oklch(0.97 0.01 60);    /* Warm cream */
  --text-1:    oklch(0.22 0.03 60);    /* Warm charcoal */
  --accent:    oklch(0.65 0.25 25);    /* Coral — energy */
  /* Why: Creative spaces should feel inviting, not corporate */
}
```

**Project C: Healthcare Platform**
```css
:root {
  --surface-0: oklch(0.99 0.002 0);    /* Pure near-white */
  --text-1:    oklch(0.18 0.01 0);     /* Neutral dark */
  --accent:    oklch(0.60 0.15 240);   /* Soft blue — calm */
  /* Why: Healthcare needs clarity and calm */
}
```

### 2. Typography Pairing

**Template:**
```
HEADLINE FONT: _______
- Weights: _______ (e.g., Bold 700, Black 900)
- Use case: H1, H2, display text, hero
- Personality: _______ (geometric/humanist/serif/display)

BODY FONT: _______
- Weights: _______ (e.g., Regular 400, Medium 500, SemiBold 600)
- Use case: Paragraphs, UI text, forms
- Personality: _______ (neutral/readable/efficient)

OPTIONAL ACCENT FONT: _______
- Use case: _______ (special callouts, quotes, badges)
```

**NEVER use:** Inter, Roboto, Arial, Space Grotesk as primary.
**Instead try:** Instrument Serif, Outfit, Bricolage Grotesque, Fraunces, Sora, Cabinet Grotesk, Clash Display, Satoshi, General Sans

**Pairing Examples:**
| Headline | Body | Feel |
|----------|------|------|
| Instrument Serif | Outfit | Editorial, modern |
| Clash Display | Satoshi | Bold, tech-forward |
| Fraunces | General Sans | Warm, distinctive |
| Cabinet Grotesk | Cabinet Grotesk (lighter weight) | Clean, cohesive |

### 3. Tone of Voice

**Template:**
```
BRAND PERSONALITY:
- Formal ↔ Casual: _______ (1–10)
- Professional ↔ Friendly: _______ (1–10)
- Serious ↔ Playful: _______ (1–10)
- Authoritative ↔ Conversational: _______ (1–10)

MICROCOPY:
- Primary CTA label: _______
- Error (invalid email): _______
- Success (saved): _______
- Empty state: _______
- Loading message: _______

ANIMATION PERSONALITY:
- Speed: _______ (quick / moderate / slow)
- Feel: _______ (precise / smooth / bouncy)
- Custom easing: cubic-bezier(___, ___, ___, ___)
```

### 4. Animation Speed & Feel

**Template:**
```
SPEED PREFERENCE:
- UI interactions: _______ (100–150ms / 150–200ms / 200–300ms)
- State changes: _______ (200ms / 300ms / 400ms)
- Page transitions: _______ (300ms / 500ms / 700ms)

ANIMATION STYLE:
- Easing: _______ (sharp / standard / bouncy)
- Movement: _______ (minimal / smooth / expressive)
- Scroll animations: _______ (none / subtle reveals / dramatic parallax)
```

---

## III. ADAPTABLE ELEMENTS

Context-dependent implementations that vary based on use case.

### 1. Component Variations

**Button Variants:**
- **Primary**: Full background color (high emphasis)
- **Secondary**: Outline or tinted background (medium emphasis)
- **Tertiary**: Text only (low emphasis)
- **Destructive**: Error-colored (danger actions)
- **Ghost**: Minimal background (navigation, toolbars)

**Adaptation Rules:**
- Primary: Main CTA, one per screen section
- Secondary: Alternative actions
- Tertiary: Less important actions, multiple allowed
- Brand colors applied, but hierarchy logic is fixed

### 2. Responsive Behavior

**Content Site:**
```
XS–SM: Single column, full-width images
MD:    2 columns, sidebar optional
LG–XL: 3 columns max, max-width container
```

**Dashboard/Data App:**
```
XS:    Collapsed cards, bottom tab navigation
SM:    Simplified sidebar (icons only)
MD:    Full sidebar + main content
LG–XL: Sidebar + main + detail panel
```

**E-commerce:**
```
XS–SM: Single column, sticky add-to-cart bar
MD:    2-column product grid, filters in drawer
LG–XL: 3–4 column grid, visible filter sidebar
```

### 3. Dark Mode Palette

**Not a simple inversion — adjust for comfort:**

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--surface-0` | oklch(0.98 ...) | oklch(0.12 ...) |
| `--surface-1` | oklch(0.96 ...) | oklch(0.16 ...) |
| `--text-1` | oklch(0.15 ...) | oklch(0.90 ...) |
| `--border` | oklch(0.88 ...) | oklch(0.25 ...) |
| Shadows | Layered box-shadows | Lighter surface colors instead |
| Accent | Same hue, slightly more chroma | Same hue, slightly higher lightness |

**Why:** Pure white on pure black is too harsh. Dark mode needs ~15:1 contrast (still AA) with softer text.

### 4. Loading States

**Context-Dependent:**
| Duration | Pattern | Example |
|----------|---------|---------|
| <300ms | No indicator | Feels instant |
| 300ms–2s | Skeleton screen or spinner | Content areas, buttons |
| >2s | Progress bar + message | File uploads, AI generation |
| Unknown | Skeleton + pulsing | API calls, search |

### 5. Error Handling

**Form Errors:**
- Validate on blur (after leaving field)
- Display inline below field
- Clear error when user fixes input
- Use `aria-invalid` + `aria-describedby`

**API Errors:**
- Transient (network): Retry button + toast
- Permanent (404): Helpful message + navigation options
- Critical (500): Contact support option

---

## DECISION TREE

When implementing a feature, ask:

**Is this FIXED?**
→ Affects structure, accessibility, or universal UX?
→ Examples: Spacing, grid, contrast, component architecture, shadow layering, token tiers
→ **Action**: Use the fixed system, no variation

**Is this PROJECT-SPECIFIC?**
→ Expresses brand personality or purpose?
→ Examples: Colors (OKLCH), typography, tone, animation feel
→ **Action**: Fill in the template for this project

**Is this ADAPTABLE?**
→ Depends on context, content, or use case?
→ Examples: Component variants, responsive behavior, loading patterns, dark mode
→ **Action**: Choose appropriate variation based on context

---

## PROJECT KICKOFF TEMPLATE

```
PROJECT NAME: _______________________
PURPOSE: ____________________________

BRAND PERSONALITY:
- Primary emotion: _______
- Warm or cool: _______
- Formal or casual: _______
- Conservative or bold: _______

COLORS (OKLCH):
- Surface-0 (background): oklch(___)
- Text-1 (primary text): oklch(___)
- Accent (primary CTA): oklch(___)
- Status: success oklch(___) | warning oklch(___) | error oklch(___)

TYPOGRAPHY:
- Headline font: _______
- Body font: _______
- Pairing rationale: _______

TONE:
- CTA label style: _______
- Error style: _______
- Success style: _______

ANIMATION:
- Speed: _______ (fast / moderate / slow)
- Feel: _______ (sharp / smooth / bouncy)
- Custom easing: cubic-bezier(___, ___, ___, ___)
- Scroll animations: _______ (none / subtle / dramatic)

TARGET:
- Primary device: _______ (mobile / desktop / both)
- Scroll-driven animations: _______ (yes / progressive enhancement)
- View Transitions: _______ (yes / fallback crossfade)
```

---

## VALIDATION CHECKLIST

### Fixed Elements
- [ ] Uses spacing scale (4/8/12/16/24/32/48/64/96px)
- [ ] Follows grid system (12 or 16 columns)
- [ ] Meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Touch targets ≥ 44px
- [ ] Typography follows mathematical scale
- [ ] Components follow standard architecture (headless + compound)
- [ ] Shadows are layered (2–3 per level, never single)
- [ ] Tokens follow three-tier structure (primitive → semantic → component)
- [ ] Respects `prefers-reduced-motion`

### Project-Specific Elements
- [ ] Colors use OKLCH with derived variants via `color-mix()`
- [ ] Typography pairing is distinctive (not Inter/Roboto/Space Grotesk)
- [ ] Tone of voice defined and consistent
- [ ] Animation speed and custom easing match brand personality

### Adaptable Elements
- [ ] Component variants appropriate for context
- [ ] Responsive behavior fits content type (container queries for components)
- [ ] Loading states match operation duration
- [ ] Error handling fits error type
- [ ] Dark mode palette adjusted (not just inverted)

---

## KEY TAKEAWAY

**The system flexibility framework lets you:**
- Maintain consistency (fixed elements)
- Express brand personality (project-specific)
- Adapt to context (adaptable elements)

**Without this framework:**
- Designers reinvent spacing every project
- Components feel inconsistent
- Brand personality overrides accessibility
- Everything looks generically AI-generated

**With this framework:**
- Speed: Start from proven foundations
- Consistency: Fixed elements guarantee it
- Flexibility: Express unique brand identity
- Context: Adapt without breaking system
- Distinction: Every project has its own voice

---

## Version History

- v2.0.0 (2026-03-19): OKLCH color integration, W3C design token architecture, layered shadow system, container queries, scroll-driven animation support, enhanced dark mode guidance
- v1.0.0 (2025-10-18): Initial design system template
