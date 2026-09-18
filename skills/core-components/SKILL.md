---
name: core-components
description: Core component library and design system patterns for building modern UI. Trigger this skill whenever building UI components, using design tokens, working with component libraries, theming, creating accessible interfaces, structuring a design system, or choosing between headless/styled component approaches. Also use when the user mentions shadcn, Radix, Base UI, Tailwind theming, token architecture, WCAG compliance, component composition patterns, or design-to-code workflows. Even if the user just says "build a form" or "make a card component," this skill applies.
---

# Core Components & Design System Patterns

This skill defines how to build UI using a token-driven, accessibility-first component architecture. It reflects the industry consensus as of 2025: the W3C Design Tokens spec is stable, headless primitives are the default building block, composition beats configuration, and zero-runtime styling is the target for server-compatible components.

Every guidance here serves one goal: **components should be consistent, accessible, performant, and machine-readable** (by both developers and AI tools).

---

## Design Tokens

**Never hard-code visual values. Every color, spacing unit, font size, radius, shadow, and motion duration must come from a token.**

Hard-coded values create drift, break theming, resist automation, and make AI-assisted refactoring unreliable. Tokens are the single source of truth that connects design tools (Figma, Penpot) to code.

### Three-Tier Token Architecture

Organize tokens into three layers. This structure is validated by the W3C DTCG specification (stable October 2025) and adopted by Shopify Polaris, Salesforce Lightning, and Adobe Spectrum.

```
┌─────────────────────────────────────────────────┐
│  PRIMITIVE TOKENS (raw values, private)         │
│  color.blue.600 = #0052CC                       │
│  spacing.4 = 16px                               │
│  font.size.400 = 16px                           │
├─────────────────────────────────────────────────┤
│  SEMANTIC TOKENS (purpose-driven, theme-aware)  │
│  color.text.primary → color.neutral.900         │
│  color.surface.brand → color.blue.600           │
│  spacing.element.gap → spacing.4                │
├─────────────────────────────────────────────────┤
│  COMPONENT TOKENS (scoped, use sparingly)       │
│  button.primary.bg → color.surface.brand        │
│  card.border.radius → radius.lg                 │
└─────────────────────────────────────────────────┘
```

**Rules:**
- Primitive tokens hold raw values and should be private/hidden from consumers. Changing a primitive is a non-breaking change.
- Semantic tokens describe purpose, not appearance. They are the public API of your token system. Components reference these.
- Component tokens are optional — use only when a component genuinely needs a value that doesn't map to any semantic token. Excessive component tokens create bloat.
- Tokens alias upward: component → semantic → primitive. Never skip a level.

### Token Naming Convention

Use structured, predictable names: `{namespace}.{category}.{concept}.{modifier}.{state}`

```
// Good — semantic, scannable, no ambiguity
color.text.primary
color.text.secondary
color.text.on-brand
color.surface.default
color.surface.elevated
color.border.interactive
color.border.interactive.hover
spacing.inline.sm
spacing.stack.md
radius.component.lg
shadow.elevation.low

// Bad — descriptive of appearance, not purpose
color.gray.900          ← consumer shouldn't pick primitives
color.light-background  ← "light" breaks in dark mode
padding-medium          ← flat namespace, no hierarchy
```

**Naming rules:**
- Full words, no abbreviations (`background` not `bg`, `primary` not `pri`)
- Semantic over descriptive (`text.primary` not `text.dark`)
- Group by category first, then narrow (`color.text.*`, `color.surface.*`)
- States go last (`color.border.interactive.hover`)
- Use kebab-case within segments for multi-word concepts (`on-brand`, `high-contrast`)

**For detailed token values and tables → read ./references/TOKEN-REFERENCE.md**

---

## Component Architecture

### Composition Over Configuration

Prefer **compound component patterns** over prop-heavy monolithic components. This is the consensus pattern used by Radix, Base UI, Ark UI, and shadcn/ui.

```tsx
// WRONG — configuration-heavy "apropcalypse"
<Alert
  status="error"
  title="Something failed"
  description="Please try again"
  icon={<WarningIcon />}
  showCloseButton
  onClose={handleClose}
  closeable
  variant="filled"
/>

// CORRECT — composable compound components
<Alert status="error" variant="filled">
  <Alert.Icon><WarningIcon /></Alert.Icon>
  <Alert.Content>
    <Alert.Title>Something failed</Alert.Title>
    <Alert.Description>Please try again</Alert.Description>
  </Alert.Content>
  <Alert.CloseButton onPress={handleClose} />
</Alert>
```

**Why composition wins:**
- Each sub-component maps to a visible UI element — the API matches what you see
- Adding features (like a custom action area) doesn't require new props on the parent
- Consumers can reorder, omit, or wrap sub-components freely
- TypeScript intellisense works on each piece independently
- AI code generators produce better output because the structure is explicit

