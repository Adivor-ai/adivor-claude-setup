# Color System Reference

Color operates across three dimensions: hue (wheel position), saturation (intensity), and brightness (lightness). The interplay of all three — not hue alone — determines whether a system works.

## Color System Architecture

Every interface needs two color roles:

### 1. Base/Neutral Palette (4–5 colors)
- Backgrounds (lightest)
- Surface colors (cards, inputs)
- Borders and dividers
- Secondary text
- Primary text (darkest)

Choose warm or cool neutrals intentionally:
- **Warm greys** (beige/brown undertones) → Organic, approachable, trustworthy
- **Cool greys** (blue undertones) → Modern, tech-forward, professional

### 2. Accent Palette (1–3 colors)
- Primary action (CTA buttons)
- Status indicators (success, warning, error, info)
- Focus/hover states
- Emphasis and highlights

## The 60-30-10 Rule

Borrowed from interior design — the most reliable color distribution framework:

| Proportion | Role | Example |
|-----------|------|---------|
| **60%** | Dominant/background | Neutral tones |
| **30%** | Secondary/structure | Supporting neutral or brand color |
| **10%** | Accent | CTAs, toggles, key interactive elements |

**Spotify exemplifies this:** Pitch black + dark gray (60%), lighter gray (30%), signature green only on Play button and active toggles (10%). The scarcity of green is what makes it magnetic.

The key insight: dominant colors with **sharp accents** outperform timid, evenly-distributed palettes.

## Color Application Rules

| Element | Color | Notes |
|---------|-------|-------|
| Backgrounds | Lightest neutral | Or pure white for light themes |
| Primary text | Darkest neutral | slate-900 or equivalent |
| Secondary text | Mid-tone neutral | slate-600 or equivalent |
| Primary buttons | Accent + white text | High contrast required |
| Secondary buttons | Neutral + border + dark text | Lower visual weight |
| Status: success | Green variant | Never green alone — add icon/label |
| Status: error | Red variant | With icon and descriptive text |
| Status: warning | Amber variant | With icon |
| Status: info | Blue variant | With icon |

### Interactive States
- **Hover**: Darken by 10–15% or shift hue slightly
- **Focus**: Ring/outline in accent color (≥2px, 3:1 contrast)
- **Pressed/Active**: Darken further or add inset shadow
- **Disabled**: Reduce opacity to 40–50%, remove hover effects

## Accessibility Contrast Requirements

| Element | Minimum Ratio (AA) | Enhanced (AAA) |
|---------|-------------------|----------------|
| Normal text (<18pt) | **4.5:1** | 7:1 |
| Large text (≥18pt or 14pt bold) | **3:1** | 4.5:1 |
| UI components | **3:1** | — |
| Graphical objects | **3:1** | — |

