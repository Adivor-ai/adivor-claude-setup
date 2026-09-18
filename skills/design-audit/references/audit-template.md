# Audit Output Template

Use this exact structure when presenting audit findings. No deviations. Every finding must
be actionable, measurable, and reference design system tokens.

---

## Score Card (Present First)

```
DESIGN AUDIT — SCORE CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Assessment: [1–2 sentences on the current state of the design]
Premium Readiness:  [x/5] — [one phrase: e.g., "Functional but unrefined"]

Dimension Scores (1–5):
  Visual Hierarchy .... [x]    Spacing & Rhythm ..... [x]
  Typography .......... [x]    Color System ......... [x]
  Contrast/A11y ....... [x]    Alignment & Grid ..... [x]
  Component States .... [x]    Iconography .......... [x]
  Shadows/Elevation ... [x]    Motion/Transitions ... [x]
  Empty States ........ [x]    Loading States ....... [x]
  Error States ........ [x]    Dark Mode ............ [x]
  Density/Reduction ... [x]    Responsiveness ....... [x]
  Surface/Texture ..... [x]    Brand Coherence ...... [x]

Findings: [x] total — [x] S4-Critical, [x] S3-Major, [x] S2-Minor, [x] S1-Cosmetic
Estimated effort: Phase 1 [x days], Phase 2 [x days], Phase 3 [x days]
```

---

## Phase Structure

```
DESIGN AUDIT RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1 — Critical (Ship in 1–2 weeks)
Visual hierarchy, usability, responsiveness, or consistency issues that actively hurt UX.
These cause user confusion, accessibility failures, or broken trust.

[S4] [Screen/Component]: [Current state with exact values]
     → [Target state with exact token references]
     → [Why: design principle, UX research, or measurable impact]
     → IMPL: [file] [component] [property]: [old value] → [new value] ([token name])

[S4] [Screen/Component]: [Current state with exact values]
     → [Target state with exact token references]
     → [Why: design principle, UX research, or measurable impact]
     → IMPL: [file] [component] [property]: [old value] → [new value] ([token name])

[S3] [Screen/Component]: [Current state with exact values]
     → [Target state with exact token references]
     → [Why: design principle, UX research, or measurable impact]
     → IMPL: [file] [component] [property]: [old value] → [new value] ([token name])

Phase 1 Rationale: [Why these are highest priority. What breaks if unfixed.]
Phase 1 Verification: [How to confirm fixes — contrast ratio checks, viewport tests, etc.]

────────────────────────────────────────────

PHASE 2 — Refinement (Ship in 2–6 weeks)
Spacing, typography, color, alignment, iconography that elevate from functional to professional.
These don't break anything, but they separate amateur from premium.

[S3] [Screen/Component]: [Current state with exact values]
     → [Target state with exact token references]
     → [Why: design principle, UX research, or measurable impact]
     → IMPL: [file] [component] [property]: [old value] → [new value] ([token name])

[S2] [Screen/Component]: [Current state with exact values]
     → [Target state with exact token references]
     → [Why: design principle, UX research, or measurable impact]
     → IMPL: [file] [component] [property]: [old value] → [new value] ([token name])

Phase 2 Rationale: [Why this sequencing. Dependencies on Phase 1 changes.]
Phase 2 Verification: [Consistency checks, spacing compliance, type scale adherence]

────────────────────────────────────────────

PHASE 3 — Polish (Ship in 1–3 months)
Micro-interactions, transitions, empty/loading/error states, dark mode, shadow refinement,
texture. Already functional — not yet premium. This is what makes users say "this app feels
different."

[S2] [Screen/Component]: [Current state with exact values]
     → [Target state with exact token references]
     → [Why: design principle, UX research, or measurable impact]
     → IMPL: [file] [component] [property]: [old value] → [new value] ([token name])

[S1] [Screen/Component]: [Current state with exact values]
     → [Target state with exact token references]
     → [Why: design principle, UX research, or measurable impact]
     → IMPL: [file] [component] [property]: [old value] → [new value] ([token name])

Phase 3 Rationale: [Why these are Phase 3. Expected cumulative impact on perceived quality.]
Phase 3 Verification: [Animation timing checks, state coverage audit, dark mode visual review]
```

---

## Design System Updates

```
DESIGN_SYSTEM UPDATES REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
These must be approved and added to DESIGN_SYSTEM before implementation begins.
Phase implementation depends on these tokens existing.

NEW TOKENS:
  [token-name]: [value] — [rationale for addition]
  [token-name]: [value] — [rationale for addition]

MODIFIED TOKENS:
  [token-name]: [old value] → [new value] — [rationale for change]

NEW COMPONENTS:
  [component-name]: [description] — [which screens use it]

DEPRECATED:
  [token/component]: [replacement] — [migration path]
```

---

## Implementation Notes

