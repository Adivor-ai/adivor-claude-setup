# Commit, Push, and Create Pull Request

Execute the complete git workflow: commit changes, push to remote, and create a pull request.

## Process

### 1. Pre-compute Git Status (for speed)

Run these commands in parallel to gather context:

```bash
git status --porcelain
git diff --cached
git diff
git log -5 --oneline
git branch --show-current
```

### 2. Review Changes

Analyze all staged and unstaged changes:
- Understand what was modified
- Ensure changes are cohesive and related
- Check for any accidental inclusions (secrets, temp files, etc.)
- Verify no obvious bugs in the diff

### 3. Stage All Relevant Changes

Add all files that should be committed:

```bash
git add [relevant files]
```

**Important:** Don't commit files that likely contain secrets (.env, credentials.json, etc.). Warn the user if detected.

### 4. Generate Commit Message

Based on the diff and recent commit history, draft a commit message that:
- Summarizes the nature of changes (new feature, enhancement, bug fix, refactor, docs, etc.)
- Uses imperative mood (e.g., "Add", "Fix", "Update", not "Added" or "Adding")
- Is concise (1-2 sentences) focusing on WHY, not just WHAT
- Follows the repository's commit message style (check git log for patterns)
- Ends with the attribution footer

**Commit Message Format:**
```
[Summary line - imperative mood, <72 chars]

[Optional: More detailed explanation if needed]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 5. Create Commit

Use a HEREDOC for proper formatting:

```bash
git commit -m "$(cat <<'EOF'
[Your commit message here]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 6. Push to Remote

Check if the branch has a remote tracking branch:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "no-upstream"
```

If no upstream exists, push with `-u` flag:
```bash
git push -u origin [current-branch]
```

Otherwise, just push:
```bash
git push
```

### 7. Create Pull Request

Use `gh pr create` to create the PR:

```bash
gh pr create --title "[PR Title]" --body "$(cat <<'EOF'
## Summary
[1-3 bullet points describing changes]

## Changes
[List of key changes]

## Testing
[How to test these changes]

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated if needed
- [ ] No breaking changes (or documented if unavoidable)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

The PR title should:
- Be descriptive and concise
- Follow project conventions (check existing PRs if unsure)
- Start with a type prefix if the project uses them (feat:, fix:, etc.)

The PR body should:
- Provide context for reviewers
- Explain WHY the changes were made
- Include testing instructions
- Note any risks or breaking changes

### 8. Verify and Report

After PR creation:

```bash
git status
```

Report back to the user:
- Commit hash
- Files changed
- PR URL
- Any warnings or issues

## Important Notes

- **Never skip hooks** (--no-verify) unless explicitly requested
- **Never force push to main/master** - warn the user if attempted
- **Check authorship** before amending commits
- **Don't commit empty changes** - verify there are actual changes first
- **Follow CLAUDE.md conventions** for commit format and PR structure

## Error Handling

If pre-commit hooks modify files:
1. Check if it's safe to amend (not already pushed, authored by Claude)
2. If safe: amend the commit with hook changes
3. If not safe: create a new commit with the hook changes

If PR creation fails:
- Check if `gh` CLI is installed and authenticated
- Verify the remote repository supports GitHub
- Fall back to manual instructions if `gh` is unavailable

## Safety Checks

Before executing, verify:
- ✅ No secrets or sensitive files in the changes
- ✅ No obviously broken code in the diff
- ✅ Commit message accurately describes the changes
- ✅ PR is targeting the correct base branch
- ✅ All tests pass (if required by project conventions)
