---
name: analysis-process
description: Turn the idea for a feature into a fully-formed PRD/design/specification and implementation plan. Use in pre-implementation stages to analyze specs and requirements before writing code. Trigger when the user says 'I have an idea', 'let's plan this feature', 'create a spec', 'write an implementation plan', 'analyze requirements', 'let's design this', or 'continue working on' a WIP feature. Do NOT use for actual code implementation (use implementation-process instead).
---

# Task Analysis Process

**Goal: Before writing any code, make sure you understand the requirements and have an implementation plan ready.**

## Ideas and Prototypes

_Use this for ideas that are not fully thought out and do not have a fully-formed design/specification and/or implementation-plan._

**For example:** I've got an idea I want to talk through with you before we proceed with the implementation.

**Your job:** Help me turn it into a fully formed design, spec, implementation plan, and task list.

See [idea-process.md](./references/idea-process.md).

## Continue WIP Feature

_Use this to resume work on a feature that already has design docs and a task list in `/docs/wip/`._

**For example:** Let's continue working on the auth system.

**Your job:** Review the current state of the feature, understand what's been done and what's next, then proceed with implementation.

See [existing-task-process.md](./references/existing-task-process.md).

## Integration with Other Skills

- **implementation-process**: After analysis is complete, hand off to implementation-process to execute the plan
- **merge-docs**: If two separate analysis runs produced competing designs for the same feature, use merge-docs to reconcile them into a single source of truth
- **cove**: For complex technical decisions during analysis, use CoVe to verify accuracy of technical claims

## Troubleshooting

### Requirements too vague to plan
**Issue**: Specifications are high-level and lack concrete details needed for implementation.
**Solution**: Ask probing questions to get specifics. Use user stories, acceptance criteria, and edge cases. Document assumptions and get sign-off before proceeding.

### Conflicting stakeholder requirements
**Issue**: Different stakeholders have different priorities or incompatible needs.
**Solution**: Document all requirements explicitly and surface conflicts to the user. Propose trade-offs with justification and let the user decide on priorities.

### Scope creep during analysis
**Issue**: New features or edge cases keep being added, analysis never finishes.
**Solution**: Lock the scope upfront. Treat new requests as follow-up features. Create a backlog for future work and focus on delivering the core analysis.

### Analysis paralysis (overthinking before implementing)
**Issue**: Endless refinement of design without moving forward to implementation.
**Solution**: Set a completion threshold (design + implementation plan = done), then hand off to implementation-process. Iterate on design based on real implementation learnings, not hypothetical scenarios.
