---
description: "Review the current session and update CLAUDE.md files with new patterns, fixes, and conventions discovered during work."
allowed-tools: ["Read", "Write", "Edit", "Bash"]
---

Review our current conversation and identify:

1. **New patterns established** — coding conventions, architectural decisions, or workflow patterns we followed consistently
2. **Bugs from missing rules** — any mistakes I made because CLAUDE.md didn't warn me (these become CRITICAL rules)
3. **Repeated commands** — commands we ran multiple times that should be documented
4. **Corrections you made** — places where you corrected my approach (reveals missing conventions)
5. **Domain terms clarified** — any terminology we had to explain or disambiguate

Then:
1. Run `bash .claude/scripts/claude-md-audit.sh` to check current CLAUDE.md health
2. Read the current CLAUDE.md and all files in `.claude/rules/`
3. Draft proposed changes as a clear before/after diff
4. Show me the changes and line count impact
5. Only write files after I approve

Rules for your updates:
- Every new line must prevent a real mistake. "Write clean code" = useless. "All API routes must use ApiError from src/lib/errors.ts" = useful.
- If a "Don't X" rule is needed, always include "Do Y instead"
- If root CLAUDE.md would exceed 100 lines after changes, propose splitting into .claude/rules/ files
- Never add rules Claude already follows by default
- Keep subdirectory CLAUDE.md files under 40 lines

$ARGUMENTS
