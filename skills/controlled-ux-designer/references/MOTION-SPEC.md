# Motion Specification

Detailed animation specifications for consistent motion design across projects.

## Table of Contents

1. [Easing Curves](#easing-curves)
2. [Duration Tables](#duration-tables)
3. [State-Specific Animations](#state-specific-animations)
4. [Common Animation Patterns](#common-animation-patterns)
5. [Gestalt Motion Principles](#animation--gestalt-principles)
6. [Performance Checklist](#performance-checklist)
7. [Accessibility](#accessibility)

---

## Easing Curves

### Standard Easings

| Name | Curve | Use Case |
|---|---|---|
| **Ease-out** (entrances) | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering view, expanding, appearing |
| **Ease-in** (exits) | `cubic-bezier(0.4, 0.0, 1, 1)` | Elements leaving view, collapsing, disappearing |
| **Ease-in-out** (transitions) | `cubic-bezier(0.4, 0.0, 0.2, 1)` | State changes, transformations, element swaps |
| **Linear** (continuous) | `linear` | Loading spinners, continuous animations, marquee |

### Custom Easings

| Name | Curve | Use Case |
|---|---|---|
| **Spring** (bouncy) | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful interactions, game-like UIs |
| **Sharp** (quick snap) | `cubic-bezier(0.4, 0.0, 0.6, 1)` | Mechanical interactions, precise movements |

---

## Duration Tables

### By Interaction Type

| Interaction | Duration | Easing | Example |
|---|---|---|---|
| Button press | 100ms | ease-out | Background color change |
| Hover state | 150ms | ease-out | Underline appearing |
| Checkbox toggle | 150ms | ease-out | Checkmark animation |
| Tooltip appear | 200ms | ease-out | Tooltip fade in |
| Tab switch | 250ms | ease-in-out | Content swap |
| Accordion expand | 300ms | ease-out | Height animation |
| Modal open | 300ms | ease-out | Fade + scale up |
| Modal close | 250ms | ease-in | Fade + scale down |
| Toast notification | 300ms | ease-out | Slide in from top |
| Sheet slide-in | 300ms | ease-out | Bottom sheet |
| Page transition | 400ms | ease-in-out | Route change |

### By Element Weight

| Weight | Duration | Examples |
|---|---|---|
| Lightweight (<100px) | 150ms | Icons, badges, chips |
| Standard (100-500px) | 300ms | Cards, panels, list items |
| Weighty (>500px) | 500ms | Modals, full-page transitions |

### By Brand Speed

| Brand Type | UI | State Changes | Pages |
|---|---|---|---|
| Fast (trading, productivity) | 100-150ms | 200ms | 300ms |
| Standard (most apps) | 150ms | 300ms | 400ms |
| Slow (wellness, luxury) | 200ms | 400ms | 500-700ms |

---

## State-Specific Animations

### Hover States

```tsx
// Button — color shift
<button className="
  bg-blue-600 hover:bg-blue-700
  transition-colors duration-150 ease-out
">
  Hover Me
</button>

// Card — subtle lift
<div className="
  transition-all duration-200 ease-out
  hover:shadow-lg hover:scale-[1.02]
">
  Card Content
</div>

// Link — underline reveal
<a className="
  underline-offset-4 hover:underline
  transition-all duration-200 ease-out
">
  Link Text
</a>
```

### Focus States

```tsx
// Keyboard focus ring (never remove, always enhance)
<button className="
  focus:outline-none
  focus:ring-4 focus:ring-blue-500
  focus:ring-offset-2
  transition-all duration-200 ease-out
">
  Focus Me
</button>

// Input focus
<input className="
  border-2 border-slate-300
  focus:border-blue-500
  focus:ring-4 focus:ring-blue-200
  transition-all duration-200 ease-out
" />
```

### Active/Pressed States

```tsx
// Button press — subtle scale down
<motion.button
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.1, ease: "easeIn" }}
>
  Press Me
</motion.button>

// CSS alternative
<button className="
  active:scale-[0.98]
  transition-transform duration-100 ease-in
">
  Press Me
</button>
```

### Disabled States

```tsx
<button
  disabled
  className="
    bg-slate-400 text-slate-600
    opacity-50 cursor-not-allowed
    pointer-events-none
  "
>
  Disabled
</button>
```

### Loading States

```tsx
// Spinner
<div className="
  w-8 h-8 border-4 border-slate-300
  border-t-blue-600 rounded-full
  animate-spin
" />

// Skeleton loader (shimmer)
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-slate-200 rounded w-3/4" />
  <div className="h-4 bg-slate-200 rounded w-1/2" />
</div>
```

**Research insight:** Skeleton screens with shimmer animations reduce perceived wait time significantly. Standard since Twitter pioneered them in 2012.

### Success Feedback

```tsx
// Checkmark entrance
<motion.div
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  <CheckCircle className="text-green-600" size={48} />
</motion.div>

// Toast notification slide-in
<motion.div
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -100, opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="bg-green-600 text-white p-4 rounded-lg"
>
  Success! Changes saved.
</motion.div>
```

### Error Feedback

```tsx
// Shake animation
<motion.div
  animate={{ x: [0, -4, 4, -4, 4, 0] }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="border-2 border-red-500"
>
  <input type="text" />
</motion.div>

// Error message slide-in
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
  className="text-red-600 text-sm"
>
  Please enter a valid email address
</motion.div>
```

### Form Validation (On Blur)

```tsx
<input
  onBlur={(e) => {
    const isValid = validateEmail(e.target.value);
    setError(!isValid);
  }}
  className={`
    border-2 transition-all duration-200 ease-out
    ${error
      ? 'border-red-500 focus:ring-red-200'
      : 'border-slate-300 focus:ring-blue-200'
    }
  `}
/>

{error && (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-red-600 text-sm mt-1"
  >
    Please enter a valid email
  </motion.p>
)}
```

---

## Common Animation Patterns

### Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>
```

### Slide Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>
```

### Scale + Fade (Modal)
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Modal content
</motion.div>
```

### Stagger Children
```tsx
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Background Animations

Slow, looping, subtle CSS/SVG animations that add atmosphere:
- Gradient mesh shifts (slow color interpolation)
- Floating geometric particles
- Noise texture overlays with subtle movement
- Subtle parallax on scroll

**Rule:** Background animations should be felt, not seen. If a user notices the animation itself, it's too prominent.

---

## Animation & Gestalt Principles

### Proximity
Animated elements near each other move together to reinforce grouping:
```tsx
// Card and its children animate as one unit
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <h3>Title</h3>
  <p>Content</p>
  <button>Action</button>
</motion.div>
```

### Similarity
Similar elements share animation characteristics:
```tsx
const buttonAnimation = {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.15, ease: "easeOut" }
};

<motion.button {...buttonAnimation}>Button 1</motion.button>
<motion.button {...buttonAnimation}>Button 2</motion.button>
```

### Continuity
Movement follows natural, smooth paths:
```tsx
<motion.div
  animate={{ x: [0, 50, 100], y: [0, -25, 0] }}
  transition={{ duration: 1, ease: "easeInOut" }}
/>
```

### Figure-Ground
Important elements animate while backgrounds stay stable:
```tsx
<>
  {/* Background fades to overlay */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.5 }}
    className="fixed inset-0 bg-black"
  />
  {/* Modal animates in with scale + fade */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed inset-0 flex items-center justify-center"
  >
    Modal Content
  </motion.div>
</>
```

---

## Performance Checklist

- [ ] Only animate `transform` and `opacity` (GPU-accelerated, smooth 60fps)
- [ ] Never animate `width`, `height`, `top`, `left`, `margin`, `padding` (causes reflow/repaint)
- [ ] Test on low-end mobile devices (60fps on your machine ≠ 60fps on user's phone)
- [ ] Use `will-change` sparingly for complex animations
- [ ] Keep UI animation duration under 500ms
- [ ] Prefer CSS animations for simple transitions (better performance than JS)
- [ ] Use JS animation libraries (Motion/Framer Motion) only for complex choreography
- [ ] No flashing content (max 3 flashes per second — WCAG 2.3.1)
- [ ] Check Chrome DevTools Performance tab for dropped frames

**Motion library note:** Motion (formerly Framer Motion) processes 16M+ npm downloads monthly. Use for React production UIs that need complex choreography.

---

## Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**React implementation:**
```tsx
import { useReducedMotion } from 'framer-motion';

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.3,
        ease: "easeOut"
      }}
    >
      Content
    </motion.div>
  );
}
```

**~35% of adults over 40** are affected by motion sensitivity. This is not a niche concern.

---

## Resources

- [Motion Documentation](https://motion.dev/)
- [CSS Easing Functions](https://easings.net/)
- [Material Design Motion](https://m2.material.io/design/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
