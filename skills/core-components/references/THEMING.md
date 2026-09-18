# Theming

## CSS Custom Properties as the Foundation

All tokens resolve to CSS custom properties at runtime. Theme switching redefines only the semantic layer — components never change.

```css
/* Light theme (default) */
:root, [data-theme="light"] {
  --color-text-primary: var(--color-neutral-900);
  --color-surface-default: var(--color-white);
  --color-surface-elevated: var(--color-neutral-50);
  --color-border-default: var(--color-neutral-200);
}

/* Dark theme — only semantic mappings change */
[data-theme="dark"] {
  --color-text-primary: var(--color-neutral-100);
  --color-surface-default: var(--color-neutral-950);
  --color-surface-elevated: var(--color-neutral-900);
  --color-border-default: var(--color-neutral-800);
}
```

**Use the CSS `light-dark()` function** (Baseline 2024) where supported to simplify single-property dark mode:

```css
:root {
  color-scheme: light dark;
  --card-shadow: light-dark(
    0 1px 3px rgba(0,0,0,0.12),
    0 1px 3px rgba(0,0,0,0.4)
  );
}
```

---

## Multi-Brand Theming

For multi-brand systems, layer brand tokens over a shared core:

```css
/* Shared core (all brands) */
:root {
  --spacing-4: 16px;
  --radius-lg: 12px;
  --font-body: 'Inter', sans-serif;
}

/* Brand A */
[data-brand="alpha"] {
  --color-brand-primary: var(--color-blue-600);
  --color-brand-accent: var(--color-teal-500);
}

/* Brand B */
[data-brand="beta"] {
  --color-brand-primary: var(--color-purple-600);
  --color-brand-accent: var(--color-orange-500);
}

/* Combine brand × mode */
[data-brand="alpha"][data-theme="dark"] {
  --color-brand-primary: var(--color-blue-400);
}
```

Components reference only semantic tokens — they never know which brand or theme is active.

---

## Tailwind v4 as Token System

Tailwind v4 (January 2025) eliminated the JS config file. Tokens are now defined directly in CSS:

```css
@import "tailwindcss";

@theme {
  --color-brand-500: #0052CC;
  --color-surface-default: #ffffff;
  --spacing-element-gap: 16px;
  --radius-card: 12px;
}
```

Every `@theme` value becomes both a utility class (`bg-brand-500`) and a CSS custom property (`var(--color-brand-500)`), making Tailwind v4 a design token system by default.
