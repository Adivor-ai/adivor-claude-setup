# Component & Page Patterns Reference

Research-backed patterns for foundational components, page-level design, and UX interactions. Data sourced from Nielsen Norman Group, Baymard Institute, CHI studies, and leading design systems.

## Foundational Components

### Buttons

**Hierarchy is critical.** 48% of e-commerce sites neglect proper button hierarchy, causing decision paralysis (Baymard Institute).

| Type | Visual Weight | Use |
|------|-------------|-----|
| **Primary** | Filled, highest contrast | Main CTA — **one per page section** |
| **Secondary** | Outlined or low-emphasis | Supporting actions |
| **Tertiary/Ghost** | Minimal styling | Cancel, Close, auxiliary actions |
| **Destructive** | Red-tinted primary | Delete, remove, irreversible actions |

**Six required visual states:** default, hover, pressed/active, focused, disabled, loading.

**Size requirements:**
- Touch target: **44×44px** minimum (Apple HIG), 48×48px ideal (Material)
- WCAG 2.2 AA: 24×24px with adequate spacing
- Button text: Semi-Bold (600), 14–16px

```tsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Spinner } from "@phosphor-icons/react";

<Button
  className="min-h-[44px] px-6 py-3 transition-all duration-150 ease-out
             hover:translate-y-[-1px] active:translate-y-0"
  disabled={isLoading}
>
  {isLoading ? <Spinner className="animate-spin" /> : <>Get Started <ArrowRight className="ml-2" /></>}
</Button>
```

### Forms

Following usability guidelines nearly **doubles first-attempt completion rates** (78% vs 42%, CHI research).

**The EAS Framework:**
1. **Eliminate** unnecessary fields
2. **Automate** what can be inferred (city from ZIP, card type from number)
3. **Simplify** remaining inputs

**Critical rules:**
- **Single-column layout** — endorsed by Luke Wroblewski, NNGroup, Material Design, and Apple HIG
- **Labels above inputs**, never inside (placeholder-as-label is harmful, extensively documented by NNGroup)
- **Inline validation** on blur, not keystroke
- **Error messages** near the field: color + icon + plain language explaining how to fix
- **Input size = 16px minimum** (prevents iOS zoom on focus)
- **Never clear forms** on error — preserve all user input
- **Auto-save** drafts when possible

```tsx
<div className="space-y-1.5">
  <label htmlFor="email" className="text-sm font-medium text-slate-700">
    Email address
  </label>
  <input
    id="email"
    type="email"
    className="w-full px-3 py-2.5 text-base border rounded-lg
               focus-visible:ring-2 focus-visible:ring-offset-1"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <p id="email-error" role="alert" className="text-sm text-red-600 flex items-center gap-1">
      <WarningCircle size={14} /> Enter a valid email address
    </p>
  )}
</div>
```

### Navigation

**Visible navigation consistently outperforms hidden navigation** across all UX metrics. NNGroup study (179 participants): discoverability is "cut almost in half" by hiding behind hamburger menus.

| Context | Pattern | Notes |
|---------|---------|-------|
| Desktop | Visible horizontal nav | Never hamburger when space permits |
| Desktop (large app) | Collapsible sidebar with icons-only mode | Balance discoverability + space |
| Mobile (3–5 items) | Bottom tab bar | Thumb-friendly zone |
| Mobile (many items) | Hamburger → drawer | Combined: some visible, overflow in menu |
| Deep hierarchy | Breadcrumbs | For >2 levels of depth |

**Always maintain context:** Highlight current page, preserve scroll position, back button must work predictably.

### Modals & Dialogs

**Use only for:**
- Critical confirmations (destructive actions)
- Focused short tasks (quick edit, brief form)
- Required acknowledgments (legal, critical alerts)

**Never for:** Non-critical information, content the user didn't request, complex multi-step flows.

**Requirements:**
- Focus trapped inside while open
- Focus returned to triggering element on close
- Escape key closes the modal
- Click outside closes (unless confirmation is required)
- On mobile: bottom sheets often feel more natural than centered modals

**IBM Carbon principle:** "Don't recreate a full app or page in a dialog."

### Data Tables

| Column Type | Alignment | Reason |
|------------|-----------|--------|
| Text | Left | Natural reading direction |
| Numbers | Right | Decimal alignment for comparison |
| Status/badges | Center or left | Visual scanning |
| Actions | Right | Convention, secondary to data |

- Use **monospace or tabular figures** for numbers to ensure alignment across rows
- Never center-align text columns
- Responsive: stack rows into cards on mobile, or horizontal scroll with sticky first column
- Sortable headers should have clear affordance (icon + cursor change)
- Zebra striping or subtle borders — pick one for row separation

## Page-Level Patterns

### Landing Pages

Answer **"What's in it for me?"** within 50 milliseconds.

**Essential formula:** Benefit-driven headline + supporting subtext + one clear CTA + supporting visual.

