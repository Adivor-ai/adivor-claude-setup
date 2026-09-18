# Motion Specification

Motion should surprise and delight while serving function. Animation is a creative tool — but purposeful motion always outperforms decorative motion.

## Easing Curves

| Easing | CSS Value | Use For |
|--------|-----------|---------|
| **Ease-out** | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Entrances, appearing elements |
| **Ease-in** | `cubic-bezier(0.4, 0.0, 1, 1)` | Exits, disappearing elements |
| **Ease-in-out** | `cubic-bezier(0.4, 0.0, 0.2, 1)` | State changes, transforms |
| **Spring** | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful, attention-grabbing, overshoot |
| **Snappy** | `cubic-bezier(0.2, 0, 0, 1)` | Quick UI feedback, toggles |
| **Linear** | `linear` | Spinners, continuous loops, progress bars |

## Duration by Element Weight

| Weight | Duration | Examples |
|--------|----------|----------|
| **Lightweight** | 100–150ms | Icons, badges, chips, toggles |
| **Standard** | 200–300ms | Cards, panels, list items, tabs |
| **Weighty** | 400–500ms | Modals, page transitions, drawers |
| **Ambient** | 8,000–20,000ms | Background effects, floating elements |

## Duration by Interaction

| Interaction | Duration | Notes |
|-------------|----------|-------|
| Button press | 100ms | Immediate tactile feedback |
| Hover state | 150ms | Quick enough to feel responsive |
| Tooltip appear | 200ms | Slight delay prevents flicker |
| Tab switch | 250ms | Content swap with cross-fade |
| Modal open | 300ms | Scale + fade entrance |
| Dropdown open | 200ms | Slide down + fade |
| Page transition | 400ms | Full content swap |
| Toast notification | 300ms in, 200ms out | Ease-out in, ease-in out |

## High-Impact Animation Patterns

### Staggered Reveal (Most Impactful)

One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

```css
/* CSS-only staggered reveal */
.reveal-item {
  opacity: 0;
  transform: translateY(20px);
  animation: reveal 0.5s ease-out forwards;
}
.reveal-item:nth-child(1) { animation-delay: 0ms; }
.reveal-item:nth-child(2) { animation-delay: 80ms; }
.reveal-item:nth-child(3) { animation-delay: 160ms; }
.reveal-item:nth-child(4) { animation-delay: 240ms; }

@keyframes reveal {
  to { opacity: 1; transform: translateY(0); }
}
```

**Stagger timing principles:**
- Base delay: 50–150ms between elements (faster = energetic, slower = elegant)
- Total sequence: keep under 1s or users lose patience
- Patterns: linear (predictable), eased (accelerating/decelerating), random (chaotic)
- Direction: left-to-right, top-to-bottom, diagonal, center-out, or edge-in

### Scroll-Triggered Animations

Use Intersection Observer for performant scroll detection:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

```css
[data-animate="fade-up"] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
[data-animate="fade-up"].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Hover State Transformations

```css
.card-hover {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.card-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
}
```

**Hover principles:**
- `translateY(-4px)` for subtle lift
- `scale(1.02–1.05)` for emphasis
- Glow via `box-shadow` with accent color at low opacity
- Combine transforms for richer effect
- Always pair with `transition` for smoothness

### Background Atmosphere

```css
/* Grain/noise texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* tiny SVG noise */
  opacity: 0.04;
  pointer-events: none;
  z-index: 9999;
}

/* Floating ambient orbs */
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}
.ambient-orb {
  animation: float 12s ease-in-out infinite;
  opacity: 0.15;
}
```

**Ambient motion principles:**
- Duration: 8–20s (slow = calming, faster = energetic)
- Transform types: translateY (floating), scale (breathing), rotate (orbiting)
- Easing: `ease-in-out` for organic feel
- Intensity: Subtle (5–20px) for backgrounds, bolder for hero elements
- Layer multiple elements at different speeds for parallax depth

### Infinite Marquee/Ticker

```css
.marquee-track {
  display: flex;
  gap: 2rem;
  animation: scroll 40s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused; /* accessibility */
}
@keyframes scroll {
  to { transform: translateX(-50%); }
}
```

**Marquee principles:**
- Speed: 20–60s full cycle (slower = premium, faster = urgency)
- Duplicate content 2× for seamless loop
- Always pause on hover/focus for accessibility
- Consistent gap between items via flexbox

### Data Visualization Motion

- Progress bars that fill on scroll-trigger with `ease-out` easing
- Stat counters that count up when visible (use requestAnimationFrame)
- Chart elements that draw in sequentially with staggered delays
- Easing that slows at the end for natural "settling" feel

## Motion with React (Motion Library)

```tsx
import { motion } from "motion/react";

// Fade + slide entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>

// Stagger children
<motion.ul
  variants={{
    visible: { transition: { staggerChildren: 0.08 } }
  }}
  initial="hidden"
  animate="visible"
>
  <motion.li variants={{
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  }} />
</motion.ul>

// Scroll-triggered
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-100px" }}
/>
```

**Motion library** (formerly Framer Motion): 16M+ npm downloads/month. The standard for React production animation.

## Performance Rules

**Only animate `transform` and `opacity`** — these are GPU-accelerated and don't trigger layout recalculation.

**Avoid animating:** `width`, `height`, `margin`, `padding`, `top`, `left`, `border`, `font-size` — these trigger expensive layout reflows.

**Duration ceiling:** Keep UI interaction animations under 500ms. Longer feels sluggish.

**Reduce motion (mandatory):**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

~35% of adults over 40 are affected by motion sensitivity. This is not optional.

## Resources
- [Motion (Framer Motion)](https://motion.dev/)
- [Easings.net](https://easings.net/) — visual easing reference
- [CSS Animation Rocks](https://cssanimation.rocks/)
