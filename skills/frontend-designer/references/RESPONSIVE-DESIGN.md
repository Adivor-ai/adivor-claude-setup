# Responsive Design Essentials

Mobile-first approach: start with mobile, progressively enhance for larger screens. In 2024–2026, responsive design shifted from page-level media queries to component-level container queries — making truly reusable components possible.

---

## Breakpoints

| Range | Pixels | Devices | Strategy |
|-------|--------|---------|----------|
| **XS** | 0–479px | Small phones | Single column, stacked nav, 44px touch targets |
| **SM** | 480–767px | Large phones | Single column, bottom nav, simplified UI |
| **MD** | 768–1023px | Tablets | 2 columns possible, sidebar nav |
| **LG** | 1024–1439px | Laptops | Multi-column, full nav, desktop UI |
| **XL** | 1440px+ | Desktop | Max-width containers, multi-panel layouts |

**Key principle:** Breakpoints should be based on **content needs**, not specific devices. These ranges are starting points, not rigid rules.

---

## Tailwind Responsive (Mobile-First)

```tsx
// Base styles = mobile. Prefixes scale UP.
<div className="
  w-full           /* mobile: full width */
  sm:w-1/2         /* 480px+: half */
  md:w-1/3         /* 768px+: third */
  lg:w-1/4         /* 1024px+: quarter */
">

{/* Responsive grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

{/* Responsive typography */}
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">

{/* Show/hide by breakpoint */}
<nav className="block md:hidden">Mobile nav</nav>
<nav className="hidden md:block">Desktop nav</nav>

{/* Responsive spacing */}
<section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
```

---

## Container Queries — Component-Level Responsive

The paradigm shift: components respond to their **container's size**, not the viewport. This makes components truly reusable across different layout contexts.

### Basic Setup
```css
/* Define a container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Component adapts to its container width */
@container card (min-width: 400px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}

@container card (min-width: 600px) {
  .card {
    grid-template-columns: 250px 1fr auto;
  }
}
```

### With Tailwind CSS v4
```tsx
// Tailwind v4 built-in container query variants
<div className="@container">
  <div className="
    flex flex-col
    @sm:flex-row           /* when container ≥ 320px */
    @md:grid @md:grid-cols-3  /* when container ≥ 448px */
  ">
    <img className="
      w-full
      @sm:w-40              /* side thumbnail when container is wider */
      @md:col-span-1
    " />
    <div className="@md:col-span-2">
      <h3 className="text-base @sm:text-lg @md:text-xl">Title</h3>
      <p className="hidden @md:block">Extended description</p>
    </div>
  </div>
</div>
```

### Container Queries vs Media Queries

| Feature | Media Queries | Container Queries |
|---------|--------------|-------------------|
| Responds to | Viewport width | Container width |
| Reusability | Same component, different viewport | Same component, different layout context |
| Use case | Page-level layout | Component-level adaptation |
| Support | Universal | 95%+ (2025) |

**When to use which:**
- **Media queries**: Page-level layout changes (sidebar visible, nav style, overall grid)
- **Container queries**: Component adaptation (card layout, widget density, element visibility)
- **Both together**: Best results — media queries for page structure, container queries for component behavior

---

## CSS Subgrid — Perfect Nested Alignment

Subgrid lets nested grid items inherit parent grid tracks, solving the decades-old problem of aligning content across sibling cards.

```css
/* Parent grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Each card inherits parent rows for perfect alignment */
.product-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 4; /* image, title, description, price/button */
}

/* All titles align, all prices align, all buttons align —
   regardless of content length differences */
```

```tsx
// Tailwind
<div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
  {products.map(p => (
    <div key={p.id} className="grid grid-rows-subgrid row-span-4">
      <img src={p.image} alt={p.name} className="rounded-lg" />
      <h3 className="font-semibold">{p.name}</h3>
      <p className="text-[var(--text-2)]">{p.description}</p>
      <div className="flex items-end">
        <span className="font-bold">{p.price}</span>
        <Button className="ml-auto">Add to cart</Button>
      </div>
    </div>
  ))}
</div>
```

**Support:** 97%+ global (all major browsers since 2024).

---

## Fluid Typography & Spacing

Replace breakpoint-based jumps with smooth scaling using `clamp()`:

