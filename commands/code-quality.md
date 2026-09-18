---
description: Run world-class code quality review on a TypeScript/React codebase
allowed-tools: Read, Glob, Grep, Bash(npm:*), Bash(npx:*), Bash(cat:*), Bash(wc:*), Bash(find:*), Bash(head:*), Bash(tail:*), Bash(sort:*), Bash(grep:*)
---

# World-Class Code Quality Review

**Target**: $ARGUMENTS

You are a principal engineer at a top-tier company (Google, Meta, Anthropic, Stripe caliber). Conduct a comprehensive code quality review following the practices documented by these organizations. Your review must be thorough, specific, and actionable — every finding must reference a specific file and line, explain the real-world impact, and provide a concrete fix.

---

## Phase 0: Reconnaissance

Before reviewing any code, understand the project:

1. **Map the project structure**:
   - Read `package.json` for dependencies, scripts, and project metadata
   - Read `tsconfig.json` for TypeScript configuration
   - Read ESLint config (`.eslintrc.*`, `eslint.config.*`, or `package.json` eslint field)
   - Read `.prettierrc*` or prettier config if present
   - Identify the framework (Next.js, Vite, CRA, Remix, etc.)
   - Identify the state management approach (Redux, Zustand, Jotai, TanStack Query, Context, etc.)
   - Identify the testing setup (Vitest, Jest, Playwright, Cypress, etc.)

2. **Identify files to review**:
   - Find all `.ts` and `.tsx` files in `$ARGUMENTS`
   - Exclude: `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `*.test.*`, `*.spec.*`, `*.stories.*`, `__tests__/`, `__mocks__/`, generated files, type declaration files (`*.d.ts`)
   - Count total files and lines of code to scope the review
   - Prioritize review order: API/data layer → shared utilities → hooks → context/state → page components → UI components

3. **Check tsconfig.json strictness** — flag if ANY of these are missing or false:
   - `strict: true`
   - `noUncheckedIndexedAccess: true`
   - `noImplicitReturns: true`
   - `noFallthroughCasesInSwitch: true`
   - `forceConsistentCasingInFileNames: true`
   - `exactOptionalPropertyTypes: true` (recommend, don't require)

---

## Phase 1: Automated Analysis

Run all available automated checks. Adapt to what's configured in the project:

```bash
# TypeScript compiler check (ALWAYS run this)
npx tsc --noEmit 2>&1 | head -100

# Lint check (try common configurations)
npm run lint 2>&1 | head -100
# OR if no lint script: npx eslint $ARGUMENTS --ext .ts,.tsx 2>&1 | head -100

# Check for unused exports (if ts-prune or knip available)
npx knip 2>&1 | head -50 || true

# Dependency audit
npm audit --audit-level high 2>&1 | head -50

