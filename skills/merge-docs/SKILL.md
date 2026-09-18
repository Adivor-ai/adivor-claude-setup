---
name: merge-docs
description: Semantically compare and merge two design docs for the same feature into one unified document. Use when you have two competing or complementary design/implementation docs (e.g., from separate analysis-process runs) and need to reconcile them into a single source of truth.
---

# Merge Design Documents

**Goal: Produce a single, unified set of feature docs from two separate designs for the same feature.**

## When to Use

You have two feature directories under `/docs/wip/` for the same feature — each with its own design, implementation plan, and task list — and you need to combine them into one coherent set of docs.

## Merge Strategy

Merge design documents by treating them as collections of discrete decisions and requirements, not as monolithic wholes. This approach preserves architectural quality while capturing complementary insights.

**Section-by-Section Comparison**

Compare both designs systematically, working through logical sections (architecture, API, data flow, error handling, etc.) rather than attempting a line-by-line diff. For each section, identify whether the approaches conflict or complement:

- **Conflicts**: Contradicting architectural decisions or implementation approaches. For example, one design proposes a queue-based system while the other proposes synchronous processing.
- **Complements**: Additive ideas that enhance rather than contradict. One design might detail API contracts while the other focuses on data modeling — these can coexist.

**Evaluating Conflicts**

When conflicts arise, do not arbitrarily choose one design over the other. Instead:
1. Understand the trade-offs each approach makes (performance vs. simplicity, scalability vs. development speed, etc.)
2. Evaluate which trade-offs align better with stated project goals and constraints
3. Document your choice with justification — why is the selected approach stronger for this context?
4. Note what the rejected approach provided; sometimes a hybrid solution emerges from understanding both

**Integrating Complements**

When ideas complement each other, merge them into a unified narrative. If one design has thorough API specifications and the other has detailed error handling strategies, both belong in the final design. Ensure the merged result is internally consistent and traces clear connections between related sections.

**Preserving Quality Decisions**

Both designs should be approached as sources of good thinking. The merge process should identify and preserve the strongest architectural decisions from each source, resulting in a final document that exceeds what either individual design could offer alone.

## Merge Checklist

Use this checklist to verify the merge is complete and coherent:

- [ ] **All requirements accounted for**: Every requirement stated in either design appears in the merged design, either directly or synthesized with complementary requirements
- [ ] **Conflicts resolved**: No contradicting decisions remain unresolved; each conflict has a documented rationale
- [ ] **Implementation coverage**: The merged implementation plan includes all tasks from both sources; no planned work is omitted
- [ ] **Dependencies updated**: Task dependencies reflect the combined scope; if Design A has tasks 1→2→3 and Design B has tasks A→B→C, verify the merged plan correctly orders all six tasks
- [ ] **Internal consistency**: The merged design reads as a cohesive whole; language, terminology, and decisions are consistent throughout
- [ ] **No redundancy**: Duplicate sections or tasks are consolidated; the document avoids repeating the same concept under different names
- [ ] **Scope clarity**: The reader can distinguish between "must have," "nice to have," and "out of scope" requirements without ambiguity

## Troubleshooting

**Irreconcilable Conflicts Between Designs**

Some conflicts cannot be resolved by analyzing trade-offs — they represent fundamentally different visions (e.g., "build as microservices" vs. "build as a monolith"). When this happens, escalate to the original stakeholder or product owner for a decision on the final direction. Document the conflict clearly so the decision-maker understands what is being chosen.

**Missing Context in One Design**

A design may be incomplete or vague in areas where another design is clear. Before dismissing the incomplete design, investigate:
- Check git history for earlier drafts, commits, or discussions that explain the gap
- If available, ask the original author why certain sections are sparse
- Sometimes vagueness reflects uncertainty that should be resolved through further research, not merged over

**Overlapping Task Lists with Different Granularity**

Design A might break work into 20 small tasks while Design B uses 8 larger epic-sized tasks. When merging, normalize to a consistent level of detail. A good rule: tasks should be roughly 1-3 days of work for one engineer. Breaking everything into 1-hour tasks creates noise; grouping everything into 2-week epics loses clarity.

**Merged Document Exceeds Reasonable Length**

If the merged design exceeds ~8,000 words (or becomes difficult to navigate), split it into separate files:
- `design.md`: High-level architecture, key decisions, and design rationale (~3,000 words)
- `implementation.md`: Detailed implementation steps, API specs, and technical how-to (~3,000 words)
- `tasks.md`: The complete task list with dependencies, estimates, and assignments

This structure keeps any single document readable while preserving the complete merged knowledge.

## Workflow

See [merge-process.md](./references/merge-process.md).