### Fluid Type Scale
```css
:root {
  /* font-size: clamp(minimum, preferred, maximum) */
  --text-sm:   clamp(0.80rem, 0.73rem + 0.36vw, 1.00rem);
  --text-base: clamp(1.00rem, 0.91rem + 0.45vw, 1.25rem);
  --text-lg:   clamp(1.25rem, 1.14rem + 0.57vw, 1.56rem);
  --text-xl:   clamp(1.56rem, 1.42rem + 0.71vw, 1.95rem);
  --text-2xl:  clamp(1.95rem, 1.78rem + 0.89vw, 2.44rem);
  --text-3xl:  clamp(2.44rem, 2.22rem + 1.11vw, 3.05rem);
  --text-4xl:  clamp(3.05rem, 2.78rem + 1.39vw, 3.81rem);
}
```

### Fluid Spacing Scale
```css
:root {
  --space-xs:  clamp(0.50rem, 0.45rem + 0.22vw, 0.625rem);
  --space-sm:  clamp(0.75rem, 0.68rem + 0.34vw, 0.94rem);
  --space-md:  clamp(1.00rem, 0.91rem + 0.45vw, 1.25rem);
  --space-lg:  clamp(1.50rem, 1.36rem + 0.68vw, 1.88rem);
  --space-xl:  clamp(2.00rem, 1.82rem + 0.91vw, 2.50rem);
  --space-2xl: clamp(3.00rem, 2.73rem + 1.36vw, 3.75rem);
  --space-3xl: clamp(4.00rem, 3.64rem + 1.82vw, 5.00rem);
}
```

