# Tech Debt Cleanup

Run at the end of a session to find and eliminate duplication, identify tech debt, and improve code quality.

## Purpose

This command helps maintain code quality by:
- Finding duplicated code across the codebase
- Identifying accumulated tech debt
- Suggesting consolidation opportunities
- Tracking items that can't be fixed immediately

## When to Run

**Ideal times:**
- End of a coding session
- After completing a feature
- End of sprint
- Before starting a major refactor
- When you notice code quality degrading

**Don't run:**
- In the middle of active development
- When under tight deadlines (document debt instead)
- For codebases you don't have time to improve

## What This Command Does

### Step 1: Scan for Duplication

Search the codebase for:
- Duplicated functions/methods
- Copy-pasted code blocks
- Similar patterns that could be unified
- Repeated logic across multiple files

### Step 2: Identify Tech Debt

Look for:
- TODOs and FIXMEs in code
- Overly complex functions
- Missing tests
- Deprecated patterns
- Hard-coded values that should be configurable
- Documentation gaps

### Step 3: Prioritize Issues

Categorize findings:
- **🔴 Critical:** Actively causing bugs or blocking work
- **🟡 High:** Should be addressed soon
- **🟢 Medium:** Improve when convenient
- **⚪ Low:** Nice to have

### Step 4: Generate Report

Create or update `docs/tech-debt.md`:

```markdown
# Technical Debt

Last updated: [date]

## Critical (🔴)
[Items that need immediate attention]

## High Priority (🟡)
[Items to address in next sprint]

## Medium Priority (🟢)
[Items to improve when convenient]

## Low Priority (⚪)
[Nice to have improvements]

## Completed
[Track resolved tech debt]
```

### Step 5: Quick Wins

If there are simple fixes that take <5 minutes:
- Fix them immediately
- Run /verify to ensure nothing broke
- Commit the improvements

For everything else, document in tech-debt.md.

## Usage

```
/techdebt
```

Optionally, scan specific areas:
```
/techdebt src/auth
/techdebt components/
```

## Process

### Quick Scan Mode (Default)

```
Scan the codebase for duplication and tech debt.

Focus on:
- Recently changed files (from git log)
- Areas with known issues
- Common patterns across the codebase

Create or update docs/tech-debt.md with findings.
Categorize by priority: Critical, High, Medium, Low.

For any quick wins (fixes < 5min), list them separately.
```

### Deep Scan Mode

For more comprehensive analysis:

```
/techdebt --deep
```

This runs a thorough scan of the entire codebase, which may take longer but finds more issues.

## What to Look For

### Duplication
- Identical or near-identical functions
- Copy-pasted code blocks
- Similar patterns that could be abstracted

### Code Smells
- Functions >50 lines
- Files >500 lines
- Deep nesting (>3 levels)
- Cyclomatic complexity >10
- God objects/classes

### Missing Quality
- Functions without tests
- Public APIs without documentation
- Error paths without handling
- Hard-coded magic values

### Outdated Patterns
- Deprecated library usage
- Old syntax when modern alternatives exist
- Inconsistent patterns within the codebase

## Taking Action

After the report is generated:

**For Critical Items:**
```
These critical issues were found:
[List critical items]

Should I:
1. Fix them now
2. Create tasks in docs/wip/ for addressing them
3. Create GitHub issues
```

**For Quick Wins:**
```
Found X quick fixes that take <5 minutes each:
[List quick wins]

Should I apply these now? (yes/no)
```

**For Everything Else:**
Document in tech-debt.md for future sessions.

## Integration with Other Commands

Tech debt cleanup works with:
- **/simplify** - for code quality improvements
- **/verify** - to ensure fixes don't break anything
- **analysis-process** - to plan larger debt paydown efforts
- **/commit-push-pr** - to ship the improvements

## Tracking Progress

The tech-debt.md file should be treated as a living document:
- Add new items as you discover them
- Move completed items to "Completed" section
- Review regularly in team meetings
- Prioritize based on impact and effort

## Configuration

Customize what's considered tech debt in CLAUDE.md:

```markdown
## Tech Debt Criteria

- Functions >50 lines (except main/complex algorithms)
- Files >300 lines (except generated code)
- Test coverage <80%
- TODO comments >6 months old
- Dependencies >1 year outdated
```

## Important Notes

- Don't let perfect be the enemy of good - document what you can't fix now
- Some tech debt is acceptable - prioritize what matters
- Always run /verify after fixing tech debt
- Group related fixes into coherent commits
- Tech debt is an investment, not a distraction

## Example Output

```
Tech Debt Scan Complete

Found:
- 3 critical issues
- 12 high priority items
- 25 medium priority items
- 8 quick wins (< 5min each)

Quick Wins:
1. Remove unused import in UserService.ts
2. Extract duplicated validation logic in auth/
3. Add missing error handling in fetchUser()
...

Critical Issues:
1. [FILE:LINE] Race condition in session management
2. [FILE:LINE] Unhandled promise rejection in payment flow
3. [FILE:LINE] SQL injection vulnerability in search

Full report written to: docs/tech-debt.md

Would you like me to:
1. Fix the quick wins now
2. Create tasks for critical issues
3. Do both
```

## Remember

> "Run /techdebt at the end of each session to find and eliminate duplication"
> -- Boris Cherny

Regular tech debt cleanup is how you prevent codebases from becoming unmaintainable. Small, consistent improvements compound over time.