| Practice | Impact |
|----------|--------|
| Multiple competing CTAs | **Decrease conversion up to 266%** |
| Social proof near CTAs | **19–34% conversion lift** |
| "Trial for free" vs "Sign up for free" | **104% higher conversion** for "Trial for free" |

**Social proof types that work:** Customer logos, specific testimonials with outcomes (not generic praise), user counts, case study metrics.

**Microcopy matters more than most designers expect.** Test variations of CTA text, headline framing, and supporting copy.

### Dashboards

The average SaaS dashboard presents **67 data points** against a cognitive capacity of ~7±2 chunks.

| Guideline | Impact |
|-----------|--------|
| <40% information density | **63% faster pattern recognition** |
| Poor dashboard design | **23% higher churn, 40% lower feature adoption** |

**Progressive disclosure is essential:**
1. Surface key metrics immediately (3–5 numbers)
2. Detailed analysis behind intuitive navigation (tabs, expandable sections)
3. Advanced filtering and custom views behind explicit request

**Dashboard quick wins:**
- One hero metric with clear trend indicator
- Sparklines instead of full charts for secondary metrics
- "Last updated" timestamp for data confidence
- Empty states with helpful guidance (not just "No data")

### Loading States

| Duration | Pattern | Notes |
|----------|---------|-------|
| <1 second | No indicator | Anything feels instant |
| 1–3 seconds | Skeleton screen | Wireframe placeholder mimicking layout |
| 3–10 seconds | Skeleton + shimmer animation | Reduces perceived wait |
| >10 seconds | Progress bar with estimate | User needs progress confidence |

Skeleton screens with shimmer animations have become standard practice since Twitter pioneered them (2012). They reduce perceived wait time significantly vs spinners.

```tsx
// Skeleton component
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-slate-200 rounded w-3/4" />
  <div className="h-4 bg-slate-200 rounded w-1/2" />
  <div className="h-4 bg-slate-200 rounded w-5/6" />
</div>
```

## UX Interaction Principles

### 1. Direct Manipulation
Users interact directly with content, not through abstract controls:
- Drag & drop to reorder (not up/down buttons)
- Inline editing (click to edit, not separate form)
- Sliders for ranges (not numeric input with ±)
- WCAG 2.2: always provide single-pointer alternative for drag actions

### 2. Immediate Feedback
Every interaction provides feedback within 100ms:
- **Visual**: Pressed state, hover effects, color changes
- **Loading**: Skeleton screens for >300ms operations
- **Success**: Checkmarks, green highlights, toast notifications
- **Error**: Red highlights, inline messages, shake animation

### 3. Forgiveness
Make errors difficult, recovery easy:
- **Prevent**: Disable invalid actions, inline validation, confirm destructive actions
- **Recover**: Undo/redo, soft deletes (trash before permanent), preserve input on error, auto-save

### 4. Progressive Disclosure
Reveal complexity as needed:
- **Summary**: Essential info by default (title, price, rating)
- **Details**: Expand on interaction (description, specs)
- **Advanced**: Behind explicit toggle ("Advanced settings", "More filters")

### 5. Consistent Patterns
- All primary buttons share same colors, sizes, hover states
- All modals close via X, Escape, and outside click
- All forms validate on blur and submit
- Same interaction model = same visual pattern

## Notifications & Feedback

### Toast Notifications (sonner)
```tsx
import { toast } from 'sonner';

toast.success('Changes saved');
toast.error('Failed to save. Try again.');
toast('Processing...', { duration: Infinity }); // persistent until resolved
```

**Toast rules:**
- Auto-dismiss after 3–5 seconds (success/info)
- Persist until acknowledged (errors, actions with undo)
- Maximum 3 visible at once
- Never for critical information that requires action

### Empty States
Every view needs an empty state that:
- Explains what will appear here
- Provides a clear action to populate it
- Feels designed, not like an error

```tsx
<div className="text-center py-16">
  <Illustration className="mx-auto mb-4 text-slate-300" />
  <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
  <p className="text-sm text-slate-500 mt-1">Create your first project to get started</p>
  <Button className="mt-4">Create Project</Button>
</div>
```

## Component Library & Tools

**Strongly prefer shadcn/ui** (v4, pre-installed in `@/components/ui`):
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
```

**Icons:** `@phosphor-icons/react`
```tsx
import { Plus, MagnifyingGlass, X } from "@phosphor-icons/react";
```

**Notifications:** `sonner`
```tsx
import { toast } from 'sonner';
```

**Styling:** Tailwind utility classes exclusively. Use CSS custom properties for theming via `index.css`.

## Resources
- [Nielsen Norman Group](https://www.nngroup.com/) — UX research
- [Baymard Institute](https://baymard.com/) — E-commerce UX
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Phosphor Icons](https://phosphoricons.com/) — Icon library
