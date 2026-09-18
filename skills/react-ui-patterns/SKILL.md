---
name: react-ui-patterns
description: Modern React UI patterns for loading states, error handling, and data fetching. Use when building UI components, handling async data, or managing UI states. Covers TanStack Query v5, React 19 primitives (use(), useOptimistic, useActionState), Suspense + ErrorBoundary composition, streaming SSR, optimistic updates, and performance patterns.
---

# React UI Patterns

## Core Principles

1. **Boundaries own async state** — Suspense handles loading, ErrorBoundary handles errors. Components stay free of boolean juggling.
2. **Never show stale UI** — show cached data immediately; revalidate in the background.
3. **Always surface errors** — users must know when something fails, at the right scope.
4. **Optimistic updates** — make the UI feel instant for high-confidence mutations.
5. **Progressive disclosure** — stream and reveal content as it becomes available.
6. **Graceful degradation** — isolate failures so partial data beats no data.
7. **Separate server state from client state** — use TanStack Query/SWR for API data exclusively; use Zustand/Jotai for UI state. Never store server responses in Redux or Zustand.

---

## Loading State Patterns

### Perceived Load Time Thresholds (production-validated)

| Duration | Strategy |
|---|---|
| < 300ms | Show **nothing** — flashing a loader creates unnecessary noise |
| 300ms – 1.5s | Show a **spinner** — lightweight indicator is enough |
| > 1.5s | Show **skeleton loaders** — reduces perceived wait by up to 30% |

Implement with a `DelayedFallback` wrapper:

```tsx
function DelayedFallback({ delay = 300, children }: { delay?: number; children: ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return show ? <>{children}</> : null;
}

<Suspense fallback={
  <DelayedFallback delay={300}>
    <SkeletonCard count={6} />
  </DelayedFallback>
}>
  <ProductList />
</Suspense>
```

### The Golden Rule

**Show a loading indicator ONLY when there is no data to display.**

```tsx
// ✅ CORRECT — Only show loading when no cached data exists
const { data, isPending, error } = useQuery(productOptions);
if (error) return <ErrorState error={error} onRetry={refetch} />;
if (isPending && !data) return <LoadingState />;        // isPending replaces isLoading in TanStack v5
if (!data?.items.length) return <EmptyState />;
return <ItemList items={data.items} />;

// ❌ WRONG — Flashes spinner on every background refetch
if (isPending) return <LoadingState />;
```

### Loading State Decision Tree

```
Is there an error?
  → Yes: Show error state with retry
  → No: Continue
Is it loading AND we have no cached data?
  → Yes: Show skeleton / spinner (use DelayedFallback to suppress < 300ms)
  → No: Continue
Do we have data?
  → Yes, with items: Render the data (show subtle isFetching indicator if needed)
  → Yes, but empty: Show empty state
  → No: Show loading fallback
```

### Skeleton vs Spinner

| Use Skeleton When | Use Spinner When |
|---|---|
| Known content shape (cards, lists, tables) | Unknown content shape |
| Initial page load | Modal actions, button submissions |
| Streaming SSR sections | Inline / pagination operations |
| Content > 1.5s to load | Content < 1.5s to load |

> **CLS Warning**: Skeleton heights must match final content height. Shorter skeletons cause layout shift and Google Core Web Vitals penalties.

**Libraries**: `react-loading-skeleton` (DOM-based, simple), `react-content-loader` (SVG-based, customizable), Tailwind `animate-pulse` (no dependency).

---

## Suspense-Based Async Architecture

Suspense is a **rendering coordination mechanism**, not just a loading spinner API. When a component suspends (throws a Promise), React shows the nearest Suspense boundary's fallback. When the Promise resolves, React re-renders with real content.

### Three Data Fetching Paradigms

| Pattern | How | Problem |
|---|---|---|
| Fetch-on-render (`useEffect`) | Children fetch after parent renders | Creates request waterfalls |
| Fetch-then-render | Block until all data arrives | Slowest perceived load |
| **Render-as-you-fetch (Suspense)** | Fetch immediately, render as data resolves | ✅ Fastest perceived experience |

### useSuspenseQuery — the production pattern

