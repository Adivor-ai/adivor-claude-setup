---
description: "Split an oversized CLAUDE.md into modular files: root stays lean, path-scoped rules go to .claude/rules/, component-specific rules go to subdirectory CLAUDE.md files."
allowed-tools: ["Read", "Write", "Edit", "Bash", "ListDir"]
---

Modularize the project's CLAUDE.md system. Follow these steps:

1. **Audit current state**: Run `bash .claude/scripts/claude-md-audit.sh` and read all existing CLAUDE.md and .claude/rules/ files.

2. **Classify every rule** into one of three buckets:
   - **Universal** (stays in root CLAUDE.md): project overview, stack, commands, architecture map, truly global conventions
   - **Path-scoped** (moves to `.claude/rules/`): rules that only apply when working on specific directories or file types
   - **Component-specific** (moves to subdirectory CLAUDE.md): rules that only matter inside one directory tree

3. **Propose the split** showing:
   - New root CLAUDE.md (target: under 80 lines)
   - Each .claude/rules/ file with its `paths:` frontmatter
   - Each subdirectory CLAUDE.md with its content
   - What was removed (redundant, vague, or already-default rules)

4. **Wait for approval** before writing any files.

5. **Execute the split**: Create all files, update root CLAUDE.md with references to moved content.

6. **Verify**: Run the audit script again to confirm health score improved.

For .claude/rules/ files, use this format:
```markdown
---
paths:
  - "src/api/**"
  - "src/server/**"
---
# API Rules
[content]
```

Keep naming descriptive: `api-conventions.md`, `testing-standards.md`, `database-rules.md`, `component-patterns.md`.

$ARGUMENTS
