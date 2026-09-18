# Typography Reference

Typography is a primary design element that conveys personality and hierarchy. This reference covers font selection, mathematical scales, pairing strategies, fluid type, variable fonts, and responsive type patterns.

## Font Selection Criteria

For UI, prioritize: high x-height for small-size readability, consistent stroke widths, clear distinction between similar characters (I, l, 1, O, 0), and screen rendering optimization.

**Functional vs Emotional Typography:**
- **Headlines/Display**: Prioritize emotion, personality, attention — legibility is secondary
- **Body Text**: Prioritize reading comfort, legibility, accessibility
- **UI/Labels**: Prioritize clarity, scannability, consistency
- **Captions/Micro**: 1–2 lines of non-critical info, small sizes

### Banned as Primary (AI-Overused)
Inter, Roboto, Arial, Helvetica, Space Grotesk, system fonts as primary choice.

### Where to Find Distinctive Fonts
- **Google Fonts** — dig past page 1. Explore filters by category/feeling.
- **Type foundries** — many offer free/open-source options alongside commercial
- **Variable fonts** — single file, infinite weight/width combinations, better performance

### Production-Ready Variable Fonts
Inter Variable, Roboto Flex (13+ variation axes), IBM Plex Sans Variable, GitHub Mona Sans, Source Sans 3 Variable. Variable fonts enable smooth axis animations and precise accessibility adjustments.

## Typographic Scale Systems

Use mathematical ratios applied to a 16px (1rem) base:

| Ratio | Name | Best For |
|-------|------|----------|
| 1.125 | Major Second | Dense dashboards, data-heavy product UI |
| 1.200 | Minor Third | Compact product interfaces |
| **1.250** | **Major Third** | **Versatile default for most UI** |
| 1.333 | Perfect Fourth | Marketing sites, dramatic hierarchy |
| 1.414 | Augmented Fourth | Landing pages with strong visual impact |
| 1.618 | Golden Ratio | Hero-driven pages, editorial, luxury |

### Major Third Scale (1.25×) — Default
```
xs:   0.64rem  (10px)  — captions, fine print
sm:   0.8rem   (13px)  — labels, metadata
base: 1rem     (16px)  — body text
lg:   1.25rem  (20px)  — large body, small headings
xl:   1.563rem (25px)  — H4 equivalent
2xl:  1.953rem (31px)  — H3 equivalent
3xl:  2.441rem (39px)  — H2 equivalent
4xl:  3.052rem (49px)  — H1 equivalent
5xl:  3.815rem (61px)  — display/hero text
```

**Reference:** Material Design 3 defines 15 typography styles across five categories (Display, Headline, Title, Body, Label) × three sizes each. Apple HIG sets 17pt default body text.

## Spacing & Readability

| Property | Guideline | Notes |
|----------|-----------|-------|
| Line height (body) | **1.5–1.6×** font size | WCAG 1.4.12 requires ≥1.5×. Browser default 1.2 is too tight. |
| Line height (headings) | 1.1–1.2× | Tighter for large text |
| Line height (dyslexia) | 1.8–2.0× | For accessibility-enhanced modes |
| Line length | **55–75 characters** | 60–70 ideal. Directly constrains column widths. |
| Paragraph spacing | 1–1.5em | Between paragraphs |
| Letter spacing (headings 36px+) | -0.02em to -0.05em | Gaps too pronounced at large sizes |
| Letter spacing (body) | 0 (default) | |
| Letter spacing (small text <14px) | +0.01em to +0.05em | Improves legibility at small sizes |
| Letter spacing (ALL CAPS) | +0.05em to +0.1em | Always add tracking for uppercase |

**Rule of thumb:** As size increases, reduce tracking. As size decreases, increase tracking.

## Font Pairing Strategies

Create contrast through category, weight, or personality:

| Strategy | Example | Effect |
|----------|---------|--------|
| Category contrast | Serif headlines + Sans body | Editorial, trustworthy |
| Weight contrast | Light display + Bold body | Dynamic, energetic |
| Personality contrast | Geometric + Humanist | Modern + warm |
| Era contrast | Classical serif + Modern geometric sans | Sophisticated tension |
| Display + System | Distinctive headlines + System body | Distinctive yet efficient |

**Rules:**
- Maximum 2–3 typefaces per project
- Limit to 3 weights per typeface (e.g., Regular 400, Medium 500, Bold 700)
- Headlines carry personality, body carries function

## Fluid Typography (Modern Standard)

CSS `clamp()` creates smooth scaling with no breakpoints:

```css
/* Pattern: clamp(minimum, preferred, maximum) */
h1 { font-size: clamp(2rem, 1rem + 5vw, 4rem); }
h2 { font-size: clamp(1.5rem, 0.75rem + 3vw, 3rem); }
p  { font-size: clamp(1rem, 0.875rem + 0.5vw, 1.25rem); }
```

**CRITICAL accessibility requirement:** Always combine `rem` + `vw` in the preferred value (never pure `vw`) so text still scales when users zoom. Tools: Utopia (utopia.fyi), Fluid Type Scale Calculator.

### Responsive Type with Tailwind
```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive Headline
</h1>
```
Reduce sizes 20–30% on mobile. Reduce hierarchy levels on small screens (fewer distinct sizes).

## UI-Specific Typography

| Element | Weight | Size | Notes |
|---------|--------|------|-------|
| Button text | Semi-Bold (600) | 14–16px | Consistent casing (all-caps OR title case) |
| Form labels | Regular (400) | 14px | Positioned above input |
| Form input | Regular (400) | **16px minimum** | Prevents iOS zoom on focus |
| Placeholder | Light (300) or desaturated | Same as input | Never as only label |
| Error messages | Regular (400) | 12–14px | Color-coded with icon |
| Navigation | Medium (500) | 14–16px | Active state differentiation |
| Badges/chips | Medium (500) | 11–13px | Consistent letter-spacing |

## Hierarchy Creation

Build hierarchy through combinations, not single properties:

1. **Primary** — Largest size + boldest weight + darkest color + most spacing
2. **Secondary** — Medium size + medium weight + slightly lighter color
3. **Tertiary** — Smaller size + regular weight + muted color + tighter spacing
4. **Caption/Meta** — Smallest size + light or desaturated + minimal spacing

**Headings should be 2–3× body text size** for effective scanning (e.g., 16px body → 32–48px headlines).

## Resources
- [Utopia Fluid Type Calculator](https://utopia.fyi/type/calculator/)
- [Google Fonts](https://fonts.google.com) — filter beyond page 1
- [Type Scale](https://typescale.com/) — visual scale generator
- [Variable Fonts Directory](https://v-fonts.com/)
