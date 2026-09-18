---
name: testing-process
description: Guidelines for testing code after implementation or bug fixes. Covers test creation, coverage analysis, and verification workflows. Use when finishing a feature, fixing a bug, when the user asks to 'run tests', 'add tests', 'verify this works', 'check test coverage', or after any code change that needs validation. For detailed Jest/TDD patterns, use the testing-patterns skill instead.
---

# Testing & Quality Assurance Process

## Guidelines

1. Always try to add tests for any new functionality, and make sure to cover all cases and code branches, according to requirements.
2. Always try to add tests for any bug-fixes, if the discovered bug is not already covered by tests. If the bug was already covered by tests, fix the existing tests as needed.
3. Always run all existing tests after you are done with a given implementation or bug-fix.

Use the following guidelines when working with tests:

- Ensure comprehensive testing
- Use table-/data-driven tests and test generation
- Benchmark tests and performance regression detection
- Integration testing with test containers
- Mock generation using the project's language-appropriate best practices and well-established mocking frameworks
- Property-based testing using the project's language-appropriate best practices and well-established testing frameworks
- Propose end-to-end testing strategies if automated e2e testing is not feasible
- Code coverage analysis and reporting

## Test Execution Workflow

Follow these concrete steps when running tests after implementation or bug fixes:

**Step 1: Identify what changed**
Document which files, functions, and behaviors were added or modified. This helps determine what test coverage gaps exist and what regression testing is needed.

**Step 2: Run existing tests to establish baseline**
Execute the full test suite before adding new tests. This establishes a clean baseline and ensures you catch any regressions introduced by your changes. Record the initial pass/fail state.

**Step 3: Add new tests for uncovered changes**
Write tests covering:
- New functionality and code paths
- Edge cases and boundary conditions
- Error handling and validation
- Integration points with existing code
- Any bug fixes (tests that would have caught the bug)

Ensure tests are added incrementally alongside implementation, not after the fact.

**Step 4: Run the full suite and verify no regressions**
Re-run all tests to confirm:
- New tests pass
- Existing tests still pass
- No unexpected failures
- No test interference or shared state issues

**Step 5: Check coverage report for blind spots**
Review the coverage report (line, branch, and function coverage) to identify untested code paths. Focus on business logic and critical paths rather than chasing 100% coverage.

## Coverage Strategy

**Target 70-80% coverage, not 100%**
- 100% coverage can lead to testing trivial code like getters, simple accessors, and auto-generated methods
- Focus testing effort on high-value areas: business logic, complex algorithms, edge cases, and integration points
- Diminishing returns kick in above 80% — remaining gaps are often boilerplate or defensive code

**Prioritize coverage by impact**
- **High priority**: Core business logic, calculations, validation, security checks, state management
- **Medium priority**: Error handling, edge cases, integration boundaries, public APIs
- **Lower priority**: Trivial accessors, scaffolding, auto-generated code, logging statements

**Use coverage reports strategically**
- View coverage as a diagnostic tool to find blind spots, not a performance metric to maximize
- Red flags: Entire functions or critical paths with no coverage
- Green light: 70%+ coverage with comprehensive tests on business logic
- Ignore: Pressure to hit arbitrary coverage numbers that encourage testing implementation details

## Troubleshooting Common Test Issues

**Tests pass locally but fail in CI**
- Environment differences: Check for hard-coded paths, timezone assumptions, OS-specific behavior
- Timing and race conditions: Add explicit waits or use test utilities designed for async code
- Dependency versions: Ensure lock files are committed and CI uses identical versions
- File system state: Verify tests clean up after themselves and don't depend on execution order
- Port conflicts: CI systems may have restrictions on which ports can be used

**Flaky tests (intermittent failures)**
- Race conditions: Look for unordered async operations or timing assumptions; use proper async/await patterns
- Shared state: Ensure test isolation — clean up data between tests, use fresh fixtures, reset mocks
- Non-deterministic data: Avoid random data, timestamps, or external service calls in tests; mock or fix seeds
- External dependencies: Mock third-party APIs, databases, and time-dependent functions
- Test order dependency: Tests should pass in any order; if order matters, fix the shared state issue

**Slow test suite**
- Parallelization: Run tests in parallel where possible; use framework flags like `--maxWorkers`
- Test isolation: Avoid unnecessary database operations or file I/O; use in-memory databases or mocks
- Reduce mock overhead: Don't mock everything; use real implementations for lightweight dependencies
- Batch operations: Group related tests to share expensive setup
- Profile slow tests: Identify the slowest tests and optimize them first (often data-heavy or slow I/O)

**Tests break after refactoring**
- Over-testing implementation: Tests checking private methods, internal structure, or specific implementation details are brittle
- Test behavior, not implementation: Tests should verify what code does, not how it does it
- Refactor tests with code: When you change how something works, update tests to match the new behavior
- Use public APIs: Test through public interfaces rather than internal details
- Consider snapshot tests carefully: Snapshots catch changes but can hide intentional refactorings

## Integration with Other Skills

- **testing-patterns**: For detailed Jest patterns, factory functions, mocking strategies, and TDD workflows — use testing-patterns
- **systematic-debugging**: When tests fail and you need to investigate root cause before fixing — use systematic-debugging
- **implementation-process**: Testing is part of every implementation step; this skill is called during Step 2 and Step 5 of implementation
