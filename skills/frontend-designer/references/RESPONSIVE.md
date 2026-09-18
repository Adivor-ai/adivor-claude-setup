# Responsive Design Reference

Mobile-first approach: start with mobile constraints, progressively enhance for larger screens.

**63% of users abandon sites due to mobile usability issues.** Mobile-first isn't a philosophical preference — it's a practical necessity.

## Breakpoints

| Range | Pixels | Devices | Strategy |
|-------|--------|---------|----------|
| **XS** | 0–479px | Small phones | Single column, stacked nav, 44px touch targets |
| **SM** | 480–767px | Large phones | Single column, bottom nav, simplified UI |
| **MD** | 768–1023px | Tablets | 2 columns possible, sidebar nav |
| **LG** | 1024–1439px | Laptops | Multi-column, full nav, desktop UI |
| **XL** | 1440px+ | Desktop | Max-width containers, multi-panel layouts |

**Content breakpoints** (where your actual content breaks) should take priority over rigid device breakpoints. Common test widths: 375px (iPhone SE), 390px (iPhone 14/15), 768px (iPad), 1024px (iPad Pro), 1280px+ (Desktop).

### Max Container Widths
- Laptop: 960px
- Desktop: 1200px
- Large display: 1400px

Prevents content from stretching uncomfortably on ultrawide screens.

## Grid System

The **12-column grid** remains standard due to divisibility (1, 2, 3, 4, 6, or 12 equal columns).

| Viewport | Columns | Gutters |
|----------|---------|---------|
| Mobile | 4 | 16px |
| Tablet | 8 | 20px |
| Desktop | 12 | 24px |

### CSS Grid vs Flexbox

| Tool | Dimension | Approach | Best For |
|------|-----------|----------|----------|
| **Flexbox** | 1D (row or column) | Content-first | Nav bars, button groups, card rows, centering |
| **CSS Grid** | 2D (rows + columns) | Layout-first | Page skeletons, dashboards, galleries |

Common pattern: Grid for page structure, Flexbox within components.

### Auto-Responsive Grid (No Media Queries)
```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

## Container Queries (2025: Full Browser Support)

**Paradigm shift for component design.** Unlike media queries (viewport size), container queries let components respond to their parent container's dimensions.

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
@container card (max-width: 399px) {
  .card { flex-direction: column; }
}
```

**Best practice:** Media queries for **macro layout** (page columns, sidebar visibility). Container queries for **micro layout** (component reflow, widget density).

## Tailwind Responsive Patterns

```tsx
// Mobile-first: base styles, then scale up
<div className="
  w-full           // mobile: full width
  sm:w-1/2         // 480px+: half
  md:w-1/3         // 768px+: third
  lg:w-1/4         // 1024px+: quarter
">

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// Responsive typography
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">

// Show/hide by breakpoint
<div className="block md:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>

// Responsive spacing
<section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
```

## Fluid Typography

```css
/* clamp(minimum, preferred, maximum) */
h1 { font-size: clamp(2rem, 1rem + 5vw, 4rem); }
h2 { font-size: clamp(1.5rem, 0.75rem + 3vw, 3rem); }
p  { font-size: clamp(1rem, 0.875rem + 0.5vw, 1.25rem); }
```

**CRITICAL:** Always combine `rem` + `vw` in the preferred value (never pure `vw`) to ensure text scales when users zoom.

## Mobile Simplification Patterns

| Desktop | Mobile |
|---------|--------|
| Full nav bar | Hamburger menu or bottom nav |
| Side-by-side fields | Stacked fields |
| Multi-column grid | Single column |
| Inline action buttons | Fixed bottom bar or FAB |
| Full data table | Collapsed cards with key info |
| Visible sidebar | Hidden/collapsible drawer |
| Hover tooltips | Tap to reveal / long press |
| Desktop modal | Full-screen sheet or bottom sheet |

## Touch Targets

- Minimum **44×44px** for all interactive elements (Apple HIG)
- Ideal **48×48px** (Material Design)
- WCAG 2.2 AA minimum: **24×24px** with adequate spacing
- `touch-manipulation` prevents 300ms tap delay

```tsx
<button className="min-w-[44px] min-h-[44px] touch-manipulation">
  <Icon size={20} />
</button>
```

Adequate spacing between adjacent targets — fingers are imprecise.

## Responsive Images

```tsx
// HTML srcset for responsive images
<img
  srcSet="image-400w.jpg 400w, image-800w.jpg 800w, image-1200w.jpg 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  alt="Descriptive alt text"
/>

// Modern: aspect-ratio for predictable image containers
<div className="aspect-video w-full overflow-hidden rounded-lg">
  <img src="..." className="w-full h-full object-cover" loading="lazy" alt="..." />
</div>

// Next.js optimized
<Image src="/hero.jpg" width={1200} height={600} priority className="w-full h-auto" />
```

## Responsive Tables

Data tables on mobile — three strategies:

**1. Card stacking** (most common)
```css
@media (max-width: 767px) {
  table, thead, tbody, tr, td { display: block; }
  thead { display: none; }
  td::before { content: attr(data-label); font-weight: bold; }
}
```

**2. Horizontal scroll with fixed column**
```css
.table-wrapper { overflow-x: auto; }
.table-wrapper td:first-child { position: sticky; left: 0; }
```

**3. Column toggling** — let users choose visible columns.

## 8px Spacing Scale

All spacing in multiples of 8 (with 4px sub-grid for fine adjustments):

| Token | Value | Use |
|-------|-------|-----|
| XS | 4px | Icon alignment, fine adjustments |
| S | 8px | Tight spacing, inline elements |
| M | 16px | Default padding, component gaps |
| L | 24px | Section gaps, card padding |
| XL | 32px | Large gaps, section margins |
| 2XL | 48px | Section separators |
| 3XL | 64px | Page-level spacing |

## Testing Checklist

Test at these widths:
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14/15)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro / small laptop)
- [ ] 1280px (Desktop)
- [ ] 1440px+ (Large desktop)
- [ ] Both orientations (portrait + landscape)
- [ ] 200% zoom (accessibility requirement)
- [ ] Content with varying length (short + very long text)

## Resources
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [CSS Container Queries (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [Every Layout](https://every-layout.dev/) — intrinsic responsive patterns
- [Utopia](https://utopia.fyi/) — fluid responsive design calculator