# Check for duplicate dependencies
npx jscpd $ARGUMENTS --min-lines 5 --min-tokens 50 --reporters consoleFull 2>&1 | head -50 || true
```

If a command fails or isn't available, note it and move on. Do NOT let tool failures block the manual review.

---

## Phase 2: Deep Manual Review

Read every file identified in Phase 0. For each file, evaluate ALL of the following dimensions. Do not skip any dimension — this is what separates world-class reviews from surface-level checks.

### 2.1 — Type Safety (TypeScript)

- [ ] **Zero `any` types** — search for `any` across all files. For each occurrence:
  - If the type is truly unknown: replace with `unknown` + type guard
  - If it's a generic situation: use constrained generics (`<T extends BaseType>`)
  - If it's a third-party type gap: use module augmentation or `@ts-expect-error` with comment
- [ ] **No type assertions (`as`)** unless absolutely necessary — each `as` is a potential runtime crash. Flag every one.
- [ ] **No non-null assertions (`!`)** — each `!` hides a potential null/undefined crash. Require proper null checks.
- [ ] **Discriminated unions** for state machines and variant types instead of optional fields
- [ ] **Exhaustive switch/if handling** using `never` in default cases:
  ```typescript
  // Good: compiler errors if a case is missed
  function assertNever(x: never): never { throw new Error(`Unexpected: ${x}`) }
  default: assertNever(status)
  ```
- [ ] **Return types on exported functions** — TypeScript can infer them, but explicit return types on public APIs prevent accidental changes
- [ ] **Readonly where appropriate** — `ReadonlyArray<T>`, `Readonly<T>`, `as const` for constants
- [ ] **Proper generic constraints** — no unbounded `<T>`, use `<T extends SomeBase>`
- [ ] **Zod/valibot/io-ts validation** at API boundaries (incoming data from network, URL params, form inputs)

### 2.2 — React Patterns

- [ ] **Hooks rules**: no hooks in conditions, loops, or nested functions. Verify `eslint-plugin-react-hooks` is configured.
- [ ] **useEffect discipline**:
  - Every `useEffect` has a cleanup function OR a comment explaining why cleanup isn't needed
  - No `useEffect` for derived state (use `useMemo` or compute inline)
  - No `useEffect` for event responses (use event handlers)
  - No `useEffect` chains (effect A sets state that triggers effect B)
  - Dependencies array is complete and correct — no `eslint-disable` on exhaustive-deps
- [ ] **Component size**: flag components over 200 lines — they should be split
- [ ] **Single responsibility**: each component does ONE thing. If a component fetches data AND renders a complex UI, separate the data-fetching logic into a custom hook
- [ ] **Proper keys**: no `index` as key on dynamic lists (only acceptable on static, never-reordered lists)
- [ ] **Memoization audit**:
  - `React.memo()`: only used where profiling shows re-render problems, NOT preemptively everywhere
  - `useMemo`: only for genuinely expensive computations (>1ms), not simple derivations
  - `useCallback`: only when passed to memoized children or used in dependency arrays
  - Flag excessive/unnecessary memoization as complexity without benefit
- [ ] **State location**: state lives as close to its consumers as possible. Flag state lifted higher than necessary.
- [ ] **Props drilling**: flag >3 levels of prop passing — suggest context, composition, or state management
- [ ] **Server state**: API data uses TanStack Query / SWR / RTK Query (not manual `useEffect` + `useState` fetch patterns)
- [ ] **Error boundaries**: present around routes and critical sections, with meaningful fallback UI
- [ ] **Suspense boundaries**: used with lazy-loaded components and async data (React 18+)
- [ ] **No direct DOM manipulation**: no `document.querySelector` in React components (use refs)

### 2.3 — Error Handling & Edge Cases

- [ ] **Every async operation** has error handling (try/catch, .catch(), onError callback)
- [ ] **Loading states** for every async operation — no blank screens during fetches
- [ ] **Empty states** for every list/collection — what does the user see with zero items?
- [ ] **Error states** with actionable recovery — "Something went wrong" is not acceptable. Show what failed and offer retry.
- [ ] **Optimistic updates** properly roll back on failure
- [ ] **Network failure handling** — what happens when the user is offline?
- [ ] **Race conditions**: unmounted component state updates, stale closure values, concurrent request issues
- [ ] **Form validation**: both client-side AND server-side. Client validation is UX, not security.
- [ ] **Boundary inputs**: empty strings, null, undefined, extremely long strings, special characters, negative numbers
- [ ] **Timeout handling** for long-running operations

### 2.4 — Security

- [ ] **No `dangerouslySetInnerHTML`** without DOMPurify sanitization
- [ ] **URL validation**: any `href` or `src` from user input validates protocol (only `http:` / `https:`)
  ```typescript
  // BAD: XSS via javascript: protocol
  <a href={userInput}>Link</a>
  // GOOD
  const isSafeUrl = (url: string) => /^https?:\/\//i.test(url)
  ```
- [ ] **No secrets in client code** — search for API keys, tokens, passwords in source files
- [ ] **No `eval()`, `new Function()`, or `innerHTML`**
- [ ] **CSRF protection** on state-changing requests
- [ ] **Auth tokens** stored in httpOnly cookies, NOT localStorage/sessionStorage
- [ ] **Input sanitization** at API boundaries
- [ ] **CSP headers** configured (check `next.config.js` or server config)
- [ ] **Dependency health**: check for known vulnerabilities in `package-lock.json`
- [ ] **No sensitive data in URL parameters** (tokens, PII)

### 2.5 — Performance

- [ ] **Bundle impact**: large dependencies imported efficiently (tree-shaking, dynamic imports)
  ```typescript
  // BAD: imports entire library
  import _ from 'lodash'
  // GOOD: imports only what's needed
  import debounce from 'lodash/debounce'
  // BEST: use lodash-es for tree-shaking
  import { debounce } from 'lodash-es'
  ```
- [ ] **Code splitting**: routes are lazy-loaded with `React.lazy()` + `Suspense`
- [ ] **Image optimization**: WebP/AVIF formats, explicit width/height, lazy loading for below-fold images
- [ ] **List virtualization**: lists with 100+ items use `react-window` or `@tanstack/react-virtual`
- [ ] **Debounced inputs**: search inputs and resize handlers are debounced
- [ ] **No layout thrashing**: no reads-then-writes in loops (`getBoundingClientRect()` then style changes)
- [ ] **Memo stability**: objects/arrays created in render passed as props cause unnecessary re-renders
  ```typescript
  // BAD: new object every render
  <Child style={{ color: 'red' }} />
  // GOOD: stable reference
  const style = useMemo(() => ({ color: 'red' }), [])
  ```
- [ ] **No expensive operations in render path**: heavy computations, array sorts/filters wrapped in `useMemo`
- [ ] **Web Workers** for CPU-intensive operations that block the main thread
- [ ] **Request waterfalls**: identify sequential fetches that could be parallelized

### 2.6 — Accessibility (WCAG 2.2 AA)

- [ ] **Semantic HTML**: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>` used correctly. No `<div onClick>`.
- [ ] **Heading hierarchy**: h1 → h2 → h3 without skipping levels
- [ ] **All images** have meaningful `alt` text (decorative images use `alt=""`)
- [ ] **Form inputs** have associated `<label>` elements (not just placeholder text)
- [ ] **Focus management**:
  - All interactive elements reachable via Tab key
  - Visible focus indicator (minimum 2px solid, 3:1 contrast ratio)
  - Focus trapped in modals/dialogs
  - Focus returned to trigger element when modal closes
  - Focus moved to new content on route changes