**Layered API strategy:** Build flexible composable primitives at the base, then provide pre-composed shortcuts for common cases:

```tsx
// Low-level composable API (for custom layouts)
<Dialog>
  <Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Confirm</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
      <Dialog.Close asChild><Button>Cancel</Button></Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>

// Pre-composed shortcut (for 80% use case)
<ConfirmDialog
  title="Confirm"
  description="Are you sure?"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

### Headless Primitives

Build on **headless UI libraries** for complex interactive components. These handle behavior, accessibility, keyboard navigation, and focus management without imposing styles.

**When to use headless primitives (not DIY):**
- Modals/Dialogs (focus trap, scroll lock, portal)
- Dropdowns/Selects (listbox pattern, typeahead, positioning)
- Tooltips/Popovers (floating positioning, hover intent)
- Combobox/Autocomplete (ARIA combobox, filtering, selection)
- Tabs (roving tabindex, arrow key navigation)
- Accordions (expand/collapse, exclusive selection)
- Toasts (live region, auto-dismiss timers)

**When to build from scratch:**
- Static display components (Card, Badge, Avatar)
- Simple layout containers (Stack, Grid, Box)
- Non-interactive feedback (Skeleton, Spinner, ProgressBar)

**Current headless library landscape (2025–2026):**

| Library | Strength | Notes |
|---------|----------|-------|
| Base UI | Render-prop API, explicit data flow | v1.0 Dec 2025, shadcn/ui default option |
| Radix UI | Pioneered `asChild`, massive ecosystem | Maintenance concerns post-WorkOS acquisition |
| React Aria | Best-in-class accessibility, i18n | 30+ languages, 13 calendar systems |
| Ark UI | XState state machines, multi-framework | React + Vue + Solid from one codebase |
| Headless UI | Tailwind Labs, simple API | Smaller scope than others |

### Server Component Compatibility

If targeting React Server Components (Next.js App Router, React 19+):

- Mark interactive components with `"use client"` at the top of the file
- Separate static/presentational parts (can be server components) from interactive parts (must be client components)
- **Do not use runtime CSS-in-JS** (styled-components, Emotion) — these inject styles via JavaScript and break in server contexts
- Prefer: CSS custom properties, Tailwind CSS, CSS Modules, Panda CSS, StyleX, or vanilla-extract

```tsx
// ServerCard.tsx — no "use client", runs on server
import { ClientInteractions } from './ClientInteractions';

export function ServerCard({ data }) {
  return (
    <div className="card">
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <ClientInteractions id={data.id} />
    </div>
  );
}

// ClientInteractions.tsx
"use client";
export function ClientInteractions({ id }) {
  const [liked, setLiked] = useState(false);
  return <Button onPress={() => setLiked(!liked)}>Like</Button>;
}
```

---

## Core Components Reference

**For complete component API and examples → read ./references/COMPONENT-CATALOG.md**

This includes Box, HStack/VStack, Text, Button, Input, Card, and Component Props Pattern guidance.

---

## Layout Patterns

**For Screen Layout, Form Layout, and List Item Layout examples → read ./references/LAYOUT-PATTERNS.md**

---

## Accessibility Checklist

Accessibility is a legal requirement (European Accessibility Act enforced June 2025, US ADA Title II deadline April 2026) and a core engineering concern, not a nice-to-have.

### Every Component Must

1. **Be keyboard navigable** — all interactive elements reachable via Tab, activatable via Enter/Space
2. **Have accessible names** — visible labels, `aria-label`, or `aria-labelledby` on every interactive element
3. **Manage focus correctly** — modals trap focus, dismissed elements return focus to trigger, no orphaned focus
4. **Never rely on color alone** — errors need icons + text, not just red borders
5. **Meet contrast minimums** — 4.5:1 for normal text, 3:1 for large text (18px+ bold or 24px+ regular), 3:1 for UI components
6. **Respect motion preferences** — check `prefers-reduced-motion` and disable/reduce animations

### WCAG 2.2 Criteria That Affect Components Directly

| Criterion | Requirement | Component Impact |
|-----------|-------------|------------------|
| SC 2.5.7 Dragging | Click/tap alternative for all drag | Sortable lists, sliders, kanban boards need non-drag method |
| SC 2.5.8 Target Size | Minimum 24×24 CSS px | All buttons, links, form controls |
| SC 2.4.13 Focus Appearance | 2px indicator, 3:1 contrast | Focus rings on all interactive elements |
| SC 2.4.11 Focus Not Obscured | Focused element visible | Sticky headers/footers must not cover focused items |
| SC 1.3.5 Input Purpose | `autoComplete` on personal fields | Name, email, phone, address inputs |

### Focus Management Patterns

```tsx
// Use the `inert` attribute for modal backgrounds (replaces manual focus traps)
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (isOpen && mainContent) {
      mainContent.setAttribute('inert', '');
    }
    return () => mainContent?.removeAttribute('inert');
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <Dialog role="dialog" aria-modal="true" onClose={onClose}>
      {children}
    </Dialog>
  );
}
```

### Testing Strategy

Layer these tools — no single tool catches everything:

- **Static analysis in CI**: `eslint-plugin-jsx-a11y` catches missing labels, roles, and alt text before code is merged
- **Component-level**: Storybook a11y addon + axe-core integration runs per-story
- **Integration tests**: Playwright + `@axe-core/playwright` for full-page scans
- **Screen reader testing**: Manual VoiceOver + NVDA checks on complex interactive components (modals, comboboxes, data tables)

---

## Theming

**For CSS Custom Properties, Multi-Brand Theming, and Tailwind v4 setup → read ./references/THEMING.md**

---

## Performance

**For Barrel Files, CSS Cascade Layers, CSS Containment, and Container Queries → read ./references/PERFORMANCE.md**

---

## Anti-Patterns

```tsx
// ❌ Hard-coded values
<View style={{ padding: 16, backgroundColor: '#fff' }}>
// ✅ Design tokens
<Box padding="$4" backgroundColor="$surfaceDefault">

