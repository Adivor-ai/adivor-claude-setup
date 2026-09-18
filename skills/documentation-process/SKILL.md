---
name: documentation-process
description: Creates and updates project documentation after feature implementation or bug fixes. Updates architecture docs, testing docs, and writes ADRs for non-trivial decisions. Use after completing a feature, finishing a bug fix, when the user says 'document this', 'update the docs', 'write an ADR', 'update architecture docs', or when implementation changes should be recorded for other developers.
---

# Documentation Process

## Guidelines

1. After completing a new feature, always see if you need to update the Architecture documentation at `/docs/contributing/ARCHITECTURE.md` and Test documentation in `/docs/contributing/TESTING.md` for other developers, so anyone could easily pick up the work and understand the project and the feature that was added.
2. If the code change included prior decision-making out of several alternatives, document an ADR at `/docs/adr` for any non-trivial/non-obvious decisions that should be preserved.

## Documentation Types

Different types of documentation serve different purposes and should be created based on what needs to be communicated:

- **Architecture Documentation** (`/docs/contributing/ARCHITECTURE.md`): Provides a system-wide overview including component relationships, module organization, and data flow patterns. Update this when you add new major components, change how modules interact, or introduce new architectural patterns. Include diagrams showing how components communicate and where data moves through the system.

- **Testing Documentation** (`/docs/contributing/TESTING.md`): Explains how to run tests, describes the overall test strategy, documents common testing patterns used in the project, and includes troubleshooting tips for test failures. Update this when you introduce new test frameworks, add special test setup requirements, or establish new testing conventions.

- **Architecture Decision Records (ADRs)** (`/docs/adr/`): Capture non-trivial decisions that future developers need to understand. Include the context that made the decision necessary, the alternatives that were considered, the chosen solution, and the consequences of that choice. Use ADRs to prevent repeated debates about the same issues.

- **API Documentation**: Document endpoints with clear descriptions, include request and response examples, list all possible error codes, and explain authentication/authorization requirements. Keep this synchronized with implementation changes.

- **README Updates**: Maintain setup instructions, environment requirements, and quick start guides. These should be the first place developers look to understand how to get the project running locally.

## ADR Writing Guide

Architecture Decision Records are your primary tool for preserving important decisions. Follow these practices:

**Naming and Structure**: Use the format `NNNN-short-description.md` where NNNN is a sequential number. For example: `0001-use-postgres-for-persistence.md`.

**Required Sections**:
- **Status**: Mark as "Accepted", "Deprecated", "Superseded", or "Proposed"
- **Context**: Explain the issue or requirement that prompted this decision. What problem were we trying to solve?
- **Decision**: Clearly state what decision was made
- **Consequences**: Describe the positive and negative impacts of this choice

**Best Practices**: Write ADRs at the time you make the decision, not retroactively. This ensures the context and reasoning are fresh and complete. Include alternatives that were considered and briefly explain why each was rejected—this prevents future developers from reconsidering and re-rejecting the same options.

## Documentation Quality Checklist

Before considering documentation complete, verify:

- **Explains the "Why"**: Does it answer not just WHAT to do but WHY? Future developers need to understand the reasoning behind approaches.
- **New Developer Friendly**: Can someone new to the project follow the documentation without asking questions? If they get stuck, the docs aren't complete.
- **Code Examples**: Are examples up-to-date and actually runnable? Stale code examples confuse developers and erode trust in the docs.
- **Visual Aids**: For complex processes or architectures, are there diagrams? A flowchart or system diagram often communicates faster than paragraphs.
- **Proper Linking**: Is the documentation linked from relevant code comments, README sections, and other related docs? Discoverable documentation gets used; hidden documentation gets ignored.

## Troubleshooting Common Documentation Issues

**Docs Fall Out of Sync with Code**: The most common problem is documentation that drifts from reality. Prevent this by including documentation review as part of your PR checklist. When code changes materially affect documented behavior, review and update the relevant docs in the same PR.

**ADR Overload**: Too many ADRs makes them lose their value. Only document decisions that are non-obvious and have meaningful consequences. Minor implementation choices rarely need ADRs; obvious decisions definitely don't.

**Stale Documentation**: Add "Last Reviewed" dates to documentation and audit docs quarterly. Consider automating staleness checks in your CI/CD system to flag docs that haven't been touched in over a year. Out-of-date documentation is worse than no documentation because it actively misleads developers.

## Integration with Other Skills

- **analysis-process**: Design decisions made during analysis should be referenced when writing ADRs
- **implementation-process**: This skill is called at Step 5 of implementation to update docs after all tasks are complete
- **merge-docs**: When documentation exists in multiple versions, use merge-docs to consolidate before updating