**Common pitfalls:**
- Pure red (#FF0000) on white = only 4:1 (barely passes for large text)
- Pure green (#00FF00) on white = 1.4:1 (fails entirely)
- Never rely on color alone to convey information — ~8% of men are colorblind (~300M people worldwide)
- Safe pair: blue + orange remains distinguishable across most color vision deficiency types

**Tools:** WebAIM Contrast Checker, Stark (Figma plugin, 40K+ designers), Leonardo by Adobe (define target ratios proactively), Chrome DevTools Accessibility tab.

## Dark Mode Design

Dark mode is NOT simply inverted colors. It requires separate design thinking:

| Guideline | Value | Reason |
|-----------|-------|--------|
| Background | **#121212** (not #000000) | Pure black causes halation for users with astigmatism. Only 0.3% more power on OLED. |
| Text | **#E0E0E0** (not #FFFFFF) | Softer contrast, still meets WCAG. Reduces eye strain. |
| Accent colors | **Desaturate 20–30%** | Vibrant colors on dark backgrounds cause eye strain |
| Depth/elevation | Lighter surface colors (not shadows) | 4–5 elevation levels via progressively lighter surfaces |
| Shadows | Minimal or invisible | Don't transfer light-mode shadow patterns to dark |

### Surface Elevation Scale (Dark Mode)
```
Level 0: #121212 (base)
Level 1: #1E1E1E (cards, elevated surfaces)
Level 2: #232323 (modals, dropdowns)
Level 3: #282828 (active states)
Level 4: #2E2E2E (highest elevation)
```

## Color Psychology (Context-Dependent)

| Color | Common Associations | Caveats |
|-------|-------------------|---------|
| Blue | Trust, reliability, calm | Dominates trust-dependent products (Facebook, LinkedIn, PayPal) |
| Red | Urgency, danger, energy | Error states, notifications, CTAs for urgency |
| Green | Success, growth, nature | Confirmation, positive status |
| Orange/Amber | Warning, warmth, energy | Caution states, friendly urgency |
| Purple | Luxury, creativity | Can feel generic in SaaS (overused in gradients) |
| Black | Sophistication, power | Premium brands, editorial |

**Key fact:** Consumers are 81% more likely to recall a brand's color than its name — making distinctive color choices a powerful brand tool.

**Cultural caveat:** Color associations vary significantly by culture. Research your audience.

## Unique Color Strategy (Anti-AI-Slop)

**NEVER use:**
- Default SaaS blue (#3B82F6)
- Purple gradients on white backgrounds
- Any palette that looks AI-generated or template-derived

**Instead:**
- Unexpected neutrals: warm greys, soft off-whites, deep charcoals, rich blacks
- Distinctive accent pairs: terracotta + charcoal, sage + navy, coral + slate, ochre + midnight, copper + cream
- Test every palette against: "Does this look AI-generated?" If yes, change it.
- Vary between light and dark themes across projects — no two designs should share a palette

## Modern Color Spaces

**HCT (Hue, Chroma, Tone)** — Introduced by Material Design 3. Allows hue/chroma manipulation without affecting perceived lightness. Enables predictable, accessibility-compliant color generation from a single source color.

**Oklch** — Perceptually uniform color space. Increasingly supported in CSS. Better for generating consistent palettes and meeting contrast requirements predictably.

**Display P3** — Wider gamut than sRGB. Supported in modern browsers. W3C Design Tokens spec (2025.10) supports both Display P3 and Oklch.

## Palette Structure Examples

### Warm Professional
```
Neutrals: cream-50, sand-100, stone-300, walnut-700, charcoal-900
Accents: terracotta-500 (primary), amber-500 (warning), rust-600 (error)
```

### Cool Technical
```
Neutrals: ice-50, slate-100, steel-300, graphite-700, midnight-900
Accents: teal-500 (primary), cyan-400 (info), coral-500 (error)
```

### Dark Editorial
```
Neutrals: ink-950, onyx-800, pewter-600, silver-300, bone-50
Accents: gold-400 (primary), sage-500 (success), brick-500 (error)
```

## CSS Variables Pattern

Always define colors as CSS custom properties for consistency and theme switching:

```css
:root {
  --color-bg: #FAFAF8;
  --color-surface: #FFFFFF;
  --color-border: #E5E2DC;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-accent: #C86E4B;
  --color-accent-hover: #B55E3D;
  --color-success: #4A7C59;
  --color-warning: #C4883A;
  --color-error: #B44A4A;
}

[data-theme="dark"] {
  --color-bg: #121212;
  --color-surface: #1E1E1E;
  --color-border: #333333;
  --color-text-primary: #E0E0E0;
  --color-text-secondary: #9E9E9E;
  --color-accent: #D4896A; /* desaturated 20% */
}
```

## Resources
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Leonardo Color](https://leonardocolor.io/) — Adobe's contrast-based generator
- [Coolors](https://coolors.co/) — Palette exploration
- [Realtime Colors](https://realtimecolors.com/) — See palettes applied to real layouts