**Tool:** [Utopia.fyi](https://utopia.fyi) generates complete fluid scales with visual preview.

### Why Fluid > Breakpoint Steps
- No jarring size jumps at breakpoints
- Perfect sizing at every viewport width
- Fewer CSS rules to maintain
- Works naturally with container queries

---

## Touch Targets

- Minimum **44×44px** for all interactive elements (WCAG 2.1)
- Recommended **48×48px** for primary actions
- Use `touch-manipulation` to prevent 300ms tap delay
- Adequate spacing between targets (at least 8px gap)

```tsx
<button className="
  min-w-[44px] min-h-[44px]
  touch-manipulation
  p-3
">
  Touch Friendly
</button>

{/* Larger primary actions */}
<Button className="
  min-h-[48px]
  touch-manipulation
  px-6 py-3
  text-base
">
  Primary Action
</Button>

{/* Icon buttons — explicit sizing */}
<button
  aria-label="Menu"
  className="
    w-11 h-11
    flex items-center justify-center
    touch-manipulation
  "
>
  <HamburgerMenu className="w-5 h-5" />
</button>
```

---

## Mobile Simplification Patterns

| Desktop Pattern | Mobile Adaptation |
|----------------|-------------------|
| Full nav bar | Hamburger menu or bottom tab bar |
| Side-by-side form fields | Stacked fields (full width) |
| Multi-column grid | Single column, swipeable carousel |
| Inline action buttons | Fixed bottom action bar |
| Data table | Collapsed cards or horizontal scroll |
| Visible sidebar | Hidden/collapsible drawer |
| Hover tooltips | Tap-to-reveal or long-press |
| Right-click context menu | Long-press menu or action sheet |
| Multi-panel layout | Tabbed/stacked panels with navigation |

### Bottom Sheet Pattern (Mobile)
```tsx
// Common mobile pattern: action sheets and bottom drawers
<div className="
  fixed inset-x-0 bottom-0
  bg-[var(--surface-1)]
  rounded-t-2xl
  shadow-[0_-4px_16px_oklch(0_0_0/0.08)]
  p-6 pb-safe  /* pb-safe for iOS safe area */
  transform transition-transform duration-300
  {isOpen ? 'translate-y-0' : 'translate-y-full'}
">
  {/* Drag handle */}
  <div className="w-10 h-1 bg-[var(--border)] rounded-full mx-auto mb-4" />
  {/* Content */}
</div>
```

### Safe Areas (Notch/Dynamic Island)
```css
/* Account for iOS safe areas */
.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.top-header {
  padding-top: env(safe-area-inset-top, 0px);
}

/* Tailwind utility */
<div className="pb-[env(safe-area-inset-bottom)]">
```

---

## Responsive Images

### Modern Approach
```tsx
// Responsive with art direction
<picture>
  {/* Mobile: square crop */}
  <source
    media="(max-width: 767px)"
    srcSet="hero-mobile.webp 400w, hero-mobile-2x.webp 800w"
    sizes="100vw"
  />
  {/* Desktop: wide crop */}
  <source
    srcSet="hero-desktop.webp 800w, hero-desktop-2x.webp 1600w, hero-desktop-3x.webp 2400w"
    sizes="(max-width: 1440px) 100vw, 1440px"
  />
  <img
    src="hero-fallback.jpg"
    alt="Descriptive alt text"
    loading="lazy"
    decoding="async"
    className="w-full h-auto"
  />
</picture>

// Next.js Image (handles optimization automatically)
import Image from 'next/image';
<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  priority          // Above the fold — don't lazy load
  className="w-full h-auto"
  alt="Descriptive text"
/>
```

### Image Loading Strategy
| Position | Loading | Why |
|----------|---------|-----|
| Above the fold (hero, header) | `priority` / `fetchpriority="high"` | Visible immediately |
| Below the fold | `loading="lazy"` | Load when approaching viewport |
| Background/decorative | `loading="lazy"` + `decoding="async"` | Low priority |

---

## Responsive Typography Patterns

### Headlines
```tsx
// Scale headline dramatically across breakpoints
<h1 className="
  text-3xl font-bold tracking-tight
  sm:text-4xl
  md:text-5xl
  lg:text-6xl
  xl:text-7xl
">
  Hero Headline
</h1>

// Or use fluid clamp (no breakpoints needed)
<h1 style={{ fontSize: 'clamp(2rem, 5vw + 0.5rem, 5rem)' }}>
  Hero Headline
</h1>
```

### Body Text
```css
/* Ensure readable line length on all screens */
.prose {
  max-width: 65ch;                    /* Optimal line length */
  font-size: var(--text-base);        /* Fluid base */
  line-height: 1.6;                   /* Generous for reading */
}

/* On very small screens, allow full width but maintain readability */
@container (max-width: 400px) {
  .prose {
    font-size: var(--text-sm);
    line-height: 1.7;                 /* More line height at smaller sizes */
  }
}
```

---

## Performance for Responsive

### Critical Rendering Path
- **Mobile**: Minimize initial CSS; inline critical styles
- **Images**: Use `srcset` + `sizes` — never load desktop images on mobile
- **Fonts**: Use `font-display: swap` to prevent invisible text; subset variable fonts
- **JavaScript**: Code-split per route; lazy-load below-fold components

### Core Web Vitals Targets
| Metric | Target | What It Measures |
|--------|--------|-----------------|
| **LCP** | <2.5s | Largest Contentful Paint — main content visible |
| **INP** | <200ms | Interaction to Next Paint — responsiveness |
| **CLS** | <0.1 | Cumulative Layout Shift — visual stability |

**Mobile-specific tips:**
- Set explicit `width`/`height` on images and iframes to prevent CLS
- Use `content-visibility: auto` for off-screen sections
- Avoid layout shifts from lazy-loaded content

---

## Testing

### Viewport Widths to Test
| Width | Represents |
|-------|-----------|
| 320px | iPhone SE (edge case — smallest common) |
| 375px | iPhone 13 mini |
| 390px | iPhone 14/15 |
| 430px | iPhone 15 Pro Max |
| 768px | iPad Mini / iPad |
| 1024px | iPad Pro / small laptop |
| 1280px | Standard laptop |
| 1440px | Desktop |
| 1920px | Large desktop |

### Testing Checklist
- [ ] Layout doesn't break at any width between 320px–1920px
- [ ] No horizontal scrolling (except intentional carousels)
- [ ] Touch targets are ≥44px on mobile
- [ ] Text is readable without zooming on mobile (≥16px body)
- [ ] Images scale without distortion
- [ ] Navigation is accessible on all sizes
- [ ] Forms are usable on mobile (fields don't overlap, inputs are full-width)
- [ ] Modals/popovers are usable on small screens
- [ ] `prefers-reduced-motion` is respected
- [ ] Safe areas accounted for (notch, home indicator)
- [ ] Landscape orientation works on mobile/tablet

### Device Testing Priority
1. **Your primary audience device** (check analytics)
2. iPhone Safari (different rendering quirks)
3. Android Chrome (most common globally)
4. iPad Safari (tablet breakpoints)
5. Desktop Chrome, Firefox, Safari

---

## Resources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Container Queries (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [CSS Subgrid (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [Utopia.fyi](https://utopia.fyi) — Fluid type and space calculator
- [Every Layout](https://every-layout.dev/) — Intrinsic responsive layouts
- [Core Web Vitals (web.dev)](https://web.dev/vitals/)