```tsx
import { useSuspenseQuery, useSuspenseQueries } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  // data is GUARANTEED defined — no undefined checks needed
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  return <div>{user.name} — {user.email}</div>;
}

// ⚠️ React 19 behavior: siblings inside one Suspense boundary load SEQUENTIALLY
// ✅ Use useSuspenseQueries to keep parallel fetching:
const [users, teams] = useSuspenseQueries({
  queries: [
    { queryKey: ['users'], queryFn: fetchUsers },
    { queryKey: ['teams'], queryFn: fetchTeams },
  ],
});
```

### Suspense boundary placement strategy

- **One boundary per independent UX section** — each section shows its own skeleton.
- **Never one boundary for everything** — defeats streaming.
- **Never a boundary per element** — causes jarring pop-in.
- **Nest ErrorBoundary outside Suspense** — ErrorBoundary catches errors, Suspense catches loading.

```tsx
function ProfilePage({ userId }: { userId: string }) {
  return (
    <>
      <ErrorBoundary FallbackComponent={ProfileError}>
        <Suspense fallback={<HeaderSkeleton />}>
          <UserProfile userId={userId} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={PostsError}>
        <Suspense fallback={<PostsSkeleton />}>
          <UserPosts userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
```

### Streaming SSR with Next.js App Router

```tsx
// app/dashboard/page.tsx — each section streams independently from the server
export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <Header />         {/* Static — sends instantly */}
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsPanel />   {/* Streams when metrics query resolves */}
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />   {/* Streams independently */}
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}
```

---

## Data Fetching with TanStack Query v5

TanStack Query (~12.3M weekly npm downloads) provides caching, deduplication, background revalidation, and retry — behaviors you'd otherwise build poorly from scratch.

### Key v5 API Changes from v4

| v4 | v5 |
|---|---|
| `isLoading` | `isPending` (primary flag); `isLoading = isPending && isFetching` |
| `cacheTime` | `gcTime` |
| `onSuccess`/`onError` on `useQuery` | Removed — use `useEffect` or mutation callbacks |
| Multiple overloads | Single object argument everywhere |
| `initialPageParam` optional | **Required** for `useInfiniteQuery` |

### queryOptions — type-safe, reusable query definitions

```tsx
import { queryOptions } from '@tanstack/react-query';

// Define once — reuse everywhere with full TypeScript inference
export const todoOptions = (id: number) =>
  queryOptions({
    queryKey: ['todos', id],
    queryFn: () => fetchTodo(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// All consumers stay in sync:
useQuery(todoOptions(1));
useSuspenseQuery(todoOptions(5));
queryClient.prefetchQuery(todoOptions(23));
queryClient.setQueryData(todoOptions(42).queryKey, updatedTodo);
```

> **Tip**: Set a global `staleTime` of at least 60 seconds. The default of `0` causes a refetch on every component mount, defeating caching.

### Cache Invalidation Strategies

**`invalidateQueries`** — marks stale and background-refetches active queries. Supports prefix/fuzzy matching: invalidating `['todos']` invalidates `['todos', 'list']`, `['todos', 'detail', 1]`, etc.

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onSettled: () => {
    // onSettled (not onSuccess) handles both success and error cases
    // Return the promise to keep mutation pending until refetch completes
    return queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

**`setQueryData`** — directly update cache for instant UI when you know the result.

**Optimistic updates (v5 simplified)** — use `mutation.variables` instead of `onMutate`:

```tsx
const addTodo = useMutation({
  mutationFn: (text: string) => api.createTodo(text),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

// Render optimistic item directly from mutation state:
<ul>
  {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
  {addTodo.isPending && (
    <li style={{ opacity: 0.5 }}>{addTodo.variables}</li>
  )}
</ul>
```

For complex rollback scenarios, use the `onMutate`/`onError` cache snapshot approach.

### Server Components + HydrationBoundary

```tsx
// app/posts/page.tsx — Server Component prefetches data
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function PostsPage() {
  const queryClient = new QueryClient(); // ⚠️ Always create inside the component, never at module scope
  await queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList /> {/* Client component — data already in cache, no loading flash */}
    </HydrationBoundary>
  );
}
```

### TanStack Query vs SWR

| | TanStack Query | SWR |
|---|---|---|
| Bundle size | ~11.4 kB gzipped | ~4.2 kB gzipped |
| Mutations | Full support + optimistic rollback | Basic |
| DevTools | Official, powerful | Third-party |
| Best for | Complex apps, mutations, caching hierarchies | Read-heavy, minimal mutations |

---

## React 19 Primitives

### use() — unwrap Promises in render

```tsx
// Server Component starts the fetch (NOT awaited)
export default function Page() {
  const postsPromise = getPosts();
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <Posts posts={postsPromise} />
    </Suspense>
  );
}

// Client Component reads the Promise — suspends until resolved
'use client';
import { use } from 'react';

export default function Posts({ posts }: { posts: Promise<Post[]> }) {
  const allPosts = use(posts); // Can be called conditionally — unlike other hooks
  return <ul>{allPosts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

> **Important**: `use()` requires a **stable promise** — not one recreated on every render. For most client-side fetching, TanStack Query or SWR remain better choices (automatic caching, deduplication, revalidation).

### useOptimistic — built-in optimistic updates

Best for high-confidence, reversible operations (likes, toggles, comments). Auto-rolls back to real state if the action throws.

```tsx
import { useOptimistic, startTransition } from 'react';

function MessageThread({ messages, sendMessage }: Props) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, newMsg: string) => [...current, { text: newMsg, sending: true }]
  );

  async function handleSend(formData: FormData) {
    const text = formData.get('message') as string;
    startTransition(async () => {
      addOptimistic(text);       // Instant UI update
      await sendMessage(text);   // Server request — rolls back on throw
    });
  }

  return (
    <form action={handleSend}>
      {optimisticMessages.map((msg, i) => (
        <div key={i} style={{ opacity: msg.sending ? 0.5 : 1 }}>{msg.text}</div>
      ))}
      <input name="message" /><button type="submit">Send</button>
    </form>
  );
}
```

### useActionState + useFormStatus — form handling without boilerplate

```tsx
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus(); // Must be inside a <form> with action prop
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}

