# Layout Patterns

## Screen Layout

```tsx
const MyScreen = () => (
  <Screen>
    <ScreenHeader
      title="Page Title"
      leftAction={<BackButton />}
      rightAction={<MenuButton />}
    />
    <ScreenContent padding="$4" scrollable>
      {/* Content */}
    </ScreenContent>
  </Screen>
);
```

---

## Form Layout

```tsx
<VStack as="form" gap="$4" padding="$4" onSubmit={handleSubmit}>
  <Input label="Full name" autoComplete="name" {...nameProps} />
  <Input label="Email" autoComplete="email" inputMode="email" {...emailProps} />
  <Input
    label="Password"
    type="password"
    autoComplete="new-password"
    {...passwordProps}
  />
  <Button
    type="submit"
    variant="solid"
    isLoading={submitting}
    isDisabled={!isValid}
  >
    Create Account
  </Button>
</VStack>
```

---

## List Item Layout

```tsx
<Pressable
  onPress={() => navigate(item.id)}
  accessibilityRole="button"
  accessibilityLabel={`View ${item.title}`}
>
  <HStack
    padding="$4"
    gap="$3"
    alignItems="center"
    borderBottomWidth={1}
    borderColor="$borderDefault"
  >
    <Avatar source={{ uri: item.imageUrl }} size="md" alt={item.name} />
    <VStack flex={1} gap="$1">
      <Text variant="bodyMd" fontWeight="$semibold">{item.title}</Text>
      <Text variant="bodySm" color="$textSecondary">{item.subtitle}</Text>
    </VStack>
    <Icon name="chevron-right" color="$textTertiary" aria-hidden="true" />
  </HStack>
</Pressable>
```
