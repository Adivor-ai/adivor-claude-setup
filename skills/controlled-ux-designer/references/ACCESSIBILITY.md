# Accessibility Reference

Comprehensive guide for implementing accessible interfaces following WCAG 2.2 AA standards, enriched with research data and legal context.

## Table of Contents

1. [Core Principles (POUR)](#core-principles-pour)
2. [The Business & Legal Case](#the-business--legal-case)
3. [Semantic HTML First](#semantic-html-first)
4. [Keyboard Navigation](#keyboard-navigation)
5. [ARIA Attributes](#aria-attributes)
6. [Color Contrast](#color-contrast)
7. [Alternative Text](#alternative-text)
8. [Forms](#forms)
9. [Screen Reader-Only Content](#screen-reader-only-content)
10. [Focus Indicators](#focus-indicators)
11. [Common Patterns](#common-patterns)
12. [Testing Checklist](#testing-checklist)

---

## Core Principles (POUR)

### Perceivable
Information and UI components must be presentable to users in ways they can perceive.

### Operable
UI components and navigation must be operable by all users.

### Understandable
Information and the operation of UI must be understandable.

### Robust
Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

---

## The Business & Legal Case

**Why this matters beyond ethics:**
- Global disability community: **1.3 billion people** with **$13 trillion in spending power**
- Forrester: **$100 return for every $1 invested** in accessibility
- Tesco: invested £35,000 → online sales reached £13 million annually
- Companies with strong accessibility: **28% higher revenue growth**
- Yet **97% of websites remain inaccessible** (WebAIM Million study)

**Legal enforcement (as of 2025):**
- **European Accessibility Act (EAA):** Enforcement began June 28, 2025. Applies to any business serving EU consumers. Penalties up to **€500,000**
- **US DOJ:** April 2024 rule explicitly references WCAG 2.1 Level AA for Title II
- **ADA lawsuits:** Average $25,000–$100,000+ to settle

**The inclusive design spectrum (Microsoft):**
- Permanent (one arm) → Temporary (arm injury) → Situational (holding baby) — all face similar challenges
- ~26,000 Americans lose an upper extremity annually, but 20+ million experience comparable temporary/situational impairments
- The "curb cut effect": solutions for one benefit all

---

## Semantic HTML First

**Critical insight:** WebAIM's survey of 1M+ homepages found pages with ARIA present averaged **41% more detected errors** than those without. Misused ARIA causes more harm than no ARIA.

**W3C's five rules of ARIA begin with:** "If you can use native HTML, do so."

### Use Appropriate Elements

**Good:**
```tsx
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2025 Company Name</p>
</footer>
```

**Bad:**
```tsx
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
    <div class="link">About</div>
  </div>
</div>
```

### Heading Hierarchy

**Correct (never skip levels):**
```tsx
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>
```

---

## Keyboard Navigation

### Focus Management

```tsx
// Standard interactive elements are keyboard accessible by default
<button
  className="
    px-4 py-2
    focus:outline-none
    focus:ring-4 focus:ring-blue-500
    focus:ring-offset-2
    rounded-lg
  "
  tabIndex={0}
>
  Accessible Button
</button>

// Custom interactive elements need tabindex + keyboard handlers
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  className="cursor-pointer focus:ring-4 focus:ring-blue-500"
>
  Custom Button
</div>
```

### Skip Links

```tsx
<a
  href="#main-content"
  className="
    sr-only
    focus:not-sr-only
    focus:absolute
    focus:top-4 focus:left-4
    focus:z-50
    focus:px-4 focus:py-2
    focus:bg-blue-600 focus:text-white
    focus:rounded-lg
  "
>
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

### WCAG 2.2 Focus Requirements

**2.4.11 Focus Not Obscured (AA):** Focused elements must not be entirely hidden behind sticky headers, footers, or overlays.

```tsx
// Ensure sticky headers don't obscure focused content
<header className="sticky top-0 z-40">
  {/* Nav content */}
</header>
<main className="scroll-mt-16"> {/* Offset for sticky header */}
  {/* Content that can receive focus */}
</main>
```

---

## ARIA Attributes

### When To Use ARIA

**Use ARIA only when:**
- No native HTML element provides the needed semantics
- Dynamic content changes need to be announced
- Complex widgets (tabs, trees, comboboxes) require enhanced semantics

**Never use ARIA to:**
- Replace semantic HTML (`<div role="button">` → use `<button>`)
- Override native semantics (`<button role="heading">`)
- Add decorative or redundant attributes

### Common ARIA Patterns

```tsx
// Navigation landmark
<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>

// Search
<form role="search" aria-label="Site search">
  <input type="search" aria-label="Search query" />
  <button type="submit">Search</button>
</form>
```

### ARIA Labels

```tsx
// aria-label for elements without visible text
<button aria-label="Close dialog">
  <X size={24} />
</button>

// aria-labelledby to reference another element
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure you want to continue?</p>
</div>

// aria-describedby for additional description
<input
  type="password"
  aria-describedby="password-requirements"
/>
<p id="password-requirements">
  Password must be at least 8 characters
</p>
```

### ARIA Live Regions

```tsx
// Polite announcements (status updates)
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Urgent announcements (errors)
<div role="alert" aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>

// Form validation
<input
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <p id="email-error" role="alert">
    Please enter a valid email address
  </p>
)}
```

---

## Color Contrast

### WCAG 2.2 Contrast Requirements

| Content Type | AA Minimum | AAA Target |
|---|---|---|
| Normal text (<18pt / <14pt bold) | 4.5:1 | 7:1 |
| Large text (≥18pt / ≥14pt bold) | 3:1 | 4.5:1 |
| UI components & graphical objects | 3:1 | — |

### Common Pitfalls

- Pure red (#FF0000) on white = **4:1** — barely passes for large text only
- Pure green (#00FF00) on white = **1.4:1** — fails entirely
- Light grey (#9CA3AF) on white = **~3:1** — fails for normal text
- Never rely on color alone — always pair with icons, labels, or shape

### Dark Mode Contrast

Dark mode is NOT a simple inversion:
- Background: **#121212** (not pure black — causes halation for users with astigmatism)
- Text: **#E0E0E0** (not pure white — 15.8:1 contrast, softer than 21:1)
- Accents: desaturate by 20-30% (vibrant on dark causes eye strain)
- Depth: progressively lighter surfaces (4-5 levels), not shadows

### Tools

- Chrome DevTools → Accessibility tab
- WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)
- Stark (Figma plugin, 40,000+ designers)
- Leonardo by Adobe (define target contrast ratios proactively)

---

## Alternative Text

### Images

```tsx
// Informative images — describe the content and meaning
<img
  src="chart.png"
  alt="Bar chart showing sales increased 40% in Q4 2025"
/>

// Decorative images — empty alt, hide from screen readers
<img src="decoration.png" alt="" role="presentation" />

// Complex images — use figcaption for extended description
<figure>
  <img
    src="architecture.png"
    alt="System architecture diagram"
    aria-describedby="arch-desc"
  />
  <figcaption id="arch-desc">
    Three main components: frontend, API layer, and database.
    The frontend communicates with the API via REST...
  </figcaption>
</figure>
```

### Icons

```tsx
import { MagnifyingGlass, Bell } from '@phosphor-icons/react';

// Decorative icons (with adjacent text label)
<button className="flex items-center gap-2">
  <MagnifyingGlass aria-hidden="true" />
  Search
</button>

// Functional icons (no adjacent text — needs label)
<button aria-label="Search">
  <MagnifyingGlass />
</button>

// Icons with state information
<button aria-label="Notifications (3 unread)">
  <Bell />
  <span className="sr-only">3 unread notifications</span>
  <span aria-hidden="true" className="badge">3</span>
</button>
```

---

## Forms

### Research-Backed Form Design

- Forms with usability guidelines: **78% first-attempt completion** vs 42% without (CHI research)
- **EAS framework**: Eliminate unnecessary fields → Automate what can be inferred → Simplify remaining
- Labels ABOVE inputs — never rely on placeholder text alone (NNGroup research)
- Single-column layouts (endorsed by Wroblewski, NNGroup, Material Design, Apple HIG)
- Error messages: near field, with both color AND icons, plain language explaining the fix

### Labels and Instructions

```tsx
<div>
  <label htmlFor="email" className="block mb-1 font-medium">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    className="w-full px-4 py-2 border rounded-lg"
  />
</div>

// Group related inputs
<fieldset>
  <legend className="font-medium mb-2">Contact Preferences</legend>
  <div className="space-y-2">
    <label className="flex items-center gap-2">
      <input type="checkbox" name="email" />
      Email
    </label>
    <label className="flex items-center gap-2">
      <input type="checkbox" name="sms" />
      SMS
    </label>
  </div>
</fieldset>
```

### Error Handling

```tsx
<div>
  <label htmlFor="password" className="block mb-1 font-medium">
    Password
  </label>
  <input
    id="password"
    type="password"
    aria-invalid={hasError}
    aria-describedby="password-req password-error"
    className={`
      w-full px-4 py-2 border rounded-lg
      ${hasError ? 'border-red-500' : 'border-slate-300'}
    `}
  />
  <p id="password-req" className="text-sm text-slate-600 mt-1">
    Must be at least 8 characters
  </p>
  {hasError && (
    <p id="password-error" role="alert" className="text-sm text-red-600 mt-1">
      <AlertCircle className="inline" size={16} />
      Password is too short
    </p>
  )}
</div>
```

### WCAG 2.2 Authentication (3.3.8)

No cognitive function tests (CAPTCHAs, puzzles) as sole authentication method. Provide alternatives: copy-paste passwords, biometrics, email/SMS codes.

---

## Screen Reader-Only Content

```tsx
// Add context for screen readers (Tailwind sr-only class)
<button>
  <Heart />
  <span className="sr-only">Add to favorites</span>
</button>

// Provide count context
<div>
  <h2>Products</h2>
  <span className="sr-only">Showing 24 of 100 results</span>
</div>

// Skip link (visible on focus)
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## Focus Indicators

**Never remove focus indicators for aesthetics — enhance them instead.**
- Minimum 2px thickness
- 3:1 contrast against adjacent colors

```tsx
// Enhanced focus with ring
<button className="
  px-4 py-2 rounded-lg
  bg-blue-600 text-white
  focus:outline-none
  focus:ring-4 focus:ring-blue-500
  focus:ring-offset-2
">
  Click Me
</button>

// Focus within containers
<div className="
  p-4 border border-slate-300 rounded-lg
  focus-within:ring-4 focus-within:ring-blue-500
  focus-within:border-blue-500
">
  <input type="text" className="w-full focus:outline-none" />
</div>
```

---

## Common Patterns

### Accessible Modal (Focus Trapping)

```tsx
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      modalRef.current?.focus();

      const handleTab = (e) => {
        if (e.key === 'Tab') {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }

        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="bg-white rounded-lg p-6 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
```

### Accessible Tabs

```tsx
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div role="tablist" aria-label="Content sections">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            className={`
              px-4 py-2 border-b-2
              ${activeTab === index
                ? 'border-blue-600 font-medium'
                : 'border-transparent'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`panel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeTab !== index}
          className="p-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

### Drag Interaction with Single-Pointer Alternative (WCAG 2.5.7)

```tsx
// Always provide a button-based alternative for drag interactions
function ReorderableList({ items, onReorder }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-2">
          <span>{item.name}</span>
          {/* Single-pointer alternatives for drag */}
          <button
            aria-label={`Move ${item.name} up`}
            disabled={index === 0}
            onClick={() => onReorder(index, index - 1)}
          >
            ↑
          </button>
          <button
            aria-label={`Move ${item.name} down`}
            disabled={index === items.length - 1}
            onClick={() => onReorder(index, index + 1)}
          >
            ↓
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Testing Checklist

**Automated tools catch ~40% of issues at best. Manual testing is essential.**

### Keyboard Navigation
- [ ] Navigate entire interface using Tab key
- [ ] Activate all interactive elements with Enter/Space
- [ ] Focus indicators clearly visible (2px+, 3:1 contrast)
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Escape closes modals/dropdowns

### Screen Reader Testing
- [ ] Test with NVDA (Windows, free) or VoiceOver (Mac/iOS, built-in)
- [ ] All images have appropriate alt text
- [ ] Headings create logical structure (no skipped levels)
- [ ] Forms have proper labels
- [ ] Dynamic content announced via live regions
- [ ] Error messages announced when they appear

### Visual Testing
- [ ] Text has sufficient contrast (4.5:1 normal, 3:1 large)
- [ ] UI works at 200% zoom
- [ ] Content reflows properly on mobile
- [ ] No information conveyed by color alone
- [ ] Focus indicators visible on all interactive elements
- [ ] Touch targets ≥ 44×44px (≥24×24px minimum with spacing)

### Motion & Preferences
- [ ] `prefers-reduced-motion` respected
- [ ] Animations don't block critical actions
- [ ] No flashing content (3 flashes/second max)

### Tools
- Chrome DevTools Lighthouse
- WAVE browser extension
- axe DevTools extension
- WebAIM Contrast Checker
- Screen readers: NVDA (Windows), VoiceOver (Mac/iOS)

---

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Microsoft Inclusive Design](https://inclusive.microsoft.design/)
