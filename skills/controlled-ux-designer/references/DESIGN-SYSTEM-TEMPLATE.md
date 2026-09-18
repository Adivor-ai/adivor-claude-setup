# Design System Template

Meta-framework for understanding what's fixed, project-specific, and adaptable in your design system.

## Table of Contents

1. [Fixed Elements](#i-fixed-elements) — Universal rules that never change
2. [Project-Specific Elements](#ii-project-specific-elements) — Filled in per project based on brand
3. [Adaptable Elements](#iii-adaptable-elements) — Context-dependent implementations
4. [Decision Tree](#decision-tree)
5. [Project Kickoff Template](#project-kickoff-template)
6. [Complete System Examples](#examples-of-complete-systems)

---

## I. FIXED ELEMENTS

These foundations remain consistent across all projects, regardless of brand or context.

### 1. The 8px Spacing Grid (Industry Standard)

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

Used by both Material Design and Apple HIG. All spacing, sizing, padding, and margins use multiples of 8, with a 4px sub-grid for fine adjustments like icon alignment. Most screen sizes are divisible by 8, and the number halves and quarters cleanly.

Token scale: XS(4px), S(8px), M(16px), L(24px), XL(32px), 2XL(48px), 3XL(64px).

### 2. 12-Column Grid System

- **12-column** for most layouts (divisible by 2, 3, 4, 6)
- **16-column** for data-heavy interfaces
- Responsive column shifts: **12 → 8 → 4** (desktop → tablet → mobile)
- Gutters: 16px (mobile), 24px (tablet/desktop)
- Max container widths: 960px (laptop), 1200px (desktop), 1400px (large displays)

### 3. Accessibility Standards (Non-Negotiable)

- **WCAG 2.2 AA** compliance minimum
- Contrast: **4.5:1** normal text, **3:1** large text and UI components
- Touch targets: **44×44px** minimum (Apple HIG), WCAG 2.2 AA minimum **24×24px** with spacing
- Keyboard navigation: all interactive elements accessible
- Semantic HTML before ARIA (pages with ARIA average 41% more errors)
- Focus indicators: never removed, enhanced with 2px+ thickness and 3:1 contrast
- `prefers-reduced-motion` respected

**Legal context:** EAA enforcement began June 2025 (€500K fines), DOJ references WCAG 2.1 AA.

### 4. Typography Hierarchy Logic

- Mathematical scaling: 1.250 (Major Third, versatile default) or 1.333 (Perfect Fourth, dramatic)
- Hierarchy levels: Display → H1 → H2 → H3 → Body → Small → Caption
- Line height: **1.5-1.6** body, **1.1-1.2** headlines (WCAG requires ≥1.5×)
- Line length: **55-75 characters** optimal
- Base size: **16px (1rem)** — Apple HIG uses 17pt

### 5. Component Architecture

All components follow these fixed patterns:
- **Buttons**: Default, Hover, Active, Focus, Disabled, Loading (6 states)
- **Forms**: Label above input, error below, helper text optional
- **Modals**: Overlay + centered content + close mechanism (Escape + button + outside click)
- **Cards**: Container → Header → Body → Footer (optional)
- **Tables**: Left-align text, right-align numbers, never center-align

### 6. Animation Timing Framework

| Element Weight | Duration | Example |
|---|---|---|
| Lightweight (<100px) | 150ms | Icons, badges, chips |
| Standard (100-500px) | 300ms | Cards, panels, list items |
| Weighty (>500px) | 500ms | Modals, full-page transitions |

- ease-out for entrances, ease-in for exits, ease-in-out for transitions
- Only animate `transform` and `opacity` (GPU-accelerated)
- Never animate width, height, top, left, margin

---

## II. PROJECT-SPECIFIC ELEMENTS

Fill in these for each project based on brand personality and purpose.

### 1. Brand Color System

**Template:**

```
NEUTRALS (4-5 colors):
- Background lightest: _______ 
- Surface: _______ 
- Border/divider: _______ 
- Text secondary: _______ 
- Text primary: _______ 

ACCENTS (1-3 colors):
- Primary (main CTA): _______ 
- Secondary (alternative): _______ (optional)
- Status: Success _______ | Warning _______ | Error _______ | Info _______

COLOR DISTRIBUTION (60-30-10 rule):
- 60% dominant/background (neutral)
- 30% secondary supporting
- 10% accent (CTAs, highlights)
```

**Questions to answer:**
- What emotion? (Trust, excitement, calm, urgency)
- Warm or cool neutrals?
- Conservative or bold accents?
- Does it pass the "AI-generated test"? (Avoid default SaaS blue #3B82F6)

**Examples:**

| Project | Neutrals | Primary Accent | Why |
|---|---|---|---|
| Fintech App | Cool slates | Deep blue (#0A2463) | Trust, professionalism |
| Creative Community | Warm beige greys | Coral (#FF6B6B) | Energy, creativity |
| Healthcare Platform | Pure greys | Soft blue (#4A90E2) | Calm, clinical clarity |

### 2. Typography Pairing

**Template:**

```
HEADLINE FONT: _______
  Weight: _______   Personality: _______
  
BODY FONT: _______
  Weight: _______   Personality: _______
  
SCALE RATIO: _______ (1.125 dense | 1.250 versatile | 1.333 dramatic)
```

**Font selection criteria:**
- High x-height for small-size readability
- Clear I/l/1/O/0 distinction
- Variable font if available (performance + flexibility)

**Examples:**

| Project | Headline | Body | Rationale |
|---|---|---|---|
| Editorial | Playfair Display (Serif, 700) | Inter (Sans, 400) | Trustworthy editorial feel |
| Tech Startup | DM Sans (Sans, 700) | DM Sans (400, 500) | Single-font = modern, efficient |
| Luxury Brand | Cormorant Garamond (Serif, 300) | Lato (Sans, 400) | Elegant serif + readable sans |

**NEVER default to:** Inter, Roboto, Arial, system fonts for display text. These are the hallmark of AI-generated design.

### 3. Tone of Voice

**Template:**

```
PERSONALITY SCALES (1-10):
- Formal ↔ Casual: _______
- Professional ↔ Friendly: _______
- Serious ↔ Playful: _______
- Authoritative ↔ Conversational: _______

MICROCOPY:
- Submit button: _______
- Error (invalid email): _______
- Success (saved): _______
- Empty state: _______
```

**Microcopy matters:** "Trial for free" outperformed "Sign up for free" by **104%** in conversion testing.

### 4. Animation Speed & Feel

**Template:**

```
SPEED:
- UI interactions: _______ (100-150ms / 150-200ms / 200-300ms)
- State changes: _______ (200ms / 300ms / 400ms)
- Page transitions: _______ (300ms / 500ms / 700ms)

STYLE:
- Easing: _______ (sharp / standard / bouncy)
- Movement: _______ (minimal / smooth / expressive)
```

| Project | Speed | Style | Why |
|---|---|---|---|
| Trading Platform | Fast (100/200/300ms) | Sharp, minimal | Traders need speed |
| Wellness App | Slow (200/400/500ms) | Smooth, gentle | Calm, relaxing experience |

---

## III. ADAPTABLE ELEMENTS

Context-dependent implementations that vary by use case.

### 1. Component Variations

| Variant | Style | Use Case |
|---|---|---|
| Primary | Full background | Main CTA, one per section |
| Secondary | Outline/border | Alternative actions |
| Tertiary | Text only | Low-importance actions |
| Destructive | Red-ish | Danger/delete actions |
| Ghost | Minimal | Navigation, toolbars |

### 2. Responsive Breakpoints

| Range | Pixels | Strategy |
|---|---|---|
| XS | 0-479px | Single column, large touch targets |
| SM | 480-767px | Single column, bottom nav |
| MD | 768-1023px | 2 columns, sidebar possible |
| LG | 1024-1439px | Multi-column, full nav |
| XL | 1440px+ | Max-width container, multi-panel |

**Content site:** 1 col → 2 col → 3 col max
**Dashboard:** Collapsed cards → sidebar + main → sidebar + main + panel

### 3. Dark Mode Palette

Not a simple inversion. Dark mode needs adjusted contrast:

| Element | Light Mode | Dark Mode |
|---|---|---|
| Background | #FFFFFF | #121212 (not pure black) |
| Text | #0F172A (21:1) | #E0E0E0 (15.8:1, softer) |
| Accents | Full saturation | Desaturated 20-30% |
| Depth | Shadows | Progressively lighter surfaces |

### 4. Loading States (Time-Based)

| Duration | Strategy |
|---|---|
| <500ms | No indicator (feels instant) |
| 500ms-2s | Spinner or skeleton screen |
| >2s | Progress bar with estimate |
| Interactive | Button shows inline spinner |

### 5. Error Handling

| Context | Strategy |
|---|---|
| Form errors | Validate on blur, inline below field, clear on fix |
| Transient (network) | Retry button |
| Permanent (404) | Helpful message + next steps |
| Critical (500) | Contact support option |

---

## DECISION TREE

**Is this FIXED?** (Structure, accessibility, universal UX)
→ Use the fixed system, no variation

**Is this PROJECT-SPECIFIC?** (Brand personality, purpose)
→ Fill in the template for this project

**Is this ADAPTABLE?** (Context, content, use case)
→ Choose appropriate variation based on context

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

COLORS:
- Neutral base: _______
- Primary accent: _______
- Status colors: _______ / _______ / _______
- Distribution: 60% _______ / 30% _______ / 10% _______

TYPOGRAPHY:
- Headline font: _______
- Body font: _______
- Scale ratio: _______
- Pairing rationale: _______

TONE:
- Button labels style: _______
- Error message style: _______
- Success message style: _______

ANIMATION:
- Speed: _______ (fast/moderate/slow)
- Feel: _______ (sharp/smooth/bouncy)

TARGET DEVICES:
- Primary: _______ (mobile/desktop/both)
- Secondary: _______

DESIGN TOKENS:
- Using W3C Design Tokens spec? _______
- Token tool: _______ (Tokens Studio / Style Dictionary / Figma Variables)
```

---

## EXAMPLES OF COMPLETE SYSTEMS

### System A: B2B SaaS (Conservative)

**Fixed**: 8px grid, 12-col, WCAG AA, Major Third scale, 6-state buttons
**Project-Specific**:
- Colors: Cool slates + corporate blue (not default #3B82F6)
- Typography: DM Sans (headlines + body)
- Tone: Professional, formal — "Submit Application"
- Animation: Quick, precise (150ms)
**Adaptable**:
- Dashboard: multi-panel layout, progressive disclosure
- Forms: extensive → use progressive disclosure
- Errors: detailed technical info with fix instructions

### System B: Consumer Social App (Playful)

**Fixed**: Same foundational structure
**Project-Specific**:
- Colors: Warm greys + vibrant coral (#FF6B6B)
- Typography: Poppins (headlines) + Inter (body)
- Tone: Casual, friendly — "Let's go!"
- Animation: Moderate, slight bounce (200ms)
**Adaptable**:
- Mobile-first (most users on phones)
- Forms: minimal, progressive profiling
- Errors: friendly, not technical — "Hmm, that doesn't look right"

### System C: Healthcare Platform (Clinical)

**Fixed**: Same foundational structure
**Project-Specific**:
- Colors: Pure greys + medical blue (#4A90E2)
- Typography: System fonts (SF Pro / Segoe) for zero-latency
- Tone: Clear, authoritative, calm
- Animation: Slow, smooth (300ms)
**Adaptable**:
- Desktop-first (clinical workstations)
- Forms: complex (HIPAA compliance), extensive validation
- Errors: precise with actionable next steps

---

## VALIDATION CHECKLIST

### Fixed Elements
- [ ] Uses 8px spacing grid (4/8/12/16/24/32/48/64px)
- [ ] Follows 12-column grid system
- [ ] Meets WCAG 2.2 AA contrast (4.5:1 normal, 3:1 large)
- [ ] Touch targets ≥ 44px (≥24px minimum with spacing)
- [ ] Typography follows mathematical scale
- [ ] All 6 button states implemented
- [ ] Semantic HTML before ARIA
- [ ] Focus indicators enhanced (not removed)

### Project-Specific Elements
- [ ] Brand colors intentional and documented
- [ ] Typography pairing chosen and justified
- [ ] Tone of voice defined and consistent
- [ ] Animation speed matches brand personality
- [ ] Color distribution follows 60-30-10

### Adaptable Elements
- [ ] Component variants appropriate for context
- [ ] Responsive behavior fits content type
- [ ] Loading states match operation duration
- [ ] Error handling fits error type
- [ ] Dark mode properly adapted (not inverted)

---

## Resources

- [W3C Design Tokens Spec (2025.10)](https://design-tokens.github.io/community-group/format/)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Microsoft Fluent 2](https://fluent2.microsoft.design/)
