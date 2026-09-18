---
name: testing-patterns
description: Jest testing patterns, factory functions, mocking strategies, and TDD workflow. Use when writing unit tests, creating test factories, or following TDD red-green-refactor cycle. Trigger this skill whenever the user mentions tests, testing, Jest, mocks, mocking, spies, factories, test data, TDD, red-green-refactor, test coverage, snapshot testing, test structure, describe blocks, beforeEach, afterEach, test utilities, custom render, MSW, Mock Service Worker, test isolation, parameterized tests, test.each, or asks how to test a component, hook, service, or utility function — even if they don't explicitly say "use the testing skill."
---

# Testing Patterns and Utilities

## Core Philosophy

**"Write tests. Not too many. Mostly integration."** — Guillermo Rauch, adopted by Kent C. Dodds

This skill encodes practices from Google's Software Engineering at Google (the "Testing Overview" chapter), Kent C. Dodds' Testing Trophy, Martin Fowler's testing taxonomy, the goldbergyoni JavaScript Testing Best Practices repository (24k+ stars), and engineering playbooks from Meta, Airbnb, and Shopify. Every recommendation below is grounded in those sources.

---

## 1 · Testing Trophy over Testing Pyramid

For frontend/React Native JavaScript projects, follow the **Testing Trophy** — not the classic pyramid:

```
        ┌───────┐
        │  E2E  │        ← Few: critical user journeys only
       ┌┴───────┴┐
       │Integration│      ← MOST tests live here
      ┌┴──────────┴┐
      │   Unit      │     ← Pure logic, utilities, edge cases
     ┌┴─────────────┴┐
     │ Static Analysis │   ← TypeScript + ESLint (free confidence)
     └────────────────┘
```

**Rationale:** Integration tests catch interaction bugs that unit tests miss entirely. Modern tools (Jest, Testing Library, MSW) make them nearly as fast as unit tests, and fewer are needed because each covers more surface area. Every mock removes confidence in the integration it replaces — mock only at boundaries.

**Coverage target:** Aim for ~70–80%. Mandating 100% leads to testing trivial code and slowing teams down. Use coverage reports to find blind spots, not as a performance metric.

---

## 2 · Test-Driven Development (TDD)

Follow the **Red-Green-Refactor** cycle. Target 20–40 cycles per hour; each cycle should take only minutes.

### RED — Write a failing test first
```typescript
// 1. Write the test BEFORE the implementation
it('should calculate total with tax', () => {
  const result = calculateTotal(100, 0.16);
  expect(result).toBe(116);
});
// Run → FAIL (function doesn't exist yet) ✅ correct failure
```

### GREEN — Minimal code to pass
```typescript
// 2. Write the MINIMUM code to make it green
export const calculateTotal = (subtotal: number, taxRate: number): number => {
  return subtotal + subtotal * taxRate;
};
// Run → PASS ✅
```

### REFACTOR — Clean up with green safety net
```typescript
// 3. Improve code quality; tests stay green
export const calculateTotal = (subtotal: number, taxRate: number): number => {
  const tax = subtotal * taxRate;
  return Math.round((subtotal + tax) * 100) / 100; // handle floating point
};
// Run → PASS ✅ Commit.
```

### TDD Rules
- **Never write production code without a failing test.**
- Run `jest --watch` for continuous feedback during development.
- Commit after every green — each passing state is a safe checkpoint.
- Start with a brainstormed list of test cases; pick the simplest first.
- Write tests as if the ideal API already exists — this is interface-first design.
- TDD works best for complex business logic, well-defined APIs, and unfamiliar codebases. Skip it for exploratory prototyping and visual design experimentation.

---

## 3 · Test Structure and Organization

### Arrange-Act-Assert (AAA)

Every test follows three phases. No loops, conditionals, or branching inside tests. Aim for ≤7 statements per test.

```typescript
it('should display admin badge for admin users', () => {
  // ARRANGE — set up inputs
  const user = createMockUser({ role: 'admin' });

  // ACT — execute the code under test
  renderWithProviders(<UserCard user={user} />);

  // ASSERT — verify outcomes
  expect(screen.getByText('Admin')).toBeTruthy();
});
```

### File Organization

Co-locate simple unit tests next to source files for shorter imports and easier discovery. Place complex integration tests in dedicated directories.

```
src/
├── components/
│   ├── UserCard.tsx
│   ├── UserCard.test.tsx          ← co-located unit/component test
│   └── __tests__/
│       └── UserCard.integration.test.tsx  ← integration tests
├── utils/
│   ├── calculateTotal.ts
│   └── calculateTotal.test.ts     ← co-located unit test
└── __tests__/
    └── helpers/
        ├── testUtils.tsx           ← shared custom render
        └── factories.ts            ← shared factory functions
```

### Naming Convention — "When…Then…"

Include three elements: the unit under test, the scenario/input, and the expected outcome. Name tests so that others can diagnose failures from the name alone.