// ❌ Raw platform components in feature code
import { View, Text } from 'react-native';
// ✅ Core library components
import { Box, Text } from 'components/core';

// ❌ Inline styles with magic numbers
<Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
// ✅ Token props or variant presets
<Text variant="headingSm">

// ❌ Color-only error indication
<Input style={{ borderColor: hasError ? 'red' : 'gray' }} />
// ✅ Error with icon, text, and color
<Input error={hasError ? "Email is required" : undefined} />

// ❌ Barrel file imports
import { Button, Card, Input, Text, Box } from 'components';
// ✅ Direct imports for tree-shaking
import { Button } from 'components/Button';

// ❌ Prop-heavy monolith
<DataTable columns={cols} data={rows} sortable filterable
  paginated pageSize={10} selectable onSelect={fn}
  headerVariant="sticky" emptyState="No data" />
// ✅ Composed from smaller pieces
<DataTable data={rows}>
  <DataTable.Header sticky>
    <DataTable.SortableColumn field="name">Name</DataTable.SortableColumn>
  </DataTable.Header>
  <DataTable.Body>
    {(row) => <DataTable.Row>{/* ... */}</DataTable.Row>}
  </DataTable.Body>
  <DataTable.Pagination pageSize={10} />
</DataTable>

// ❌ Runtime CSS-in-JS with server components
import styled from 'styled-components'; // breaks in RSC
// ✅ Zero-runtime or build-time styling
// Tailwind, CSS Modules, Panda CSS, StyleX, vanilla-extract

// ❌ Ignoring motion preferences
<Box animation="fadeIn 300ms ease-in">
// ✅ Respecting reduced motion
<Box animation={prefersReducedMotion ? 'none' : 'fadeIn 300ms ease-in'}>
```

---

## Troubleshooting

### Token naming conflicts between teams
Use the structured naming convention strictly: `{namespace}.{category}.{concept}.{modifier}.{state}`. Enforce it in code review. If conflicts exist, audit current token names and consolidate: treat the semantic layer as the public API (avoid exposing primitives). Document decisions in a TOKENS.md file at the root.

### Component prop types too rigid
Prefer composition over configuration. Instead of adding more props (e.g., `showFooter`, `footerVariant`), let consumers compose sub-components. If props feel necessary, ask: "Can the user achieve this by rearranging children instead?" Usually yes. Use compound component patterns from Radix or Base UI as reference.

### Barrel file imports causing slow builds
Replace `import { Button, Card, Input, Text } from 'components'` with direct imports: `import { Button } from 'components/Button'`. Enable tree-shaking. Measure build time before/after. This also improves IDE intellisense and code splitting in production bundles.

### Dark mode token mappings broken
Never redefine primitives in dark mode (e.g., `color.blue.600` shouldn't change). Instead, redefine the semantic layer: `color.text.primary` stays dark in dark mode, `color.surface.default` becomes lighter. Use a theme layer that maps semantic tokens to different primitives per theme. Test with `prefers-color-scheme` media query.

## Integration with Other Skills

- **frontend-designer**: Use core components as building blocks; frontend-designer handles page composition and visual design decisions
- **react-ui-patterns**: Core components are the primitives used inside higher-level UI state patterns (loading, error, empty states)
- **testing-patterns**: Test components in isolation with their token values, mock at the component boundary not inside it
- **storybook**: Every core component should have stories covering all variants, states, and interactive behavior
