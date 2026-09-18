# Token Reference

## Spacing Tokens

Use a base-4 scale. The 4px grid ensures alignment across density modes (compact, default, comfortable).

```tsx
// CORRECT — semantic token
<Box padding="$4" marginBottom="$2" />

// WRONG — hard-coded value
<Box padding={16} marginBottom={8} />
```

| Token | Value | Common Use |
|-------|-------|------------|
| `$1` | 4px | Tight internal spacing, icon gaps |
| `$2` | 8px | Compact element spacing |
| `$3` | 12px | Default inline gaps |
| `$4` | 16px | Standard padding, section gaps |
| `$6` | 24px | Card padding, form group spacing |
| `$8` | 32px | Section spacing |
| `$10` | 40px | Large section dividers |
| `$12` | 48px | Page-level spacing |
| `$16` | 64px | Hero/splash spacing |

---

## Color Tokens

```tsx
// CORRECT — semantic tokens that adapt to themes
<Text color="$textPrimary" />
<Box backgroundColor="$surfaceDefault" />

// WRONG — hard-coded colors
<Text color="#333333" />
<Box backgroundColor="rgb(245, 245, 245)" />

// WRONG — primitive tokens in components
<Text color="$neutral900" />
```

**Core semantic color tokens:**

| Token | Purpose | Notes |
|-------|---------|-------|
| `$textPrimary` | Main body text | High contrast against surface |
| `$textSecondary` | Supporting text, captions | Lower emphasis, still readable |
| `$textTertiary` | Disabled/hint/placeholder text | Minimum 4.5:1 contrast for AA |
| `$textOnBrand` | Text on brand-colored surfaces | Must pass contrast on `$surfaceBrand` |
| `$surfaceDefault` | Default background | Base canvas color |
| `$surfaceElevated` | Cards, modals, popovers | Slight lift from default |
| `$surfaceSubdued` | Secondary areas, sidebars | Lower emphasis background |
| `$surfaceBrand` | Brand-colored surfaces | Primary accent background |
| `$borderDefault` | Default borders, dividers | Subtle separation |
| `$borderInteractive` | Input borders, clickable outlines | Must be visible in all themes |
| `$statusError` | Error text, borders, icons | Red family, semantic not decorative |
| `$statusSuccess` | Success states | Green family |
| `$statusWarning` | Warning states | Amber/yellow family |
| `$statusInfo` | Informational states | Blue family |

**Dark mode rule:** Never invert primitives — redefine semantic mappings. `$textPrimary` maps to `neutral.100` in dark mode, `neutral.900` in light mode. The component code doesn't change.

---

## Typography Tokens

```tsx
// CORRECT — token composition
<Text fontSize="$lg" fontWeight="$semibold" lineHeight="$relaxed" />

// BETTER — use a preset that bundles size + weight + line-height
<Text variant="headingMd" />
```

| Size Token | Value | Typical Use |
|------------|-------|-------------|
| `$xs` | 12px | Footnotes, badges, legal text |
| `$sm` | 14px | Secondary text, captions, labels |
| `$md` | 16px | Body text (default) |
| `$lg` | 18px | Emphasized body, subheadings |
| `$xl` | 20px | Section headings |
| `$2xl` | 24px | Page headings |
| `$3xl` | 30px | Hero headings |

Prefer **typography presets** over individual token props. A preset like `bodyLg` bundles `fontSize`, `lineHeight`, `fontWeight`, and `letterSpacing` into one decision, preventing mismatched combinations.

---

## Motion Tokens

Don't forget motion — it's a token category too.

| Token | Value | Use |
|-------|-------|-----|
| `$durationFast` | 100ms | Micro-interactions (hover, toggle) |
| `$durationNormal` | 200ms | Standard transitions |
| `$durationSlow` | 350ms | Complex animations, modals |
| `$easingDefault` | cubic-bezier(0.4, 0, 0.2, 1) | General purpose |
| `$easingEnter` | cubic-bezier(0, 0, 0.2, 1) | Elements entering view |
| `$easingExit` | cubic-bezier(0.4, 0, 1, 1) | Elements leaving view |

Always respect `prefers-reduced-motion`. When reduced motion is requested, collapse durations to 0ms or use instant `opacity` transitions only.