async function createUser(_prevState: unknown, formData: FormData) {
  try {
    await saveUser(formData.get('name') as string);
    return { success: true, error: null };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

function UserForm() {
  const [state, action, isPending] = useActionState(createUser, { success: false, error: null });
  return (
    <form action={action}>
      <input name="name" />
      <SubmitButton />
      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

### useTransition — async, non-blocking state updates

React 19 enhanced `useTransition` to accept async functions, automatically tracking pending state through `await` calls. Use for expensive non-blocking updates like tab switches or data mutations.

```tsx
const [isPending, startTransition] = useTransition();

function handleTabChange(tab: string) {
  startTransition(async () => {
    await loadTabData(tab);
    setActiveTab(tab);
  });
}
```

---

## Error Handling Patterns

### Error Boundary Hierarchy

Deploy boundaries in layers — never just one root boundary:

```
1. Root boundary        → Last resort, full-page error + Reload button
2. Route boundaries     → Per-page isolation, broken pages don't kill the app
3. Section boundaries   → Independent widgets render independently on failure
4. Component boundaries → High-risk or third-party components
```

Limit visible error messages to **≤5 per page** to avoid the perception that the entire app is broken.

### The Canonical Composition: QueryBoundary

**ErrorBoundary wraps outside Suspense.** Suspense catches thrown Promises (loading); ErrorBoundary catches thrown Errors. Together they form a complete state machine.

```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function QueryBoundary({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}  // Clears TanStack Query error state on retry
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div role="alert" className="error-state">
              <p>Error: {error.message}</p>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <Suspense fallback={fallback ?? <Skeleton />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

// Usage — one composable component handles all async states
<QueryBoundary fallback={<DashboardSkeleton />}>
  <Dashboard />
</QueryBoundary>
```

### Bridging Async/Event Handler Errors

Class-based boundaries cannot catch errors in event handlers or async callbacks. Use `useErrorBoundary` from `react-error-boundary`:

```tsx
import { useErrorBoundary } from 'react-error-boundary';

function DataLoader() {
  const { showBoundary } = useErrorBoundary();
  const handleClick = async () => {
    try {
      await fetchData();
    } catch (error) {
      showBoundary(error); // Propagates to nearest ErrorBoundary
    }
  };
  return <button onClick={handleClick}>Load</button>;
}
```

### Typed Error Classes

```tsx
class AppError extends Error {
  constructor(message: string, public readonly code: string, public readonly status: number) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

class NetworkError extends AppError {
  constructor(message: string, status: number) {
    super(message, 'NETWORK_ERROR', status);
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

class ValidationError extends AppError {
  constructor(message: string, public readonly fields: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 422);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Route errors to the right handler
function handleError(error: unknown) {
  if (error instanceof NetworkError && error.status >= 500) {
    toast.error('Server issue — retrying...');
  } else if (error instanceof ValidationError) {
    setFieldErrors(error.fields); // Inline field errors
  } else if (error instanceof AuthenticationError) {
    router.push('/login');
  } else {
    Sentry.captureException(error);
    toast.error('Something unexpected happened.');
  }
}
```

### Retry Configuration — never retry client errors

```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  retry: (failureCount, error) => {
    // ❌ Never retry 4xx — they indicate bad requests, not transient failures
    if (error instanceof NetworkError && error.status >= 400 && error.status < 500) {
      return false;
    }
    return failureCount < 3; // Default: exponential backoff 1s → 2s → 4s, max 30s
  },
});
```

### Error Hierarchy by Scope

```
1. Inline error (field-level)  → Form validation
2. Toast notification          → Recoverable, user can retry
3. Error banner                → Page-level, data still partially usable
4. Section ErrorBoundary       → Widget failed, rest of page works
5. Full error screen           → Unrecoverable, needs user action
```

**CRITICAL: Never swallow errors silently.**

```tsx
// ✅ CORRECT — Error always surfaced to user
const { mutate: createItem } = useMutation({
  mutationFn: createItemApi,
  onSuccess: () => toast.success('Item created'),
  onError: (error) => {
    console.error('createItem failed:', error);
    toast.error('Failed to create item. Please try again.');
  },
});

// ❌ WRONG — User sees nothing
onError: (error) => { console.error(error); }
```

### Toast Libraries

**Sonner** (used by OpenAI, Adobe) — ~2–3 kB gzipped, `toast.promise()` API transitions automatically through loading/success/error states.

```tsx
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved successfully',
  error: (err) => `Save failed: ${err.message}`,
});
```

---

## Component Architecture

### AsyncBoundary — reusable composable

```tsx
interface AsyncBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  onError?: (error: Error, info: ErrorInfo) => void;
}

function AsyncBoundary({
  children,
  loadingFallback = <Spinner />,
  errorFallback: ErrorFallback = DefaultErrorFallback,
  onError,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Separation of Concerns: Hook + Presentational Component

```tsx
// Data layer — hook owns all async concerns
function useUserData(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 60_000,
  });
}

// Presentation layer — pure component, easily testable and reusable
function UserCard({ user }: { user: User }) {
  return <div><h1>{user.name}</h1><p>{user.email}</p></div>;
}

// Composition layer — connects data to presentation
function UserPage({ userId }: { userId: string }) {
  const { data: user, isPending, error, refetch } = useUserData(userId);
  if (isPending && !user) return <UserCardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return <UserCard user={user!} />;
}
```

### Error State Component

```tsx
interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
}

const ErrorState = ({ error, onRetry, title }: ErrorStateProps) => (
  <div className="error-state" role="alert">
    <Icon name="exclamation-circle" />
    <h3>{title ?? 'Something went wrong'}</h3>
    <p>{error.message}</p>
    {onRetry && <Button onClick={onRetry}>Try Again</Button>}
  </div>
);
```

---

## Button and Form State Patterns

### Button Loading State

**CRITICAL: Always disable buttons during async operations.**

```tsx
// ✅ CORRECT — Disabled and shows loading
<Button
  onClick={handleSubmit}
  disabled={!isValid || isSubmitting}
  isLoading={isSubmitting}
>
  Submit
</Button>

// ❌ WRONG — User can trigger multiple submissions
<Button onClick={handleSubmit}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Complete Form Pattern

```tsx
const MyForm = () => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: submitFormApi,
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error('Form submit failed:', error);
      toast.error('Submission failed. Please try again.');
    },
  });

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error('Please fix the highlighted errors.');
      return;
    }
    submit({ input: values });
  };

  return (
    <form>
      <Input
        value={values.name}
        onChange={handleChange('name')}
        error={touched.name ? errors.name : undefined}
      />
      <Button
        type="submit"
        onClick={handleSubmit}
        disabled={!isValid || isPending}
        isLoading={isPending}
      >
        Submit
      </Button>
    </form>
  );
};
```

---

## Empty States

Every list or collection **must** have an explicit empty state.

```tsx
// ❌ WRONG — No empty state
return <ItemList items={items} />;

// ✅ CORRECT — Explicit empty state
return items.length === 0
  ? <EmptyState icon="plus-circle" title="No items yet" description="Create your first item" action={{ label: 'Create Item', onClick: handleCreate }} />
  : <ItemList items={items} />;

// Contextual empty states
const emptyStatesByContext = {
  search: { icon: 'search', title: 'No results found', description: 'Try different search terms' },
  filter: { icon: 'filter', title: 'No matches', description: 'Adjust your filters' },
  empty: { icon: 'plus-circle', title: 'Nothing here yet', description: 'Get started by creating one' },
};
```

---

## Performance Patterns

### Eliminate Fetch Waterfalls

A 4-deep waterfall of 300ms requests costs 1.2 seconds. Three strategies eliminate them:

**1. Hoist queries to the same component level** — two `useQuery` calls in the same component fire in parallel.

**2. Use `useSuspenseQueries` or `Promise.all`** for independent data:

```tsx
// ✅ Parallel — fires simultaneously
const [users, teams] = useSuspenseQueries({
  queries: [
    { queryKey: ['users'], queryFn: fetchUsers },
    { queryKey: ['teams'], queryFn: fetchTeams },
  ],
});

// In server components:
const [posts, user] = await Promise.all([fetchPosts(), fetchUser(id)]);
```

**3. Prefetch on intent** — fetch before the user navigates:

```tsx
function ProductCard({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return (
    <Link
      to={`/products/${id}`}
      onMouseEnter={() =>
        queryClient.prefetchQuery({
          queryKey: ['product', id],
          queryFn: () => fetchProduct(id),
        })
      }
    >
      View Product
    </Link>
  );
}
```

### Stale-While-Revalidate

Return cached data instantly, revalidate in the background. Configure both:

- **`staleTime`**: How long data is considered fresh (no background refetch). Set a global default of **at least 60 seconds**.
- **`gcTime`**: When unused cache entries are garbage collected (default: 5 minutes).

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,    // 1 minute fresh
      gcTime: 5 * 60 * 1000,  // 5 minutes in cache
    },
  },
});
```

### Request Deduplication

TanStack Query and SWR deduplicate automatically — if three components call `useQuery({ queryKey: ['user', 1] })`, only one HTTP request fires. Mutations are never deduplicated (they have side effects).

### Background Refetch Indicator

Show a subtle indicator when cached data is being updated in the background — don't block the UI:

```tsx
const { data, isFetching } = useQuery(userOptions(id));
return (
  <div>
    <UserCard user={data} />
    {isFetching && <span className="text-xs text-muted">Refreshing...</span>}
  </div>
);
```

---

## Testing Patterns

### MSW — the standard for API mocking

MSW intercepts at the network level. The same handlers work in tests, Storybook, and development.

```tsx
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () =>
    HttpResponse.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }])
  ),
];

// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);

// setupTests.ts
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Testing All Three Async States

```tsx
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } }, // ⚠️ Always disable retries in tests
  });
}

test('shows loading skeleton, then data', async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <UserList />
    </QueryClientProvider>
  );
  // Loading state
  expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  // Success state
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

test('shows error state on server failure', async () => {
  server.use(
    http.get('/api/users', () => new HttpResponse(null, { status: 500 })),
  );
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <UserList />
    </QueryClientProvider>
  );
  await screen.findByRole('alert');
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

test('shows empty state when no data', async () => {
  server.use(http.get('/api/users', () => HttpResponse.json([])));
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <UserList />
    </QueryClientProvider>
  );
  expect(await screen.findByText(/no items yet/i)).toBeInTheDocument();
});
```

**Critical TanStack Query testing rules**:
- Always create a **new `QueryClient` per test** — prevents cache bleeding between tests.
- Set **`retry: false`** — prevents slow, confusing test failures on network errors.
- Use **`findByText`** (not `getByText`) to wait for async state resolution.

---

## Anti-Patterns

### Loading States

```tsx
// ❌ WRONG — Spinner flashes on background refetch when data already exists
if (isPending) return <Spinner />;

// ✅ CORRECT — Only show loading indicator when there's no data
if (isPending && !data) return <Spinner />;
```