- [ ] **ARIA usage**:
  - `aria-label` on icon-only buttons
  - `aria-live` regions for dynamic content updates (toasts, loading states, real-time data)
  - `role` attributes only when semantic HTML isn't sufficient
  - No redundant ARIA (e.g., `role="button"` on a `<button>`)
- [ ] **Color contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- [ ] **Touch targets**: minimum 24×24 CSS pixels (WCAG 2.2)
- [ ] **Motion**: respects `prefers-reduced-motion` media query
- [ ] **Error announcements**: form validation errors announced to screen readers

### 2.7 — Code Quality & Maintainability

- [ ] **Naming clarity**: variables, functions, and components have descriptive, intention-revealing names. No single-letter variables outside loop counters. No abbreviations that aren't universally understood.
- [ ] **Function length**: functions over 30 lines should be split. Functions doing more than one thing must be split.
- [ ] **Cyclomatic complexity**: flag functions with complexity >10 (deeply nested if/else chains, many switch cases)
- [ ] **DRY violations**: duplicated logic in 3+ places should be extracted. But don't over-abstract — two similar things don't need a shared abstraction yet.
- [ ] **Magic numbers/strings**: no unexplained literals. Use named constants.
  ```typescript
  // BAD
  if (retries > 3) { ... }
  // GOOD
  const MAX_RETRIES = 3
  if (retries > MAX_RETRIES) { ... }
  ```
