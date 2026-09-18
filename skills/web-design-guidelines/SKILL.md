---
name: web-design-guidelines
description: Review UI code for design compliance, accessibility, and web best practices. Triggers on "review my UI", "check accessibility", "audit design", "review UX", "check my site against best practices", "design QA", "UI compliance", "design fidelity check", "review frontend code", "check design tokens", "audit my components", "visual QA", "design system compliance", "review CSS", "check responsiveness", "dark mode review", or any request to verify that implemented UI matches design specifications. Also use when a user uploads frontend code files and asks for feedback, quality review, or improvement suggestions related to UI/UX. Even if the user doesn't use the exact phrases above, activate this skill whenever the intent is to evaluate UI code quality, design adherence, or frontend best practices. Do NOT use for full visual audits with phased improvement plans (use design-audit).
---

# Web Design Guidelines — UI Compliance Review Skill

Review frontend code for design compliance using a **four-layer approach** inspired by how top engineering teams (Shopify, Uber, Airbnb, Apple, Meta) enforce UI quality at scale.

## How It Works

This skill performs a multi-layer UI compliance review:

1. **Layer 1 — Token & Value Audit**: Scan for hardcoded colors, spacing, font sizes, z-index, and shadows that should reference design tokens or CSS variables.
2. **Layer 2 — Structure & Semantics**: Verify correct HTML semantics, component patterns, accessibility, and DOM structure.
3. **Layer 3 — Visual & Interaction Rules**: Check animation, responsive behavior, dark mode, typography, touch handling, and interactive states against industry best practices.
4. **Layer 4 — Design System Governance**: Identify component drift, inconsistent naming, duplicate near-identical components, and missing states (hover, disabled, loading, error, empty).

## Before Starting a Review

1. **Read the full rules reference**: `view` the file at `./references/rules.md` — it contains all detailed rules organized by category.
2. **Identify files to review**: If the user specified files or a pattern, use those. If not, ask which files or directories to review.
3. **Check for project context**: Look for a design system config, token files (`tokens.json`, `theme.ts`, `variables.css`, `tailwind.config.*`), or a component library. Their presence affects which rules apply and how strictly.

## Review Process

### Step 1 — Gather Context

Before reviewing code, check for:
- **Design token files**: `tokens.json`, `theme.ts`, `variables.css`, CSS custom properties files, Tailwind config
- **Design system components**: shared component library, Storybook config
- **Framework**: React, Vue, Angular, Svelte, plain HTML — adjust rule applicability
- **Configuration**: `.eslintrc`, `stylelint.config`, `postcss.config` — understand existing linting

If a design file (Figma link, screenshot, mockup) is provided, use it as the compliance baseline. If not, review against general best practices from the rules reference.

### Step 2 — Run the Four-Layer Review

Read `./references/rules.md` and apply all applicable rules from each layer. For each file:

1. **Token audit**: Flag every hardcoded `#hex`, `rgb()`, `px`/`rem` value for spacing/sizing, raw font-size, hardcoded z-index, and box-shadow that doesn't use a design token or CSS variable. Suggest the semantic token pattern (e.g., `var(--color-text-primary)` instead of `#333`).
2. **Structure & semantics**: Check all accessibility rules, semantic HTML, form patterns, heading hierarchy, label associations.
3. **Visual & interaction**: Check animation, typography, responsive, dark mode, images, performance, touch, locale, and content handling rules.
4. **Governance**: Identify components that look like duplicates of design system components, missing interactive states, inconsistent naming between design and code.

### Step 3 — Output Findings

Use the **terse `file:line` format** grouped by file. Severity markers:

```
🔴 CRITICAL  — Accessibility blocker, broken interaction, or security issue
🟡 WARNING   — Design drift, missing state, hardcoded value, best practice violation
🔵 INFO      — Improvement suggestion, optimization opportunity
```

**Output template:**

```text
## src/Button.tsx

🔴 src/Button.tsx:42 — icon button missing aria-label
🟡 src/Button.tsx:18 — hardcoded color #6B7280 → use var(--color-text-secondary)
🟡 src/Button.tsx:55 — animation missing prefers-reduced-motion check
🔵 src/Button.tsx:67 — transition: all → list properties explicitly

## src/Modal.tsx

🔴 src/Modal.tsx:12 — missing overscroll-behavior: contain on scroll container
🟡 src/Modal.tsx:34 — "..." → "…" (use proper ellipsis character)
🟡 src/Modal.tsx:8 — missing focus trap for modal dialog

## src/Card.tsx

✓ pass
```