```typescript
describe('UserCard', () => {
  describe('when the user has admin role', () => {
    it('then it displays the admin badge', () => { /* ... */ });
    it('then it shows the admin menu', () => { /* ... */ });
  });

  describe('when the user has no avatar', () => {
    it('then it renders a default placeholder', () => { /* ... */ });
  });
});
```

### Avoid Excessive Nesting

Kent C. Dodds cautions against deep `describe` nesting. Deep nesting encourages `beforeEach` as a code-reuse mechanism, creating mutable shared variables that force developers to trace through cascading setup to understand a test. Prefer simple setup functions called at the beginning of each test. One level of `describe` for the unit, one for the scenario is usually enough.

```typescript
// ❌ BAD — 4 levels deep, shared mutable state
describe('UserCard', () => {
  let user: User;
  beforeEach(() => { user = createMockUser(); });
  describe('rendering', () => {
    describe('with admin role', () => {
      beforeEach(() => { user.role = 'admin'; }); // mutation!
      describe('and active subscription', () => {
        beforeEach(() => { user.subscription = 'active'; }); // more mutation
        it('shows badge', () => { /* reader must trace 4 beforeEach blocks */ });
      });
    });
  });
});

// ✅ GOOD — flat, self-contained, each test tells its own story
describe('UserCard', () => {
  it('displays admin badge for admin users', () => {
    const user = createMockUser({ role: 'admin' });
    renderWithProviders(<UserCard user={user} />);
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('shows premium icon for active subscription', () => {
    const user = createMockUser({ subscription: 'active' });
    renderWithProviders(<UserCard user={user} />);
    expect(screen.getByTestId('premium-icon')).toBeTruthy();
  });
});
```

---

## 4 · Factory Functions

**For factory function patterns → read `./references/FACTORIES.md`**

Factory functions generate objects with sensible defaults, reducing test boilerplate and centralizing data structure changes.

---

## 5 · Custom Test Utilities

**For custom test utilities and custom render patterns → read `./references/TEST-UTILITIES.md`**

Custom render wrappers combine all required providers in a single reusable function, simplifying integration tests.

---

## 6 · Mocking Strategies

**For detailed mocking patterns and MSW setup → read `./references/MOCKING.md`**

Mock at boundaries only — network requests, filesystem, timers, and third-party services. Use real implementations for everything else within your application.

---

## 7 · User Interaction Patterns

**For user interaction patterns and advanced testing techniques → read `./references/ADVANCED-TECHNIQUES.md`**

Test behavior from the user's perspective using fireEvent, waitFor, and semantic queries. Avoid testing implementation details.

---

## 8 · Advanced Techniques

**For parameterized tests, snapshots, custom matchers, and timers → read `./references/ADVANCED-TECHNIQUES.md`**

Advanced patterns like `test.each`, snapshot testing, custom matchers, and timer mocking for complex scenarios.

---

## 9 · Anti-Patterns to Avoid

### 1. Testing Implementation Details (Most Damaging)

```typescript
// ❌ BAD — tests internal state, breaks on refactoring
expect(component.state.isOpen).toBe(true);
expect(wrapper.find('InternalDropdown').prop('visible')).toBe(true);

// ✅ GOOD — tests what the user sees
expect(screen.getByRole('listbox')).toBeTruthy();
expect(screen.getByText('Option 1')).toBeTruthy();
```

Two consequences: false negatives (tests break on refactoring despite correct behavior) and false positives (tests pass despite broken behavior).

### 2. Over-Mocking

```typescript
// ❌ BAD — mocking everything, testing nothing real
jest.mock('./utils');
jest.mock('./helpers');
jest.mock('./config');
jest.mock('./logger');
// What are you even testing at this point?

// ✅ GOOD — mock only boundaries, use real implementations
jest.mock('services/api'); // network boundary only
```

If a test requires many mocks, it signals a design smell — the code under test has too many dependencies.

### 3. Testing the Mock Instead of Real Behavior

```typescript
// ❌ BAD — only proves the mock was called, not that UI works
expect(mockFetchData).toHaveBeenCalledWith('/api/users');

// ✅ GOOD — tests actual user-visible behavior
expect(screen.getByText('John Doe')).toBeTruthy();
expect(screen.getByText('john@example.com')).toBeTruthy();
```

### 4. Shared Mutable State Between Tests

```typescript
// ❌ BAD — tests depend on execution order
let counter = 0;
it('test 1', () => { counter++; expect(counter).toBe(1); });
it('test 2', () => { counter++; expect(counter).toBe(2); }); // fails if order changes

// ✅ GOOD — each test creates its own state
it('test 1', () => { const counter = 0; expect(counter + 1).toBe(1); });
it('test 2', () => { const counter = 0; expect(counter + 1).toBe(1); });
```

### 5. Not Using Factories

