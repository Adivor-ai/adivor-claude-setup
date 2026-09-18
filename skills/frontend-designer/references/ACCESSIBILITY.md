# Accessibility Reference

**Accessibility enables creativity — it's a foundation, not a limitation.** The constraints of accessibility (clear hierarchy, sufficient contrast, logical structure, predictable patterns) are the same principles that produce elegant, memorable interfaces.

The business case: 1.3 billion people with disabilities globally, $13 trillion spending power, $100 return per $1 invested (Forrester). Yet 97% of websites remain inaccessible (WebAIM Million study).

## WCAG 2.2 Overview (October 2023)

Target **WCAG 2.2 Level AA** — this is the standard referenced by ADA, Section 508, and the European Accessibility Act.

### Key 2.2 Additions

| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.5.8 Target Size (Minimum) | AA | Interactive targets ≥ **24×24 CSS px** with spacing |
| 2.4.11 Focus Not Obscured | AA | Focused elements not hidden behind sticky headers/footers |
| 2.5.7 Dragging Movements | AA | Single-pointer alternatives for all drag interactions |
| 3.3.8 Accessible Authentication | AA | No cognitive tests (CAPTCHAs) as sole auth method |
| 2.4.13 Focus Appearance | AAA | Minimum 2px focus indicator with 3:1 contrast |

## Core Principles (POUR)

- **Perceivable**: Content must be perceivable through multiple senses (alt text, contrast, captions)
- **Operable**: UI must be keyboard/touch accessible with adequate targets
- **Understandable**: Clear, predictable behavior with error prevention
- **Robust**: Works with current and future assistive technologies

## Semantic HTML First

**Critical insight:** Pages with ARIA present average **41% more detected errors** than those without (WebAIM survey of 1M+ homepages). Misused ARIA is worse than no ARIA.

**The W3C's five rules of ARIA start with:** "If you can use native HTML, do so."

```html
<!-- DO: Native semantic elements -->
<button>Submit</button>
<nav>...</nav>
<main>...</main>
<header>...</header>
<footer>...</footer>
<dialog>...</dialog>

<!-- DON'T: ARIA on divs -->
<div role="button" tabindex="0">Submit</div>
<div role="navigation">...</div>
```

### Heading Hierarchy
Never skip heading levels. Screen readers use headings as navigation landmarks.

```html
<h1>Page Title</h1>        <!-- One per page -->
  <h2>Section</h2>         <!-- Major sections -->
    <h3>Subsection</h3>    <!-- Sub-sections -->
      <h4>Detail</h4>      <!-- Further nesting -->
```

## Contrast Requirements

| Element | Minimum Ratio (AA) | Enhanced (AAA) |
|---------|-------------------|----------------|
| Normal text (<18pt / <14pt bold) | **4.5:1** | 7:1 |
| Large text (≥18pt / ≥14pt bold) | **3:1** | 4.5:1 |
| UI components & borders | **3:1** | — |
| Graphical objects | **3:1** | — |
| Focus indicators | **3:1** | — |

**Tools:** Chrome DevTools Accessibility tab, WebAIM Contrast Checker, Stark (Figma plugin), Leonardo by Adobe.

**Never rely on color alone** to convey information. ~8% of men are colorblind (~300M people). Always pair color with icons, labels, patterns, or shape changes.

## Keyboard Navigation

All interactive elements must be keyboard accessible.

### Required Keyboard Behaviors
- **Tab**: Move focus forward through interactive elements
- **Shift+Tab**: Move focus backward
- **Enter/Space**: Activate buttons, links, controls
- **Escape**: Close modals, dropdowns, popovers
- **Arrow keys**: Navigate within widgets (tabs, menus, radio groups)

### Focus Management

```tsx
// All interactive elements need visible focus states
<button className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:outline-none">
  Accessible Button
</button>

// Custom interactive elements need tabindex and key handlers
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Custom Interactive Element
</div>
```

**CRITICAL:** Never remove focus indicators (`outline: none`) for aesthetic reasons. Instead, enhance them:
- Minimum **2px thickness**
- **3:1 contrast** against adjacent colors
- Use `focus-visible` to show focus only for keyboard navigation (not mouse clicks)

