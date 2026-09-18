# Simplify Code

Launch parallel agents to review recent changes and identify opportunities to improve code quality through simplification.

## Purpose

After implementing features, code often has duplication, complexity, or missed opportunities for simplification. This command runs quality improvement agents to find and fix these issues.

## What This Command Does

Launches the code-simplifier agent (and potentially other quality agents) in parallel to:
- Find duplicated logic
- Identify overly complex conditionals
- Spot missing error handling
- Suggest simpler implementations
- Detect code smells

## Usage

```
/simplify
```

Optionally, specify what to simplify:
```
/simplify [file or area]
```

Examples:
```
/simplify
/simplify src/auth
/simplify src/components/UserProfile.tsx
```

## Process

### Step 1: Identify Scope

Determine what needs simplification:
- If no argument: simplify recently changed files (from git status/diff)
- If argument provided: simplify the specified files/area

### Step 2: Launch Simplifier Agent

```
use the code-simplifier agent to review [scope].

Look for:
- Duplicated logic that could be extracted
- Complex conditionals that could be simplified
- Missing error handling
- Code smells and opportunities to improve

Provide concrete, actionable suggestions with priority levels.
Focus on the MOST IMPACTFUL simplifications first.
```

### Step 3: Review Suggestions

The agent provides a prioritized list of suggestions with:
- Current code
- Improved version
- Explanation of benefits
- Priority level (🔴 High / 🟡 Medium / 🟢 Low)

### Step 4: Apply Improvements

Review the suggestions with the user:

```
Code Simplification Report ready!

Found X simplification opportunities (X high, X medium, X low priority).

High priority items:
[List the high priority items]

Would you like me to:
1. Apply all high-priority improvements
2. Apply specific improvements
3. Skip for now and track as tech debt

Let me know how you'd like to proceed.
```

### Step 5: Execute Based on User Choice

**Option 1 - Apply all high-priority:**
- Implement all high-priority suggestions
- Run /verify to ensure nothing broke
- Commit the simplifications

**Option 2 - Apply specific:**
- User picks which items to apply
- Implement those specific changes
- Run /verify
- Commit

**Option 3 - Track as tech debt:**
- Add items to a tech-debt.md file
- Don't make changes now
- Can be addressed later with /techdebt command

## When to Use This Command

**Good times to run /simplify:**
- After implementing a feature
- After a code review identified complexity
- Before creating a pull request
- At the end of a sprint
- When you notice code getting messy

**Don't use when:**
- Code is already simple and clean
- You're in the middle of debugging
- You're under time pressure (defer to tech debt)

## Principles of Simplification

The code-simplifier agent follows these principles:

1. **Fewer lines is better** - if it can be simpler, make it simpler
2. **Clarity over cleverness** - optimize for maintainability
3. **Extract duplication** - DRY principle
4. **Flatten complexity** - reduce nesting
5. **Consistent patterns** - follow existing codebase conventions

## Important Notes

- Simplification should NEVER change behavior
- Always run /verify after applying simplifications
- Focus on impactful changes, not style nitpicks
- Keep changes separate from feature commits
- If unsure, ask before applying

## Integration with Workflow

This command fits into the broader workflow:

1. Implement feature
2. /verify it works
3. /simplify to improve quality ← **YOU ARE HERE**
4. /verify again after simplifications
5. /commit-push-pr to ship it

## Running Multiple Agents in Parallel

For deeper quality analysis, you can run multiple agents:

```
use subagents to review the code in parallel:
- code-simplifier agent for simplification opportunities
- security review for potential vulnerabilities
- performance review for bottlenecks

Report findings from all agents together.
```

This is Boris Cherny's recommended approach for comprehensive quality improvement.

## Configuration

To customize what the simplifier looks for, edit:
`.claude/agents/code-simplifier.md`

You can adjust:
- What constitutes "too complex"
- Which code smells to detect
- Priority thresholds
- Language-specific patterns

## Remember

From the Boris method:
> "The fewer lines of code the better - optimize for simplicity and elegance."

Simplification isn't optional - it's how you keep codebases maintainable as they grow.
