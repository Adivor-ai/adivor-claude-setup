# Mocking Strategies

## The Golden Rule: Mock at Boundaries Only

Mock **network requests**, **filesystem**, **environment variables**, **timers**, and **third-party services**. Use real implementations for everything within the application. Every mock removes confidence in the integration it replaces.

## Jest Mocking Mechanisms — When to Use Each

| Mechanism | Purpose | Restores? | Use When |
|---|---|---|---|
| `jest.fn()` | Standalone mock function | n/a | Callbacks, DI, simple spying |
| `jest.spyOn(obj, 'method')` | Wrap existing method, preserves original by default | `.mockRestore()` ✅ | Observing calls without replacing behavior |
| `jest.mock('module')` | Replace entire module exports (hoisted to top of file) | No (use `jest.restoreAllMocks()`) | External modules, heavy deps |
| Manual mocks (`__mocks__/`) | Persistent reusable module mocks | No | Shared across many test files |
| MSW (Mock Service Worker) | Network-level request interception | n/a | **All API mocking** (recommended) |

## Mock Cleanup — Critical Differences

```typescript
// jest.config.js — recommended defaults
module.exports = {
  clearMocks: true,     // reset call tracking between tests
  resetMocks: true,     // also remove mockImplementation/return values
  restoreMocks: true,   // also restore original implementations (spyOn only)
};
```

- **`mockClear()`** — resets call count and arguments; keeps mock behavior.
- **`mockReset()`** — also removes `mockImplementation` and return values.
- **`mockRestore()`** — everything above + restores original function. **Only works with `jest.spyOn()`.**

## Mocking Modules

```typescript
// Mock entire module with auto-mocking
jest.mock('utils/analytics');

// Mock with custom factory
jest.mock('utils/analytics', () => ({
  Analytics: {
    logEvent: jest.fn(),
    setUserId: jest.fn(),
  },
}));

// ⚠️ HOISTING: jest.mock is hoisted to top of file.
// Variables in factory must be prefixed with `mock` to bypass the check.
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
```

## Mocking GraphQL/API Hooks

```typescript
jest.mock('./GetItems.generated', () => ({
  useGetItemsQuery: jest.fn(),
}));

const mockUseGetItemsQuery = jest.requireMock(
  './GetItems.generated'
).useGetItemsQuery as jest.Mock;

// Per-test configuration
it('should display items', () => {
  mockUseGetItemsQuery.mockReturnValue({
    data: { items: [createMockItem(), createMockItem()] },
    loading: false,
    error: undefined,
  });

  renderWithProviders(<ItemList />);
  expect(screen.getAllByTestId('item-card')).toHaveLength(2);
});

it('should display loading spinner', () => {
  mockUseGetItemsQuery.mockReturnValue({
    data: undefined,
    loading: true,
    error: undefined,
  });

  renderWithProviders(<ItemList />);
  expect(screen.getByTestId('loading-spinner')).toBeTruthy();
});
```

## API Mocking with MSW (Recommended)

MSW intercepts at the network level — framework-agnostic, reusable, and invisible to application code. Switching from axios to fetch won't break any tests.

```typescript
// __tests__/helpers/server.ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { createMockUser } from './factories';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json(createMockUser({ id: params.id as string }));
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(createMockUser(body), { status: 201 });
  }),
];

export const server = setupServer(...handlers);

// __tests__/setup.ts (referenced in jest.config.js setupFilesAfterSetup)
import { server } from './helpers/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Override handlers per test for error states:

```typescript
import { server } from '../helpers/server';
import { http, HttpResponse } from 'msw';

it('should display error message on API failure', async () => {
  server.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    })
  );

  renderWithProviders(<UserProfile userId="123" />);

  await waitFor(() => {
    expect(screen.getByText('User not found')).toBeTruthy();
  });
});
```

## Don't Mock What You Don't Own

Wrap third-party libraries in adapter classes and mock the adapter. This confines coupling to a single place and makes library migrations painless.

```typescript
// ❌ BAD — directly mocking a third-party library
jest.mock('stripe', () => ({ /* fragile, breaks on library updates */ }));

// ✅ GOOD — mock your own adapter
// src/services/paymentService.ts  (YOUR adapter)
// __tests__/mocks/paymentService.ts (YOUR mock)
jest.mock('services/paymentService');
```
