# User Interaction Patterns and Advanced Techniques

## User Interaction Patterns

```typescript
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

it('should submit form with valid data', async () => {
  const onSubmit = jest.fn();
  renderWithProviders(<LoginForm onSubmit={onSubmit} />);

  // Interact through the user-facing interface
  fireEvent.changeText(screen.getByLabelText('Email'), 'user@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
  fireEvent.press(screen.getByRole('button', { name: 'Log in' }));

  // Assert on BEHAVIOR, not implementation
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });
});

it('should show validation error for invalid email', async () => {
  renderWithProviders(<LoginForm onSubmit={jest.fn()} />);

  fireEvent.changeText(screen.getByLabelText('Email'), 'not-an-email');
  fireEvent.press(screen.getByRole('button', { name: 'Log in' }));

  await waitFor(() => {
    expect(screen.getByText('Please enter a valid email')).toBeTruthy();
  });
});
```

## Parameterized Tests (`test.each`)

Eliminate duplication when testing pure functions across multiple inputs.

```typescript
describe('formatCurrency', () => {
  test.each([
    { input: 1000, locale: 'en-US', expected: '$1,000.00' },
    { input: 1000, locale: 'es-MX', expected: '$1,000.00' },
    { input: 0, locale: 'en-US', expected: '$0.00' },
    { input: -500, locale: 'en-US', expected: '-$500.00' },
  ])('formats $input in $locale as $expected', ({ input, locale, expected }) => {
    expect(formatCurrency(input, locale)).toBe(expected);
  });
});
```

Use `describe.each` for grouping related parameterized suites. Avoid parameterization when test logic differs significantly between cases.

## Snapshot Testing — Use Sparingly

Snapshots work for compiler output, error messages, and small serializable structures. They become counterproductive for large component trees — nobody reviews 600-line snapshots.

```typescript
// ✅ GOOD — small, focused inline snapshot
it('should render error message correctly', () => {
  const error = formatApiError({ status: 404, message: 'Not found' });
  expect(error).toMatchInlineSnapshot(`"Error 404: Not found"`);
});

// ❌ BAD — large component snapshot nobody reviews
it('should render', () => {
  const { toJSON } = render(<EntirePageComponent />);
  expect(toJSON()).toMatchSnapshot(); // 500+ lines, reviewed by no one
});
```

Rules: keep snapshots under 50 lines. Enforce with `eslint-plugin-jest`'s `no-large-snapshots` rule. Prefer `.toMatchInlineSnapshot()` for small assertions. Run `--ci` in CI to prevent automatic snapshot creation.

## Custom Matchers

Create domain-specific matchers when assertions repeat across many tests.

```typescript
// __tests__/helpers/matchers.ts
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
});

// Usage
expect(calculateDiscount(100)).toBeWithinRange(10, 20);
```

Use `@testing-library/jest-dom` for DOM matchers (`.toBeInTheDocument()`, `.toHaveTextContent()`, `.toBeVisible()`) and `jest-extended` for general-purpose matchers (`.toBeTrue()`, `.toStartWith()`).

## Timer Mocking

```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should debounce search input', () => {
  renderWithProviders(<SearchInput onSearch={mockOnSearch} />);

  fireEvent.changeText(screen.getByLabelText('Search'), 'hello');

  // Nothing fired yet — debounce is waiting
  expect(mockOnSearch).not.toHaveBeenCalled();

  // Advance timers past the debounce threshold
  jest.advanceTimersByTime(300);

  expect(mockOnSearch).toHaveBeenCalledWith('hello');
});
```
