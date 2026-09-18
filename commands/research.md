# Research Phase

Deeply explore and understand the relevant part of the codebase before planning or implementing changes.

Arguments: $ARGUMENTS (the area/feature to research)

## Purpose

Research is the foundation of the Boris Cherny workflow: **Research → Plan → Implement → Verify → Commit**

Without deep understanding of the existing codebase, your plan will be wrong and your implementation will fail.

## What This Command Does

1. **Identifies the scope** of what needs to be researched based on $ARGUMENTS
2. **Launches research-agent** to deeply explore that area
3. **Writes findings to research.md** in the appropriate location
4. **Prompts you to review** the research before proceeding to planning

## Usage Examples

```
/research auth and session management
/research task scheduling flow and potential bugs
/research how we handle API errors
/research the database schema for users and projects
```

## Process

### Step 1: Clarify Scope

Based on $ARGUMENTS, determine:
- What specific files/modules need to be explored?
- What questions need to be answered?
- What decisions depend on this research?

If the scope is unclear, ask the user for clarification before proceeding.

### Step 2: Execute Research

Use the research-agent to explore deeply:

```
use the research-agent to deeply understand [$ARGUMENTS].

Read all relevant code thoroughly - not just signatures.
Understand the intricacies and details of how things work.
Look for potential bugs, edge cases, and risks.

Write a comprehensive report to research.md covering:
- Architecture overview
- Key components and how they work
- Integration points
- Current limitations
- Test coverage
- Any concerns or risks

Do not stop until you have a complete understanding.
```

### Step 3: Save Research

The research-agent will write findings to:
- `research.md` in the project root for general research
- `docs/wip/[feature]/research.md` if researching for a specific WIP feature

### Step 4: Review Prompt

After research completes, tell the user:

```
Research complete! Written to [file path].

Please review the research findings to ensure I understood correctly.
If anything looks wrong or incomplete, let me know and I'll dig deeper.

Once you approve the research, we can move to the planning phase.
```

## Important Guidelines

### Force Deep Reading

Use these phrases when invoking the research-agent:
- "deeply understand"
- "in great detail"
- "understand the intricacies"
- "read thoroughly"
- "don't stop until..."

Without these, Claude tends to skim function signatures instead of truly understanding the code.

### Research Should Be Persistent

The research.md file is your "surface of review" - you open it in your editor, verify Claude understood correctly, and correct misunderstandings BEFORE planning.

If research only stays in chat, it gets lost and Claude will make wrong assumptions.

### When Research is Too Large

If $ARGUMENTS covers too broad an area:
1. Break it down into smaller research tasks
2. Research incrementally
3. Ask the user to narrow the scope

## What Makes Good Research

**Good research includes:**
- Specific file:line references for everything
- Explanation of HOW things work, not just WHAT exists
- Identified risks, bugs, and edge cases
- Clear architecture diagrams (in markdown)
- Test coverage assessment
- Integration point mapping

**Poor research includes:**
- Just listing function names
- Making assumptions without reading code
- Missing edge cases and error paths
- No file references
- Vague descriptions

## Next Steps After Research

Once research is approved:
1. Move to planning phase (Plan Mode or plan.md)
2. Use research findings to create accurate implementation plan
3. Reference research.md throughout implementation

Remember: Research is NOT optional. It's the most important phase of any non-trivial task.