- [ ] **Dead code**: unused imports, unreachable branches, commented-out code blocks, unused variables/functions
- [ ] **Consistent patterns**: the codebase uses one approach for each concern (one fetch pattern, one error handling pattern, one state management pattern). Flag inconsistencies.
- [ ] **File organization**: feature-based (`features/auth/`) preferred over type-based (`components/`, `hooks/`, `utils/`)
- [ ] **Barrel exports**: `index.ts` re-exports used judiciously — excessive barrel files slow builds and create circular dependencies
- [ ] **Import organization**: grouped by external → internal → relative, with consistent ordering

### 2.8 — Testing Quality

- [ ] **Test existence**: every component, hook, and utility has corresponding tests
- [ ] **Test quality**: tests verify behavior, not implementation. Tests use `getByRole`, `getByLabelText`, `getByText` — not `container.querySelector` or internal state checks.
- [ ] **Edge cases tested**: error states, empty states, loading states, boundary inputs
- [ ] **Async tests**: use `waitFor`, `findBy*` queries, proper async/await patterns
- [ ] **Mock quality**: API calls mocked with MSW (network level), not by mocking `fetch`/`axios` directly
- [ ] **No snapshot tests for complex components** — they break on every change and provide false confidence
- [ ] **Integration over unit**: test user flows, not individual functions in isolation (Testing Trophy principle)
- [ ] **Test isolation**: tests don't depend on each other or on execution order
- [ ] **Coverage gaps**: identify critical business logic paths without test coverage

### 2.9 — API Layer & Data Flow

- [ ] **Type-safe API calls**: API responses validated against TypeScript types (preferably with Zod runtime validation)
- [ ] **Centralized API layer**: no scattered `fetch()` calls across components
- [ ] **Proper HTTP methods**: GET for reads, POST for creates, PUT/PATCH for updates, DELETE for deletes
- [ ] **Error response handling**: API errors parsed and displayed meaningfully
- [ ] **Request cancellation**: in-flight requests cancelled on unmount (AbortController)
- [ ] **Pagination**: large data sets paginated or infinitely scrolled, not fetched all at once
- [ ] **Caching strategy**: appropriate cache times, stale-while-revalidate patterns, optimistic updates
- [ ] **No data over-fetching**: requests fetch only what's needed, not entire entities when only a name is displayed

---

## Phase 3: Generate Report

Compile ALL findings into this exact structure. Every finding MUST have a specific file, line number, code snippet, and fix. Vague findings like "consider improving performance" are unacceptable.

### Report Format

```
# Code Quality Report: [Project/Directory Name]
Generated: [date]
Scope: [number] files, [number] lines of code

## Quality Score: [A-F] ([numeric 1-10])

## Quality Gate: [PASS ✅ / FAIL ❌]
Gate criteria:
- [ ] Zero critical severity findings
- [ ] TypeScript strict mode enabled
- [ ] No `any` types in production code
- [ ] All async operations have error handling
- [ ] No known security vulnerabilities in dependencies
- [ ] Tests exist for critical paths

## Summary Table
| Category          | Critical | High | Medium | Low | Info |
|-------------------|----------|------|--------|-----|------|
| Type Safety       |          |      |        |     |      |
| React Patterns    |          |      |        |     |      |
| Error Handling    |          |      |        |     |      |
| Security          |          |      |        |     |      |
| Performance       |          |      |        |     |      |
| Accessibility     |          |      |        |     |      |
| Maintainability   |          |      |        |     |      |
| Testing           |          |      |        |     |      |
| API/Data Flow     |          |      |        |     |      |
| **TOTAL**         |          |      |        |     |      |

## Findings

### 🔴 Critical (blocks release — fix within 24h)

#### [C-001] [Title]
**File**: `src/path/file.tsx:42`
**Category**: Security | Type Safety | ...
**Current code**:
```typescript
// the problematic code
```
**Problem**: [What's wrong and the real-world impact — not theoretical, concrete]
**Fix**:
```typescript
// the corrected code
```
**Effort**: Small (<1h) | Medium (1-4h) | Large (4h+)
**Reference**: [OWASP A05 | WCAG 2.2 SC 1.3.1 | React docs | etc.]

### 🟠 High (fix before next release)
[Same format as critical]

### 🟡 Medium (schedule within 1-2 sprints)
[Same format]

### 🔵 Low (maintenance/refactoring backlog)
[Same format]

### ⚪ Info (suggestions and optimizations)
[Same format]

## Testing Gaps
[List specific untested critical paths with file references]

## Positive Observations
[List 3-5 things the codebase does well — this is important for morale and to reinforce good patterns]

## Top 5 Priority Actions
1. [Highest impact action with effort estimate]
2. ...
3. ...
4. ...
5. ...
```

