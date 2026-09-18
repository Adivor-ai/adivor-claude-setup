# Memory (Engram)

You have access to Engram persistent memory via MCP tools: `mem_save`, `mem_search`, `mem_context`, `mem_session_summary`, `mem_timeline`, `mem_stats`, `mem_update`, `mem_delete`, and others.

## When to save (use `mem_save` proactively — don't wait to be asked)

- After fixing a bug — save what broke, why, and the fix
- After architectural or design decisions — save the rationale
- After discovering non-obvious patterns, gotchas, or constraints
- After config changes, setup steps, or environment quirks
- Before ending a session — always call `mem_session_summary`

**Format for `mem_save`**: title, type, and always include What / Why / Where / Learned.

## When to search (use `mem_search`)

- When the user says "remember", "recall", "like last time", "we did this before"
- Proactively at the start of work that might overlap with past sessions in this project
- Before making decisions that might have precedent

## After compaction or context reset

Call `mem_context` **immediately** to recover session state before continuing any work. This is non-negotiable — without it, you'll repeat work or contradict previous decisions.

## Project scope

Memories are auto-associated with the current working directory. Launch Claude Code from the repo root so memories group correctly under one project.
