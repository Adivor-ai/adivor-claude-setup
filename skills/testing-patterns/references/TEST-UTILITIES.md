# Custom Test Utilities

## Custom Render with Providers

Wrap components with all required providers in a single reusable function:

```typescript
// __tests__/helpers/testUtils.tsx
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '../../theme';
import { AuthProvider } from '../../auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },   // fail fast in tests
    mutations: { retry: false },
  },
});

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialAuth?: { user: User | null };
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialAuth = { user: null }, ...renderOptions } = options;
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initial={initialAuth}>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient, // expose for cache manipulation in tests
  };
};
```

## Query Helpers

```typescript
import { screen, waitFor } from '@testing-library/react-native';

// Element MUST exist (throws if missing — good for required content)
expect(screen.getByText('Hello')).toBeTruthy();
expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();

// Element should NOT exist (returns null — good for conditional content)
expect(screen.queryByText('Error message')).toBeNull();

// Element appears ASYNCHRONOUSLY (polling — good for loading states)
await waitFor(() => {
  expect(screen.getByText('Loaded content')).toBeTruthy();
});

// Prefer semantic queries (accessibility-first, ranked by priority):
// 1. getByRole       — best: tests accessibility + behavior
// 2. getByLabelText  — great for form inputs
// 3. getByText       — good for display content
// 4. getByTestId     — last resort: no semantic meaning
```