### Error Handling

```tsx
// ❌ WRONG — Error silently swallowed
try {
  await mutation();
} catch (e) {
  console.log(e); // User has no idea what happened
}

// ❌ WRONG — Storing server data in client state manager
const [userData, setUserData] = useState(null);
useEffect(() => { fetchUser().then(setUserData); }, []);

// ✅ CORRECT — Error surfaced to user + logged for observability
onError: (error) => {
  console.error('operation failed:', error);
  toast.error('Operation failed. Please try again.');
}
```

### Button States

```tsx
// ❌ WRONG — User can trigger multiple submissions
<Button onClick={submit}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>

// ✅ CORRECT — Disabled + loading indicator
<Button onClick={submit} disabled={isPending} isLoading={isPending}>Submit</Button>
```

### QueryClient Scope

```tsx
// ❌ WRONG — Module-scope QueryClient leaks data between users/requests
const queryClient = new QueryClient();
export default function App() { ... }

// ✅ CORRECT — Always created inside the component (React state or ref)
export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}><Router /></QueryClientProvider>;
}
```

### React 19 Parallel Queries

```tsx
// ❌ WRONG in React 19 — siblings inside one Suspense boundary load SERIALLY
const users = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers });
const teams = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams });

// ✅ CORRECT — use useSuspenseQueries for parallel fetching
const [users, teams] = useSuspenseQueries({
  queries: [
    { queryKey: ['users'], queryFn: fetchUsers },
    { queryKey: ['teams'], queryFn: fetchTeams },
  ],
});
```

