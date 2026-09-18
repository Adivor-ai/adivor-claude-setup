# Performance

## Avoid Barrel Files

Barrel files (`index.ts` re-exporting everything) are the single biggest performance mistake in component libraries. Atlassian saw 75% faster builds after removing them. Vercel found recursive barrels adding 23 seconds to compilation.

```tsx
// WRONG — barrel file forces bundler to process every component
import { Button, Input } from 'components';

// CORRECT — direct imports enable tree-shaking
import { Button } from 'components/Button';
import { Input } from 'components/Input';
```

If distributing a library, configure `package.json` subpath exports:

```json
{
  "exports": {
    "./Button": "./dist/Button/index.js",
    "./Input": "./dist/Input/index.js",
    "./Card": "./dist/Card/index.js"
  },
  "sideEffects": false
}
```

---

## CSS Cascade Layers

Use `@layer` to make component library styles overridable without `!important`:

```css
@layer base, tokens, components, utilities;

@layer components {
  .btn { /* library defaults */ }
}

/* Consumer overrides — un-layered CSS always wins */
.btn.custom { /* overrides without !important */ }
```

---

## CSS Containment for Heavy Lists

Use `content-visibility: auto` on off-screen heavy components to skip rendering:

```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 72px; /* estimated height prevents layout shift */
}
```

---

## Container Queries for Portable Components

Use `@container` instead of viewport media queries so components respond to their container:

```css
.card-container { container-type: inline-size; }

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
@container (max-width: 399px) {
  .card { flex-direction: column; }
}
```
