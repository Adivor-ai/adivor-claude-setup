# Component Catalog

## Box

Base layout primitive. All visual properties come from tokens.

```tsx
<Box
  padding="$4"
  backgroundColor="$surfaceDefault"
  borderRadius="$lg"
  borderWidth={1}
  borderColor="$borderDefault"
>
  {children}
</Box>
```

---

## HStack / VStack

Directional flex containers:

```tsx
<HStack gap="$3" alignItems="center" flexWrap="wrap">
  <Icon name="user" color="$textSecondary" />
  <Text variant="bodyMd">Username</Text>
  <Badge>Pro</Badge>
</HStack>

<VStack gap="$4" padding="$4">
  <Text variant="headingMd">Section Title</Text>
  <Text variant="bodyMd" color="$textSecondary">
    Supporting description text
  </Text>
</VStack>
```

---

## Text

Typography with semantic variants preferred over individual token props:

```tsx
// Preferred — variant preset
<Text variant="headingLg" color="$textPrimary">
  Page Title
</Text>

// Acceptable — when no preset matches
<Text fontSize="$lg" fontWeight="$semibold" lineHeight="$relaxed">
  Custom styling
</Text>
```

---

## Button

Interactive element with clear variant semantics. Minimum touch target: 44×44px (mobile) or 24×24px (WCAG 2.2 minimum).

```tsx
<Button
  onPress={handlePress}
  variant="solid"
  size="md"
  isLoading={loading}
  isDisabled={disabled}
  aria-label="Submit form"  // if text isn't descriptive enough
>
  Submit
</Button>
```

| Variant | Use For | Visual Weight |
|---------|---------|---------------|
| `solid` | Primary actions (1 per view) | Highest |
| `outline` | Secondary actions | Medium |
| `ghost` | Tertiary/subtle actions | Low |
| `link` | Inline navigation actions | Minimal |
| `destructive` | Delete/remove actions | High (danger color) |

**Button rules:**
- One `solid` button per logical action group
- Always provide visible loading state — never leave the user guessing
- `isDisabled` should include `aria-disabled` and a tooltip explaining why
- Keyboard: must be activatable with Enter and Space

---

## Input

Form input with built-in validation display and label association:

```tsx
<Input
  id="email-field"
  value={value}
  onChangeText={setValue}
  placeholder="you@example.com"
  label="Email address"
  helperText="We'll never share your email"
  error={touched && errors.email ? errors.email : undefined}
  required
  autoComplete="email"
  inputMode="email"
/>
```

**Input accessibility requirements:**
- Always pair with a visible `<label>` (via `label` prop or explicit `<label htmlFor>`)
- Error messages must be linked via `aria-describedby` (the component handles this if using the `error` prop)
- Never rely solely on color to indicate errors — include an icon and/or text
- `autoComplete` attribute is required for personal data fields (WCAG SC 1.3.5)

---

## Card

Content container using compound composition:

```tsx
<Card variant="elevated" padding="$4">
  <Card.Header>
    <HStack justifyContent="space-between" alignItems="center">
      <Text variant="headingSm">Card Title</Text>
      <Badge variant="subtle">New</Badge>
    </HStack>
  </Card.Header>
  <Card.Body gap="$3">
    <Text variant="bodyMd">Card content goes here.</Text>
  </Card.Body>
  <Card.Footer>
    <HStack gap="$2" justifyContent="flex-end">
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button variant="solid" size="sm">Confirm</Button>
    </HStack>
  </Card.Footer>
</Card>
```

| Variant | Visual | Use Case |
|---------|--------|----------|
| `elevated` | Shadow, lifted | Primary content cards |
| `outlined` | Border, flat | Lists, secondary content |
| `filled` | Subtle background fill | Grouped content areas |

---

## Component Props Pattern

When creating custom components, follow this pattern for token integration and type safety:

```tsx
interface CardProps {
  /** Spacing token for internal padding */
  padding?: '$2' | '$4' | '$6' | '$8';
  /** Visual variant */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Content */
  children: React.ReactNode;
  /** Optional test ID */
  testID?: string;
}

const variantStyles = {
  elevated: {
    shadowColor: '$shadowDefault',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '$borderDefault',
  },
  filled: {
    backgroundColor: '$surfaceSubdued',
  },
} as const;

const Card = ({
  padding = '$4',
  variant = 'elevated',
  children,
  testID,
}: CardProps) => (
  <Box
    padding={padding}
    backgroundColor="$surfaceElevated"
    borderRadius="$lg"
    testID={testID}
    {...variantStyles[variant]}
  >
    {children}
  </Box>
);
```

**Key principles for component authoring:**
- **Default all optional props** — components should render correctly with zero configuration
- **Use union types for constrained values** — don't accept arbitrary strings for tokens
- **Include `testID`/`data-testid`** — testing infrastructure is part of the component contract
- **Document props with JSDoc** — this shows up in IDE tooltips and benefits AI code generation
- **Export types** — consumers need them for wrapper components and generic utilities
