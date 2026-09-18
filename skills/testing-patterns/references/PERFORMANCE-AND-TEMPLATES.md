# Test Suite Structure Template and Performance Optimization

## Test Suite Structure Template

```typescript
// ComponentName.test.tsx
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '__tests__/helpers/testUtils';
import { createMockUser, createMockItem } from '__tests__/helpers/factories';
import { server } from '__tests__/helpers/server';
import { http, HttpResponse } from 'msw';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  // ── Rendering ──────────────────────────────────────────
  it('renders with default props', () => {
    renderWithProviders(<ComponentName />);
    expect(screen.getByText('Expected text')).toBeTruthy();
  });

  it('renders loading state while data is fetching', () => {
    renderWithProviders(<ComponentName />);
    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
  });

  it('renders empty state when no items exist', async () => {
    server.use(
      http.get('/api/items', () => HttpResponse.json([]))
    );
    renderWithProviders(<ComponentName />);
    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeTruthy();
    });
  });

  // ── User Interactions ──────────────────────────────────
  it('calls onSubmit with form data when submitted', async () => {
    const onSubmit = jest.fn();
    renderWithProviders(<ComponentName onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByLabelText('Name'), 'Alice');
    fireEvent.press(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alice' })
      );
    });
  });

  // ── Error Handling ─────────────────────────────────────
  it('displays error message on API failure', async () => {
    server.use(
      http.get('/api/items', () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    );

    renderWithProviders(<ComponentName />);
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeTruthy();
    });
  });

  // ── Edge Cases ─────────────────────────────────────────
  it('handles extremely long text without crashing', () => {
    const longName = 'A'.repeat(500);
    const user = createMockUser({ name: longName });
    renderWithProviders(<ComponentName user={user} />);
    expect(screen.getByText(longName)).toBeTruthy();
  });
});
```

---

## Performance Optimization

For large test suites (1,000+ tests), apply these optimizations in order of impact:

1. **Use `@swc/jest` instead of `babel-jest` or `ts-jest`** — 20–40% faster transforms using Rust-based compilation.
2. **Write `jest.config.js` not `.ts`** — avoids ts-node transpilation doubling startup time.
3. **Set `maxWorkers: '50%'`** — ~20% improvement by matching CPU cores.
4. **Use test sharding in CI** — `jest --shard=1/4` across machines. Teams report reducing 19-minute suites to under 3 minutes with 8 shards.
5. **Use `--bail` in CI** — fail fast on broken builds.
6. **Use `--onlyChanged` during development** — run only tests affected by local changes.
7. **Target <300ms per unit test** — monitor with `jest-slow-test-reporter`.

```javascript
// jest.config.js — optimized configuration
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  maxWorkers: '50%',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',          // barrel files
    '!src/**/*.stories.{ts,tsx}', // storybook
  ],
};
```