---

## Checklist

Before completing any UI component with async data:

**UI States:**
- [ ] Error state handled and shown at the correct scope (field / toast / section / full-page)
- [ ] Loading state shown only when no cached data exists (uses `isPending && !data`)
- [ ] DelayedFallback prevents spinner flash for sub-300ms responses
- [ ] Skeleton heights match final content height (no CLS)
- [ ] Empty state provided for every list/collection
- [ ] Buttons disabled + show loading indicator during async operations
- [ ] Background refetch shows subtle indicator (not blocking spinner)

**Data & Mutations:**
- [ ] Uses TanStack Query / SWR for server state — not useState + useEffect
- [ ] QueryClient created inside component, not at module scope
- [ ] `staleTime` set to ≥ 60 seconds (global default recommended)
- [ ] All mutations have `onError` handler that shows feedback to the user
- [ ] `onSettled` used instead of `onSuccess` for cache invalidation (handles both outcomes)
- [ ] Client errors (4xx) excluded from retry logic
- [ ] `useSuspenseQueries` used for parallel fetching (React 19 compatibility)

**Error Boundaries:**
- [ ] ErrorBoundary wraps outside Suspense (not inside)
- [ ] `QueryErrorResetBoundary` wraps TanStack Query error boundaries
- [ ] Retry button resets both ErrorBoundary and query error state
- [ ] Async/event handler errors propagated via `showBoundary` from `useErrorBoundary`

**Testing:**
- [ ] New `QueryClient` created per test with `retry: false`
- [ ] MSW handlers cover loading, success, error, and empty states
- [ ] `findBy*` queries used for async assertions (not `getBy*`)

---

## Integration with Other Skills

- **testing-patterns**: Test all UI states (loading, error, empty, success) using MSW + React Testing Library
- **frontend-designer**: Apply loading skeletons and error states with the component's visual aesthetic; ensure skeleton shapes match final layout to avoid CLS
- **core-components**: Use core component primitives (Box, Card, Button) as building blocks for UI state patterns
- **systematic-debugging**: When async state management causes unexpected behavior, use systematic debugging to trace the root cause

## Troubleshooting

### Suspense fallback flashing briefly
**Issue**: Loading spinner appears and disappears too quickly, creating jarring flash.
**Solution**: Wrap your fallback in `DelayedFallback` with a 300ms threshold to suppress spinners for fast loads. Only show the loader if the request takes longer than perceived load time threshold.

### Error boundary not catching errors
**Issue**: Errors in event handlers or async callbacks aren't caught by ErrorBoundary.
**Solution**: Use `useErrorBoundary` hook from `react-error-boundary`. Call `showBoundary(error)` in catch blocks to propagate errors to the nearest ErrorBoundary.

### Stale data after mutation
**Issue**: UI shows cached data even after a mutation updates the server.
**Solution**: Invalidate the relevant query keys after mutation completes. Use `onSettled` callback with `queryClient.invalidateQueries({ queryKey: ['...'] })` to trigger a background refetch.

### Hydration mismatch with SSR
**Issue**: Server renders different content than client, causing "Hydration failed" warnings.
**Solution**: Ensure server and client render identical initial state. Avoid random IDs or timestamps. Use `HydrationBoundary` to pass server-rendered query state to the client, ensuring cache consistency.
