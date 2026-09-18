# Factory Functions

Factories generate objects with sensible defaults. Each test overrides only the properties relevant to its assertion. When a type changes (new required field), update the factory once instead of hundreds of tests.

## Basic Factory Pattern

```typescript
// __tests__/helpers/factories.ts
import { faker } from '@faker-js/faker';

// Seed for reproducible test runs
faker.seed(42);

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  avatar?: string;
}

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: 'user',
  createdAt: new Date('2024-01-15'),
  ...overrides,
});

// Usage — only specify what matters for the assertion
it('should display admin badge for admin users', () => {
  const user = createMockUser({ role: 'admin' });
  // ...
});
```

## Props Factory

```typescript
import { ComponentProps } from 'react';
import { MyComponent } from '../MyComponent';

export const createMockMyComponentProps = (
  overrides: Partial<ComponentProps<typeof MyComponent>> = {}
): ComponentProps<typeof MyComponent> => ({
  title: 'Default Title',
  count: 0,
  onPress: jest.fn(),
  isLoading: false,
  items: [],
  ...overrides,
});

// Usage
it('should render with custom title', () => {
  const props = createMockMyComponentProps({ title: 'Custom Title' });
  renderWithProviders(<MyComponent {...props} />);
  expect(screen.getByText('Custom Title')).toBeTruthy();
});
```

## Traits Pattern (Named Presets)

Use traits for common variations instead of creating separate factory functions.

```typescript
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: 'user',
  createdAt: new Date('2024-01-15'),
  ...overrides,
});

// Traits — named presets for common variations
createMockUser.admin = (overrides: Partial<User> = {}) =>
  createMockUser({ role: 'admin', ...overrides });

createMockUser.withExpiredSubscription = (overrides: Partial<User> = {}) =>
  createMockUser({
    subscription: { status: 'expired', expiresAt: new Date('2023-01-01') },
    ...overrides,
  });

// Usage
const admin = createMockUser.admin();
const expired = createMockUser.withExpiredSubscription({ name: 'Alice' });
```

## Associations (Composed Factories)

```typescript
interface Post {
  id: string;
  title: string;
  body: string;
  author: User;
  comments: Comment[];
}

export const createMockPost = (overrides: Partial<Post> = {}): Post => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(2),
  author: createMockUser(),           // compose with other factories
  comments: [],
  ...overrides,
});

// Override nested associations
const post = createMockPost({
  author: createMockUser({ role: 'admin' }),
  comments: [createMockComment(), createMockComment()],
});
```

## List Factory

```typescript
export const createMockUserList = (
  count: number,
  overrides: Partial<User> = {}
): User[] => Array.from({ length: count }, () => createMockUser(overrides));

// Usage
const users = createMockUserList(5, { role: 'admin' });
```

## When to Use Factories vs Inline Data

| Use Factories | Use Inline Data |
|---|---|
| Objects have 4+ properties | Objects are test-specific with 1–2 props |
| Same shape appears across many tests | Exact values ARE the point of the test |
| Complex nested structures | Simple primitives or strings |
| Type changes would break many tests | One-off throwaway assertions |

## Factory Libraries (When Vanilla Isn't Enough)

For large projects with complex domains, consider dedicated libraries:
- **Fishery** (Thoughtbot) — best TypeScript support, sequences, transient params, hooks
- **factory.ts** — compile-time-checked derived fields, pipeline support
- **@faker-js/faker** — pair with any factory for realistic data generation