### Focus Trapping (Modals)

When a modal is open, focus must be trapped inside and returned to the trigger on close:

```tsx
// Trap focus in modal
const trapFocus = (element) => {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
};
```

## Essential ARIA (When Native HTML Isn't Enough)

```tsx
// Buttons without visible text
<button aria-label="Close dialog"><X /></button>

// Expandable elements
<button aria-expanded={isOpen} aria-controls="menu-panel">
  Menu
</button>
<div id="menu-panel" role="region">...</div>

// Live regions for dynamic content
<div role="status" aria-live="polite">{statusMessage}</div>
<div role="alert" aria-live="assertive">{errorMessage}</div>

// Form errors
<input
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && <p id="email-error" role="alert">Enter a valid email</p>}

// Loading states
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</button>
```

## Touch Targets

| Standard | Minimum Size | Notes |
|----------|-------------|-------|
| Apple HIG | **44×44px** | Recommended minimum |
| Material Design | **48×48px** | Ideal for mobile |
| WCAG 2.2 AA | **24×24px** | With adequate spacing between targets |

```tsx
<button className="min-w-[44px] min-h-[44px] touch-manipulation p-3">
  <Icon />
</button>
```

`touch-manipulation` prevents 300ms tap delay on mobile.

## Screen Reader Support

```tsx
// Hidden but announced by screen readers
<span className="sr-only">Additional context for screen readers</span>

// Skip navigation link
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
  Skip to main content
</a>

// Image alt text
<img src="chart.png" alt="Revenue grew 23% from Q1 to Q2 2025" />
// Decorative images
<img src="divider.svg" alt="" role="presentation" />
```

## Reduced Motion

~35% of adults over 40 are affected by motion sensitivity. Always implement:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// React: check preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## Inclusive Design: The Persona Spectrum

Disability exists on a spectrum of permanent, temporary, and situational conditions:

| Permanent | Temporary | Situational |
|-----------|-----------|-------------|
| One arm | Arm injury | Holding a baby |
| Blind | Eye infection | Driving |
| Deaf | Ear infection | Loud bar |
| Non-verbal | Laryngitis | Heavy accent on phone |

Solutions for permanent conditions benefit everyone — the **curb cut effect**. Closed captions help gym-goers. Keyboard nav helps power users. Alt text improves SEO.

## Legal Requirements

| Jurisdiction | Standard | Enforcement |
|-------------|----------|-------------|
| EU (EAA) | WCAG 2.1 AA | **Enforced June 28, 2025**. Fines up to €500,000. Applies to any business serving EU consumers. |
| US (ADA) | WCAG 2.1 AA | DOJ April 2024 rule. Lawsuits average $25K–$100K+ to settle. |
| US (Section 508) | WCAG 2.1 AA | Federal agencies and contractors. |

## Testing Checklist

### Automated (catches ~40% of issues)
- [ ] Run axe DevTools or Lighthouse accessibility audit
- [ ] Check all contrast ratios pass
- [ ] Validate HTML (no duplicate IDs, proper nesting)

### Manual (catches the other 60%)
- [ ] **Keyboard**: Tab through entire interface without mouse
- [ ] **Focus**: Visible focus indicators on every interactive element
- [ ] **Focus order**: Logical, matches visual order
- [ ] **Modals**: Focus trapped inside, restored on close, Escape to dismiss
- [ ] **Headings**: Logical h1–h6 hierarchy (no skipped levels)
- [ ] **Forms**: Labels associated with inputs, errors announced
- [ ] **Images**: Meaningful alt text (or empty alt for decorative)
- [ ] **Touch**: 44px minimum targets with adequate spacing
- [ ] **Zoom**: Content usable at 200% zoom
- [ ] **Reduced motion**: Animations respect `prefers-reduced-motion`

### Screen Reader Testing
- **macOS/iOS**: VoiceOver (built-in, free)
- **Windows**: NVDA (free, open source)
- **Android**: TalkBack (built-in)

## Resources
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Design at Microsoft](https://inclusive.microsoft.design/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