```
IMPLEMENTATION NOTES FOR BUILD AGENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Each instruction is self-contained. A build agent can execute these without design
interpretation or additional context. Instructions are grouped by file for efficiency.

[FILE: path/to/file]
  [ComponentName] [property]: [exact old value] → [exact new value] ([token reference])
  [ComponentName] [property]: [exact old value] → [exact new value] ([token reference])

[FILE: path/to/file]
  [ComponentName] [property]: [exact old value] → [exact new value] ([token reference])

[NEW FILE: path/to/new-file (if needed)]
  [Description of what to create and why]

ANIMATION ADDITIONS:
  [ComponentName]: [trigger] → [animation spec: property, duration, easing, delay]
  Reduced-motion fallback: [fallback spec]

RESPONSIVE CHANGES:
  [Breakpoint]: [ComponentName] [property]: [value] → [value] ([token reference])

ACCESSIBILITY FIXES:
  [ComponentName]: [ARIA attribute/focus behavior/contrast fix with exact values]
```

---

## Quality Spec Examples

These demonstrate the precision required. Every implementation note must match this standard.

```
BAD:  "Make the cards feel softer"
GOOD: "CardComponent border-radius: 8px → 12px (DESIGN_SYSTEM border-radius.lg).
       Inner content border-radius: 8px → 8px (unchanged, follows concentric rule:
       12px outer - 4px padding = 8px inner)"

BAD:  "Improve the spacing"
GOOD: "DashboardHeader margin-bottom: 16px → 24px (DESIGN_SYSTEM spacing.lg).
       Rationale: current 16px matches internal card padding, violating Gestalt proximity —
       sections blur into cards. 24px creates clear group separation."

BAD:  "The button needs more contrast"
GOOD: "PrimaryButton background: #6B7280 → #2563EB (DESIGN_SYSTEM color.action.primary).
       Contrast ratio with white text (#FFFFFF) improves from 3.8:1 → 8.6:1 (WCAG AAA).
       Secondary buttons remain #6B7280 — contrast differential now clearly signals hierarchy."

BAD:  "Add a shadow to the card"
GOOD: "ProjectCard box-shadow: none → DESIGN_SYSTEM shadow.md
       (0 1px 3px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.04)).
       Hover state: → DESIGN_SYSTEM shadow.lg (0 2px 4px rgba(0,0,0,0.12),
       0 8px 16px rgba(0,0,0,0.06)). Transition: box-shadow 200ms ease-out.
       Dark mode: shadow.md-dark (0 1px 3px rgba(0,0,0,0.28), 0 4px 6px rgba(0,0,0,0.12))."

BAD:  "The animation is too slow"
GOOD: "SidebarToggle transform transition: 500ms ease → 200ms cubic-bezier(0.4, 0, 0.2, 1)
       (DESIGN_SYSTEM motion.duration.fast, motion.easing.standard).
       @media (prefers-reduced-motion: reduce) { transition: opacity 0ms; }"

BAD:  "Fix the typography hierarchy"
GOOD: "DashboardPage title: font-size 24px/font-weight 500 →
       font-size 32px (DESIGN_SYSTEM type.heading.lg) / font-weight 600 (DESIGN_SYSTEM
       type.weight.semibold). Line-height: 1.5 → 1.2 (DESIGN_SYSTEM type.leading.tight).
       Subtitle: font-size 18px → 16px (DESIGN_SYSTEM type.body.md), color: #1F2937 →
       #6B7280 (DESIGN_SYSTEM color.text.secondary). Size ratio now 2:1 (was 1.33:1),
       creating clear primary/secondary text separation."
```

---

## Rules for This Template

1. **Every finding follows the pattern**: severity → what's wrong (with values) → what it should be (with tokens) → why it matters (with principle/research) → implementation spec
2. **Implementation notes reference design system tokens, not raw values**. If the raw value is needed for clarity, the token name comes first.
3. **New tokens go in DESIGN_SYSTEM UPDATES before any implementation note references them.**
4. **No vague language.** No "feels" without a measurable change attached. No "improve" without a specific target value.
5. **Phase assignment follows severity**:
   - Phase 1 (S4/S3): Actively hurts usability, accessibility, or breaks consistency
   - Phase 2 (S3/S2): Doesn't hurt, but clearly below professional standard
   - Phase 3 (S2/S1): Already functional, but not yet premium
6. **Contrast ratios are reported as numbers**, not descriptions. "Low contrast" is not acceptable. "3.8:1 (fails WCAG AA 4.5:1)" is.
7. **Animation specs include duration, easing function, and reduced-motion fallback.** No animation change is complete without all three.
8. **Dark mode changes are specified alongside light mode** whenever a color, shadow, or contrast value is modified. One without the other creates inconsistency.
9. **Responsive changes specify the breakpoint and the exact value change.** "Make it work on mobile" is not a finding.
10. **Each phase ends with verification criteria** — how to confirm the fixes are correct without design interpretation.
