---
name: framer-motion
description: >
  framer-motion animations in Next.js + React + Tailwind projects.
  Use when the user mentions: framer motion, animate, animation, animación,
  motion, transition, hover animation, scroll animation, page transition,
  AnimatePresence, layout animation, spring, keyframes, variants, gesture,
  drag, exit animation, entrance animation, fade in, slide in, stagger,
  useAnimation, useInView, useScroll, motion.div, whileHover, whileTap.
---

# framer-motion — Next.js App Router

## Import

```tsx
import { motion, AnimatePresence, useInView, useScroll, useAnimation } from 'framer-motion'
```

Siempre importar desde `"framer-motion"` directamente. Agregar `"use client"` en cualquier componente que use motion.

## Patrones fundamentales

### Fade in básico
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
```

### Variants (preferir sobre props inline para componentes reutilizables)
```tsx
import type { Variants } from 'framer-motion'

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit:   { opacity: 0, scale: 0.95 },
}

<motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" />
```

### Stagger (lista con entrada escalonada)
```tsx
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(i => <motion.li key={i.id} variants={item} />)}
</motion.ul>
```

### AnimatePresence (exit animations al desmontar)
```tsx
// MUST wrap el render condicional
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

### Scroll-triggered con useInView
```tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-100px' })

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 40 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
```

## Guía de valores

| Propiedad | Micro UI | Normal | Hero |
|-----------|----------|--------|------|
| `duration` | 0.15–0.2 | 0.3–0.5 | 0.6–1.0 |
| `ease` | `'easeOut'` entrada · `'easeIn'` salida | | `[0.34,1.56,0.64,1]` spring |
| `staggerChildren` | — | 0.05–0.1 | — |
| `delay` máx | 0.1 | 0.3 | 0.5 |

## Reglas

- `"use client"` obligatorio en App Router para cualquier componente con `motion.*`
- No animes `width`/`height` con `%` — usa `scaleX`/`scaleY`
- Usa `layout` prop para cambios de posición automáticos: `<motion.div layout>`
- `key` único y estable en hijos de `AnimatePresence` — sin index como key
- No pongas `motion.div` en TODO — solo donde la animación aporta valor real
- No animes color de texto/border — anima `opacity` en su lugar (más barato)

## Anti-patterns

- ❌ `position: fixed` dentro de `motion.div` con `layout` animations — rompe el tracking
- ❌ Animaciones > 600ms en interacciones de usuario — se sienten lentas
- ❌ Olvidar re-throw de errores dentro de motion callbacks