```typescript
// ❌ BAD — duplicated, inconsistent, breaks when type changes
it('test 1', () => {
  const user = { id: '1', name: 'John', email: 'john@test.com', role: 'user' };
});
it('test 2', () => {
  const user = { id: '2', name: 'Jane', email: 'jane@test.com' }; // Missing role!
});

// ✅ GOOD — one source of truth
const user = createMockUser({ name: 'Custom Name' });
```

### 6. Large Snapshots Nobody Reviews

Keep under 50 lines. Use inline snapshots for small assertions.

### 7. Skipping the Refactor Step in TDD

After green, always refactor. Both production code AND test code. Accumulated technical debt makes both unmaintainable.

---

## 10 · Test Suite Structure Template

**For a complete test suite template → read `./references/PERFORMANCE-AND-TEMPLATES.md`**

A reusable structure organizing tests into sections: rendering, interactions, error handling, and edge cases.

---

## 11 · Performance Optimization

**For performance optimization and jest configuration → read `./references/PERFORMANCE-AND-TEMPLATES.md`**

Key strategies: use `@swc/jest`, optimize jest.config.js, set maxWorkers, and use test sharding in CI.

---

## 12 · Running Tests

```bash
# Run all tests
npm test

# Watch mode (TDD workflow — use this during development)
npx jest --watch

# Run specific file
npx jest ComponentName.test.tsx

# Run tests matching a pattern
npx jest --testPathPattern="utils"

# Run with coverage report
npx jest --coverage

# Run only changed files (great for pre-commit)
npx jest --onlyChanged

# CI mode — fail fast, no snapshots auto-created
npx jest --ci --bail --shard=1/4

# Debug a specific test
node --inspect-brk node_modules/.bin/jest --runInBand ComponentName.test.tsx
```

---

## 13 · Quick Decision Reference

**What type of test should I write?**
- Pure utility function → unit test with `test.each` for multiple inputs
- React component rendering → integration test with Testing Library
- Multi-screen user flow → E2E test (Detox / Maestro)
- API response handling → integration test with MSW

**Should I mock this?**
- Network request → YES (use MSW)
- Navigation → YES (mock the hook)
- Database/filesystem → YES
- Timer/date → YES (`jest.useFakeTimers()`)
- Sibling component → NO (use real implementation)
- Internal utility → NO (use real implementation)
- Third-party UI library → NO (render the real thing)

**Factory or inline data?**
- 4+ properties → factory
- Used in multiple tests → factory
- Nested objects → factory
- 1–2 test-specific values → inline

---

## Integration with Other Skills

- **react-ui-patterns**: Test all UI states (loading, error, empty, success) as shown in the template above.
- **systematic-debugging**: Write a test that reproduces the bug BEFORE fixing it (TDD for bug fixes).
- **frontend-designer**: Use snapshot tests sparingly for design regression; prefer visual regression tools for UI-heavy components.

---

## Troubleshooting

### Factory data causing type errors after interface changes
Update factory default values when you modify a type. Best practice: run `npm test` after interface changes to catch missing factory fields immediately. Consider a factory that mirrors the TypeScript interface exactly — even unused fields should have sensible defaults. Use `as const` or strict TypeScript settings to enforce exhaustiveness.

### Mocks not resetting between tests
Ensure `jest.config.js` has `clearMocks: true` and `restoreMocks: true`. These reset mock call counts, implementations, and timers between tests automatically. If mocks still leak, check for `jest.spyOn` calls without manual cleanup in `afterEach`, or shared mutable state in `beforeEach` that persists across tests.

### MSW handlers not intercepting requests
Verify the handler URL pattern matches the actual API call exactly, including protocol and port. MSW is strict: `http://localhost:3000/api/users` won't match `https://localhost:3000/api/users`. Use `rest.get()` or `graphql.query()` correctly per your API. Start MSW server in `beforeAll`, not `beforeEach`. Check network requests in DevTools to confirm URLs.

### Snapshot tests constantly breaking
Keep snapshots under 50 lines — if larger, they're useless (nobody reviews 500-line snapshots). Use inline snapshots for small assertions. When a snapshot legitimately changes, update it with `jest -u` and commit the change. If snapshots break frequently during refactoring, they're testing implementation details, not user-visible behavior — consider deleting them and writing assertion-based tests instead.

## Reference Files

This skill has been split into lean reference modules for detailed patterns:

- **`./references/FACTORIES.md`** — Factory functions, traits, associations, list factories, when to use factories vs inline data
- **`./references/TEST-UTILITIES.md`** — Custom render with providers, query helpers, semantic queries
- **`./references/MOCKING.md`** — Mocking strategies, jest mechanisms, MSW setup, module mocking, API mocking
- **`./references/ADVANCED-TECHNIQUES.md`** — User interaction patterns, parameterized tests (`test.each`), snapshot testing, custom matchers, timer mocking
- **`./references/PERFORMANCE-AND-TEMPLATES.md`** — Test suite structure template, performance optimization, jest.config.js configuration