**Rules for output:**
- State issue + location. Skip explanation unless fix is non-obvious.
- No preamble — jump straight into findings.
- Group by file. Mark files that pass with `✓ pass`.
- After all file findings, add a **Summary** section with counts by severity and the top 3 most impactful fixes.

### Step 4 — Summary & Recommendations

After the file-by-file findings, include:

```text
## Summary

🔴 Critical: X | 🟡 Warning: Y | 🔵 Info: Z

### Top 3 Fixes (highest impact)
1. [description of most impactful fix]
2. [description]
3. [description]

### Design Token Health
- Hardcoded values found: N
- Token usage rate: ~X% (estimated from scanned files)

### Missing States Detected
- [list components missing hover/disabled/loading/error/empty states]
```

## Handling Special Review Types

### "Check accessibility" / "Audit a11y"
Prioritize Layer 2 rules. Run all accessibility, focus state, keyboard, and ARIA rules. Reference WCAG 2.1 AA as the baseline (4.5:1 contrast for normal text, 3:1 for large text).

### "Check design tokens" / "Audit design system compliance"
Prioritize Layer 1 and Layer 4 rules. Focus on hardcoded values, token usage rate, component consistency, and naming alignment.

### "Review responsiveness" / "Check mobile"
Prioritize responsive behavior rules, touch interaction rules, safe area rules, and viewport rules. Check for `prefers-reduced-motion`, touch targets (minimum 44×44px), and viewport meta tag configuration.

### "Review dark mode"
Check `color-scheme`, `theme-color` meta, semantic color tokens vs hardcoded colors, native control styling, and media query usage for `prefers-color-scheme`.

### When a Figma/design file is provided
Compare implemented values against the design spec. Flag deviations in spacing (>2px off grid), color (any mismatch), typography (font/size/weight/line-height), border radius, shadow, and layout structure. Note: pixel-perfect comparison requires rendering — flag structural and token-level mismatches from code review.

## Troubleshooting

### Rules feel too strict or outdated
The rules are based on current web standards (WCAG 2.1 AA, HTML Living Standard, W3C Design Tokens 2025). If a rule conflicts with your project's chosen constraints, explicitly note the exception (e.g., "We target IE11, so CSS variables aren't available — using Sass instead"). Exceptions are valid; ignoring rules isn't.

### Too many findings to fix at once
Triage by severity: fix all 🔴 Critical first (accessibility, broken interactions), then batch 🟡 Warnings by component or feature area, then address 🔵 Info items as time permits. Pick the top 3 most impactful fixes and tackle those before the rest. High-impact fixes are usually: token coverage, missing states, or contrast failures.

### Hard to identify which findings apply to my tech stack
Check your framework and styling setup upfront. React + Tailwind has different rules than Vue + CSS Modules. Plain HTML/CSS vs a framework changes how you approach semantic HTML and styling. If unsure, ask about your specific stack and I'll flag which rules are most critical for it.

### Design file doesn't match code exactly
Pixel-perfect matching is unrealistic across browsers and devices. Flag structural mismatches (wrong layout direction, missing components) and token mismatches (colors don't map to design tokens, spacing off grid). Minor pixel differences (1–2px) are acceptable if the design token is correct and responsive behavior is working.

## Important Notes

- **Framework-agnostic**: Rules apply across React, Vue, Angular, Svelte, and vanilla HTML/CSS/JS. Adjust syntax expectations per framework (e.g., `htmlFor` in React vs `for` in HTML).
- **Severity calibration**: Accessibility failures are always 🔴 Critical. Hardcoded values are 🟡 Warning. Optimization suggestions are 🔵 Info.
- **Don't nitpick passing code**: If a file passes all checks, say `✓ pass` and move on.
- **Be constructive**: For each finding, the fix should be clear from the terse description. If not, add a brief fix hint.
- **Acknowledge existing tooling**: If the project already has ESLint a11y plugins, Stylelint, or similar, note which findings would be caught by existing tooling vs. which are net-new.
