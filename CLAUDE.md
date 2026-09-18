# Global Claude Code Instructions

Optimize for shipping working software fast with clean, maintainable code. The fewer lines the better.

## Think Before Coding
- State assumptions explicitly. If multiple interpretations exist, present them — don't pick silently.
- Write 2–3 reasoning paragraphs before coding complex tasks. Start with uncertainty; build confidence through analysis.
- For complex decisions: argue both sides equally, then state which is better and why.
- When stuck, name what's missing — don't guess.
- When uncertain about intent, ask ONE clarifying question before proceeding.

## Simplicity First
- Implement the minimum that fully solves the problem. Every line is a liability.
- No features, abstractions, or configurability beyond what was asked.
- If you write 200 lines and it could be 50, rewrite it.
- Files stay under 200 lines. Break complex tasks into only the truly necessary steps.
- Write code a junior developer could read. Prefer small pure functions over deep class hierarchies.
- Early returns over nesting. All async ops need proper error handling — never silently swallow errors.
- Use the strictest type system available. Avoid escape hatches (`any`, untyped casts) without a comment explaining why.

## Surgical Changes
- Read surrounding code first. Match existing patterns and conventions.
- Touch only what you must. Don't "improve" adjacent code, formatting, or comments.
- Every changed line should trace directly to the request.
- If YOUR changes create unused imports/variables/functions, remove them.
- If you notice unrelated dead code, mention it — don't delete it.
- If a file has a local `CLAUDE.md` or `.claude/rules/`, those override this file.

## Goal-Driven Execution
Transform vague tasks into verifiable goals:
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan upfront:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```
After completing a task: state what changed and how to verify — nothing more.

## Comments & Documentation
- Comments explain WHY, not what. Document business rules, non-obvious decisions, complex logic.
- Never delete existing comments unless obviously wrong or obsolete.

## Testing
- Write tests alongside implementation — not after. Run the suite before calling anything done.
- Test behavior and outcomes, not implementation details. Cover edge cases.
- Use factory patterns for test data. Tell the user exactly how to verify the implementation works.

## Security Defaults
- Validate and sanitize all user inputs at API boundaries.
- Parameterized queries only — never string-concatenate SQL.
- Never hardcode secrets. Use environment variables.
- Principle of least privilege for DB roles and API scopes.

## Git
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`). One logical change per commit.
- Never commit `.env`, secrets, or credentials.

## Debugging
- Explore ALL possibilities before narrowing down — don't anchor on the first theory.
- Summarize current state with facts only. For strange errors, suggest searching before guessing.

## CLAUDE.md Maintenance
- When you discover a project-specific pattern or gotcha, suggest adding it to the project's CLAUDE.md.
- Keep all CLAUDE.md files under 100 lines. If growing beyond that, split into `.claude/rules/`.