# Responsive Design Reference

Implementation guide for responsive, mobile-first designs with research-backed patterns.

## Table of Contents

1. [Mobile-First Approach](#mobile-first-approach)
2. [Breakpoint Strategy](#breakpoint-strategy)
3. [Layout Patterns](#responsive-layouts)
4. [Typography](#responsive-typography)
5. [Navigation](#navigation-patterns)
6. [Forms](#responsive-forms)
7. [Touch Interfaces](#touch-friendly-interfaces)
8. [Content Strategy](#responsive-content-strategy)
9. [Performance](#performance-optimization)
10. [Testing](#testing-responsive-designs)

---

## Mobile-First Approach

**63% of users abandon sites due to mobile usability issues.** Start with mobile, enhance for larger screens.

- Forces focus on essential content
- Easier to scale up than scale down
- Better performance on mobile devices
- Aligns with usage patterns

**Content breakpoints should take priority over device breakpoints.** Where your content breaks is more important than rigid device widths.

---

## Breakpoint Strategy

### Standard Breakpoints

```css
/* Mobile first — base styles: 0-479px */

@media (min-width: 480px) { /* Large phones */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Laptops */ }
@media (min-width: 1280px) { /* Desktops */ }
@media (min-width: 1536px) { /* Large desktops */ }
```

### Breakpoint Reference

| Range | Pixels | Devices | Layout Strategy |
|---|---|---|---|
| **XS** | 0-479px | Small phones (iPhone SE) | Single column, stacked nav, 44px+ touch targets |
| **SM** | 480-767px | Large phones (iPhone 14+) | Single column, bottom nav, reduced complexity |
| **MD** | 768-1023px | Tablets (iPad) | 2 columns possible, sidebar nav |
| **LG** | 1024-1439px | Laptops, landscape tablets | Multi-column, full nav, desktop patterns |
| **XL** | 1440px+ | Desktop monitors | Max-width containers, multi-panel layouts |

### Simplification by Breakpoint

| Element | Mobile | Desktop |
|---|---|---|
| Navigation | Hamburger menu / bottom bar | Full nav bar |
| Forms | Stacked fields | Side-by-side fields |
| Content | Single column | Multi-column grid |
| Actions | Fixed bottom bar | Inline buttons |
| Tables | Collapsed cards | Full data table |
| Sidebars | Hidden/collapsible | Always visible |
| Filters | Modal/drawer | Sidebar panel |

### Tailwind Responsive Classes

```tsx
<div className="
  w-full          // mobile: full width
  sm:w-1/2        // 480px+: half width
  md:w-1/3        // 768px+: third width
  lg:w-1/4        // 1024px+: quarter width
">
  Responsive width
</div>
```

---

## Responsive Layouts

### CSS Grid — Automatic Reflow

```tsx
// No media queries needed — auto-reflows based on available space
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-6
">
  {items.map(item => <Card key={item.id} />)}
</div>

// Pure CSS auto-fit pattern (no breakpoints at all)
// Items are minimum 250px, expand to fill available space
<div style={{ 
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem'
}}>
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Flexbox — Stack to Row

```tsx
<div className="
  flex
  flex-col           // mobile: stack vertically
  md:flex-row        // 768px+: horizontal layout
  gap-6
  items-center
">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

### Container Queries (Full Browser Support 2025)

Components respond to their parent container, not the viewport:

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { flex-direction: row; }
}

@container (max-width: 399px) {
  .card { flex-direction: column; }
}
```

**Best practice:** Media queries for macro layout (page columns, sidebar visibility). Container queries for micro layout (component reflow, widget density).

### Grid Columns — Responsive Pattern

Desktop: 12 columns → Tablet: 8 → Mobile: 4
Gutters: 16px (mobile), 24px (tablet/desktop)
Max container widths: 960px (laptop), 1200px (desktop), 1400px (large)

---

## Responsive Typography

### Fluid Typography with clamp() (Modern Standard)

```css
h1 {
  /* min: 2rem, preferred: 5vw, max: 4rem */
  font-size: clamp(2rem, 1rem + 3vw, 4rem);
  line-height: 1.2;
}

p {
  /* min: 1rem, preferred: 2.5vw, max: 1.25rem */
  font-size: clamp(1rem, 0.8rem + 1vw, 1.25rem);
  line-height: 1.6;
}
```

**Critical:** Always combine `rem` + `vw` in the preferred value (never pure `vw`) to ensure text scales when users zoom. Tools: Utopia, Fluid Type Scale Calculator.

### Tailwind Responsive Type

```tsx
<h1 className="
  text-3xl      // mobile: 30px
  sm:text-4xl   // 480px: 36px
  md:text-5xl   // 768px: 48px
  lg:text-6xl   // 1024px: 60px
">
  Responsive Headline
</h1>
```

Reduce sizes on mobile by 20-30% compared to desktop. Reduce hierarchy levels on small screens (fewer distinct sizes).

---

## Navigation Patterns

### Research Insight

NNGroup study (179 participants): **Visible navigation consistently outperforms hidden navigation** across all UX metrics. Discoverability is "cut almost in half" by hiding it behind hamburger menus.

**Desktop:** Never use hamburger when space permits. "Combo" approach (some visible, overflow in menu) performs best.

**Mobile:** Bottom navigation for 3-5 top-level destinations in thumb zone.

### Mobile Menu Pattern

```tsx
import { useState } from 'react';
import { List, X } from '@phosphor-icons/react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <List size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <nav className="p-6 space-y-4">
            {/* Navigation items */}
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden md:flex gap-6">
        {/* Navigation items */}
      </nav>
    </>
  );
}
```

### Sticky Navigation

```tsx
<header className="
  sticky top-0 z-40
  bg-white/80
  backdrop-blur-md
  border-b border-slate-200
">
  <nav className="container mx-auto px-4 py-4">
    {/* Nav content */}
  </nav>
</header>
```

**WCAG 2.4.11:** Ensure sticky headers don't obscure focused elements. Use `scroll-mt-16` (or appropriate value) on content sections.

---

## Responsive Forms

### Research-Backed Form Design

- Single-column layouts recommended by NNGroup, Material Design, Apple HIG
- Forms with usability guidelines: **78% first-attempt completion** vs 42% (CHI research)
- Labels above inputs, never rely on placeholder alone
- Minimum input font size: **16px** (prevents iOS zoom on focus)

```tsx
<form className="space-y-6">
  {/* Side-by-side on desktop, stacked on mobile */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
        First Name
      </label>
      <input
        id="firstName"
        type="text"
        className="
          w-full px-4 py-2
          border border-slate-300 rounded-lg
          focus:ring-2 focus:ring-blue-500
          touch-manipulation
          text-base  /* 16px — prevents iOS zoom */
        "
      />
    </div>
    <div>
      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
        Last Name
      </label>
      <input
        id="lastName"
        type="text"
        className="
          w-full px-4 py-2
          border border-slate-300 rounded-lg
          focus:ring-2 focus:ring-blue-500
          touch-manipulation
          text-base
        "
      />
    </div>
  </div>

  <button
    type="submit"
    className="
      w-full md:w-auto
      px-8 py-3
      bg-blue-600 text-white rounded-lg
      hover:bg-blue-700
      transition-colors
      touch-manipulation
      min-h-[44px]  /* Touch target minimum */
    "
  >
    Submit
  </button>
</form>
```

---

## Touch-Friendly Interfaces

### Touch Target Sizing

- **Apple HIG:** Minimum **44×44px**
- **Material Design:** Recommended **48×48px**
- **WCAG 2.5.8 (AA):** Minimum **24×24px** with adequate spacing

```tsx
<button className="
  min-w-[44px] min-h-[44px]
  px-4 py-2
  rounded-lg
  touch-manipulation  /* prevents 300ms tap delay */
">
  Tap Me
</button>
```

### Scroll Behaviors

```tsx
<div className="
  overflow-x-auto
  snap-x snap-mandatory
  overscroll-contain   /* prevent bounce on mobile */
  -webkit-overflow-scrolling-touch
">
  {/* Horizontally scrollable content */}
</div>
```

### Intentional Tap Delay

Stripe uses a deliberate **100ms tap delay** on mobile dashboard cards to create a sense of intentionality that users perceive as premium quality. Consider this for non-urgent interactive elements.

---

## Responsive Content Strategy

### Show/Hide by Breakpoint

```tsx
<div>
  {/* Mobile-only simplified content */}
  <div className="block md:hidden">
    Mobile summary
  </div>

  {/* Desktop-only detailed content */}
  <div className="hidden md:block">
    Full desktop content with details
  </div>
</div>
```

### Responsive Data Tables

```tsx
// Desktop: full table | Mobile: stacked cards
<div className="hidden md:block">
  <table>
    <thead>
      <tr>
        <th className="text-left">Name</th>
        <th className="text-right">Amount</th>
        <th className="text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {data.map(row => (
        <tr key={row.id}>
          <td className="text-left">{row.name}</td>
          <td className="text-right font-tabular-nums">{row.amount}</td>
          <td className="text-left">{row.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="md:hidden space-y-4">
  {data.map(row => (
    <div key={row.id} className="border rounded-lg p-4">
      <div className="font-medium">{row.name}</div>
      <div className="flex justify-between mt-2">
        <span className="text-slate-600">Amount</span>
        <span className="font-tabular-nums">{row.amount}</span>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-slate-600">Status</span>
        <span>{row.status}</span>
      </div>
    </div>
  ))}
</div>
```

### Hero Section Pattern

```tsx
<section className="
  relative min-h-screen flex items-center
  px-4 sm:px-6 lg:px-8
">
  <div className="
    max-w-7xl mx-auto w-full
    grid grid-cols-1 lg:grid-cols-2
    gap-12 items-center
  ">
    <div className="space-y-6">
      <h1 className="
        text-4xl sm:text-5xl lg:text-6xl
        font-bold tracking-tight
      ">
        Your Headline Here
      </h1>
      <p className="
        text-lg sm:text-xl text-slate-600
        max-w-2xl
      ">
        Supporting description across all screen sizes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="
          px-8 py-3 bg-blue-600 text-white rounded-lg
          hover:bg-blue-700 transition-colors
          min-h-[44px]
        ">
          Primary Action
        </button>
        <button className="
          px-8 py-3 border-2 border-slate-300 rounded-lg
          hover:border-slate-400 transition-colors
          min-h-[44px]
        ">
          Secondary Action
        </button>
      </div>
    </div>
    <div className="relative aspect-square rounded-2xl overflow-hidden">
      <img
        src="hero.jpg"
        alt="Hero"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  </div>
</section>
```

### Bento Grid Pattern (2025-2026 Trend)

Research shows carousel slides get **<1% click rates**, while bento grids surface more content simultaneously:

```tsx
<div className="
  grid gap-4
  grid-cols-2 md:grid-cols-4
  grid-rows-[auto]
">
  {/* Large featured item */}
  <div className="col-span-2 row-span-2 rounded-2xl bg-slate-100 p-6">
    Featured Content
  </div>
  {/* Smaller items */}
  <div className="rounded-2xl bg-slate-100 p-4">Item 2</div>
  <div className="rounded-2xl bg-slate-100 p-4">Item 3</div>
  <div className="col-span-2 rounded-2xl bg-slate-100 p-4">Wide Item</div>
</div>
```

---

## Performance Optimization

### Images

```tsx
// Lazy loading
<img src="image.jpg" alt="Description" loading="lazy" />

// Responsive images with srcset
<img
  src="image-800w.jpg"
  srcSet="image-400w.jpg 400w, image-800w.jpg 800w, image-1200w.jpg 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Description"
  loading="lazy"
/>
```

### CSS Performance

- Use CSS animations over JavaScript (better performance)
- Animate only `transform` and `opacity`
- Use `will-change` sparingly
- `touch-manipulation` prevents 300ms tap delay

### Responsive Video

```tsx
<div className="relative aspect-video">
  <video
    className="absolute inset-0 w-full h-full object-cover"
    poster="thumbnail.jpg"
    controls
    preload="metadata"
  >
    <source src="video.mp4" />
  </video>
</div>
```

---

## Testing Responsive Designs

### Essential Device Tests

| Device | Width | Priority |
|---|---|---|
| iPhone SE | 375px | Essential (smallest common) |
| iPhone 14 Pro | 393px | High |
| iPad | 768px | High |
| iPad Pro | 1024px | Medium |
| Desktop | 1280px+ | Essential |

### Quick Testing Checklist

- [ ] Content readable without horizontal scrolling at all breakpoints
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] No text smaller than 16px in form inputs (prevents iOS zoom)
- [ ] Images scale properly and don't overflow
- [ ] Navigation accessible at all breakpoints
- [ ] Focus states visible on keyboard navigation
- [ ] Sticky headers don't obscure focused content
- [ ] Forms usable on mobile (stacked fields, large targets)
- [ ] Tables responsive (cards on mobile or horizontal scroll)
- [ ] Loading states visible on slow connections

### Chrome DevTools

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at common breakpoints
4. Throttle network to simulate mobile connections
5. Check Performance tab for 60fps animations

---

## Resources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)
- [Utopia Fluid Type Calculator](https://utopia.fyi/)
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
