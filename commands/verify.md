# Verify Application

Execute comprehensive verification of the application to ensure recent changes work correctly.

This command implements Boris Cherny's #1 tip: **"Give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result."**

## What This Command Does

Launches the verify-app agent to perform end-to-end verification:
- ✅ Build verification
- ✅ Test suite execution
- ✅ Type checking
- ✅ Linting (critical issues only)
- ✅ Runtime verification
- ✅ Smoke tests of recent changes

## Usage

```
/verify
```

Simple as that. The agent will execute all verification steps and report back with a structured assessment.

## When to Use This Command

**Use after:**
- Implementing a feature
- Fixing a bug
- Making any non-trivial code changes
- Before creating a pull request
- After merging changes from another branch

**Don't use for:**
- Trivial typo fixes
- Documentation-only changes
- When you just ran all the checks manually

## Process

### Step 1: Launch Verification Agent

```
use the verify-app agent to verify the application end-to-end.

Focus on verifying that recent changes work correctly.
Test the main user flows and any areas touched by recent changes.
Provide a structured report of all findings.
```

### Step 2: Review Report

The agent will provide a structured report with:
- Build status
- Test results (with failure details if any)
- Type check results
- Lint results (critical issues only)
- Runtime status
- Smoke test results
- Overall summary and next steps

### Step 3: Take Action Based on Results

**If all checks pass (✅ READY):**
- Proceed with confidence
- Create PR or continue to next task
- Mark current task as verified

**If there are warnings (⚠️ WARNINGS):**
- Review the warnings
- Fix if critical, defer if minor
- Document known warnings if acceptable

**If checks fail (❌ BLOCKED):**
- Fix the failing tests/checks immediately
- Don't proceed until verification passes
- Investigate root cause, don't just patch symptoms

## Verification Scope

The verify-app agent focuses on:

1. **Build:** Ensure code compiles/builds without errors
2. **Tests:** Run all tests, report failures with context
3. **Types:** Check for type errors
4. **Lint:** Critical issues only (not style nitpicks)
5. **Runtime:** Verify app starts and runs without crashes
6. **Smoke Tests:** Test the specific functionality that was changed

## Customizing Verification

To customize verification for your project, edit `.claude/agents/verify-app.md` to:
- Add project-specific verification steps
- Change which commands are run
- Adjust what constitutes a pass/fail
- Add domain-specific checks (database migrations, API contracts, etc.)

## Integration with Other Commands

This command integrates with the workflow:
1. **/research** - Understand the codebase
2. **Plan Mode** - Create implementation plan
3. **Implement** - Write the code
4. **/verify** - Verify it works ← **YOU ARE HERE**
5. **/commit-push-pr** - Ship it

## Pro Tips

- Run `/verify` frequently during development, not just at the end
- If verification keeps failing, stop and re-plan instead of hacking fixes
- Add tests BEFORE implementing features so verification catches regressions
- Trust the verification - if it passes, the code is likely solid

## Why This Matters

From Boris Cherny:
> "Give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result."

Without verification:
- ❌ Claude makes changes blindly
- ❌ Bugs slip through
- ❌ Tests break silently
- ❌ Type errors accumulate

With verification:
- ✅ Claude knows immediately if changes work
- ✅ Bugs caught early
- ✅ Tests enforced
- ✅ Quality maintained

This is the difference between hoping code works and knowing it works.
