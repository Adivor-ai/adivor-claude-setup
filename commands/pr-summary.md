---
description: Generate a structured PR summary using Conventional Commits and best practices. Optionally accepts a PR type as argument.
allowed-tools: Bash(git:*), Bash(wc:*), Bash(grep:*), Bash(cat:*), Bash(head:*), Bash(tail:*)
argument-hint: [feat|fix|refactor|docs|chore|perf|test|ci]
---

# PR Summary Generator

Generate a professional pull request summary for the current branch, following Conventional Commits and industry best practices.

## Step 1: Gather context

Run these commands to understand the full scope of changes:

```bash
# Detect the default branch (main, master, develop, etc.)
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main"
```

```bash
# Commit log since branching off (one-line summaries)
git log $(git merge-base HEAD origin/main)..HEAD --oneline --no-merges
```

```bash
# Diff stats: files changed, insertions, deletions
git diff $(git merge-base HEAD origin/main)..HEAD --stat
```

```bash
# Total lines changed (to assess PR size)
git diff $(git merge-base HEAD origin/main)..HEAD --shortstat
```

```bash
# Detect if any test files were added or modified
git diff $(git merge-base HEAD origin/main)..HEAD --name-only | grep -iE '(test|spec|__tests__)' || echo "NO_TESTS_CHANGED"
```

```bash
# Detect migration or schema changes
git diff $(git merge-base HEAD origin/main)..HEAD --name-only | grep -iE '(migration|schema|\.sql)' || echo "NO_MIGRATIONS"
```

```bash
# Detect env/config changes
git diff $(git merge-base HEAD origin/main)..HEAD --name-only | grep -iE '(\.env|config|docker)' || echo "NO_CONFIG_CHANGES"
```

```bash
# Current branch name (useful for inferring type and scope)
git branch --show-current
```

## Step 2: Analyze and classify

Based on the gathered data, determine:

1. **PR Type**: Use $ARGUMENTS if provided, otherwise infer from commits and branch name:
   - `feat` — new functionality
   - `fix` — bug correction
   - `refactor` — code restructuring without behavior change
   - `docs` — documentation only
   - `chore` — maintenance, dependencies, tooling
   - `perf` — performance improvement
   - `test` — adding or updating tests
   - `ci` — CI/CD pipeline changes
   - `style` — formatting, whitespace, linting

2. **Scope**: Infer from the directories/modules most affected (e.g., `auth`, `api`, `ui`, `db`).

3. **PR Size Assessment**:
   - **XS**: < 50 lines → label as `size: XS`
   - **S**: 50–100 lines → label as `size: S`
   - **M**: 100–250 lines → label as `size: M`
   - **L**: 250–500 lines → label as `size: L`
   - **XL**: > 500 lines → label as `size: XL` and add a warning

4. **Breaking changes**: Look for removed/renamed public APIs, changed function signatures, removed config keys, DB schema drops.

5. **Deploy considerations**: Flag if there are migrations, new env vars, config changes, or feature flags needed.

## Step 3: Generate the PR title

Format: `<type>(<scope>): <imperative summary under 50 chars>`

Examples:
- `feat(auth): add OAuth2 login with Google`
- `fix(cart): resolve race condition on quantity update`
- `refactor(api): extract validation middleware`

## Step 4: Generate the PR body

Use this exact structure. Omit sections that don't apply (e.g., skip "Screenshots" if no UI changes, skip "Breaking Changes" if there are none). Do NOT leave empty sections.

```markdown
## Description

<!-- 1-3 sentences: what changed and WHY, not just what files were touched -->

Closes #<!-- issue number if detectable from commits/branch -->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Test coverage improvement
- [ ] CI/CD or build change

## Changes Made

<!-- Group by logical unit, not by file. Use imperative tense. -->

- 
- 
- 

## Testing

<!-- Describe what was tested and how. Be specific about environments or edge cases. -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed (describe steps below)
- [ ] No tests needed (explain why)

**Test details:**


## Deploy Considerations

<!-- Only include if applicable: migrations, env vars, feature flags, infra changes -->

- [ ] Requires database migration
- [ ] Requires new environment variable(s): `VAR_NAME`
- [ ] Requires feature flag
- [ ] No special deploy steps needed

## Screenshots / Demo

<!-- Only for UI changes. Use before/after table format: -->
<!-- | Before | After | -->
<!-- |--------|-------| -->
<!-- | img    | img   | -->

## Breaking Changes

<!-- Only if applicable. Describe what breaks and how consumers should migrate. -->

## Checklist

- [ ] Self-review completed
- [ ] Code follows project style conventions
- [ ] Documentation updated (if applicable)
- [ ] Tests cover the changes adequately
- [ ] No new warnings introduced
- [ ] PR is focused and under 250 lines (or justified if larger)
```

## Step 5: Output and warnings

1. **Print the suggested PR title** first, clearly labeled.
2. **Print the PR body** with all applicable sections filled in based on the actual diff analysis.
3. **Add warnings** at the end if:
   - PR is **XL** (> 500 lines): suggest splitting into smaller PRs
   - PR is **L** (> 250 lines): recommend reviewing if it can be split
   - Test files were NOT changed alongside source code changes: flag missing test coverage
   - Commit messages are inconsistent or vague: suggest improving them before merge

## Important rules

- **Be specific**: Reference actual file names, function names, and modules from the diff. Don't be generic.
- **Use imperative tense**: "Add", "Fix", "Remove" — not "Added", "Fixes", "Removed".
- **Skip empty sections**: If there are no breaking changes, don't include that section at all.
- **Infer issue numbers**: Check commit messages for patterns like `#123`, `fixes #`, `closes #`, `JIRA-123`.
- **Respect the diff**: Only describe changes that actually exist in the diff. Don't hallucinate features.