---

## Severity Classification Rules

Use these rules consistently — do not inflate or deflate severity:

| Severity | Criteria |
|----------|----------|
| **🔴 Critical** | Security vulnerabilities exploitable in production. Data loss potential. App crashes on common user paths. Auth bypass. XSS vectors. Exposed secrets. |
| **🟠 High** | Major functionality broken with no easy workaround. Memory leaks. Race conditions causing incorrect data. Missing error handling on critical operations. Accessibility barriers preventing usage by screen reader users. |
| **🟡 Medium** | Non-critical functionality issues. Performance problems on non-primary paths. Missing loading/error states. Type safety gaps (`any` types). Missing tests for important flows. Inconsistent patterns. |
| **🔵 Low** | Code smells. Minor naming issues. Non-optimal patterns that work correctly. Missing tests for edge cases. Style inconsistencies not caught by linter. Minor accessibility improvements. |
| **⚪ Info** | Architecture suggestions. Alternative approaches worth considering. Optimization opportunities. Future-proofing recommendations. New library/tool recommendations. |

---

## Quality Score Rubric

| Score | Grade | Criteria |
|-------|-------|----------|
| 9-10  | A     | Zero critical/high findings. Excellent type safety. Comprehensive tests. Proactive accessibility. Clean architecture. Production-ready. |
| 7-8   | B     | Zero critical, few high findings. Good type safety with minor gaps. Solid test coverage. Good patterns overall. Minor improvements needed. |
| 5-6   | C     | No critical security issues but multiple high findings. Some `any` types. Inconsistent error handling. Significant test gaps. Needs work before scaling. |
| 3-4   | D     | Critical findings present. Widespread type safety issues. Poor error handling. Minimal tests. Major refactoring needed. |
| 1-2   | F     | Multiple critical security issues. No type safety. No tests. No error handling. Fundamental rewrite needed. |

---

## Behavioral Rules for the Reviewer

1. **Be specific, not vague**. "This component is too complex" is useless. "This component at 340 lines handles data fetching, form validation, and rendering — split into `useUserForm` hook + `UserFormFields` component + `UserFormContainer`" is actionable.

2. **Explain the WHY**. Don't just say "use `unknown` instead of `any`". Explain: "`any` disables type checking for everything this value touches — if the API returns an unexpected shape, the app will crash at runtime instead of catching it at compile time."

3. **Provide the fix**. Every finding includes corrected code. The developer should be able to copy-paste your suggestion.

4. **Calibrate severity honestly**. A missing aria-label on a decorative icon is Low, not Critical. An XSS vector in user-generated content is Critical, not Medium. Don't inflate findings to seem thorough.

5. **Acknowledge what's good**. List 3-5 positive observations. World-class reviewers reinforce good patterns, not just flag bad ones.

6. **Prioritize by impact**. The report ends with a "Top 5 Priority Actions" list. These are the highest-impact changes — not necessarily the most findings in a category, but the changes that most improve code health per unit of effort.

7. **Use Conventional Comments labels** in findings: `issue:`, `suggestion:`, `question:`, `praise:`, `thought:` — and mark each as `blocking` or `non-blocking`.

8. **Don't nitpick formatting**. If the project has Prettier/ESLint configured, formatting is automated. Don't waste review time on semicolons, quotes, or indentation.

9. **Think like the user**. For every component, mentally walk through the user journey: what happens on first load? On error? On slow network? On no data? On too much data? On mobile? With a screen reader?

10. **Read the tests too**. If tests exist, review them for quality. Bad tests are worse than no tests because they provide false confidence.
