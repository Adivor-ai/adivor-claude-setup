---
name: systematic-debugging
description: >
  Nine-step debugging methodology with mandatory root cause analysis before any fix. Use when investigating bugs, fixing test failures, troubleshooting unexpected behavior, diagnosing runtime errors, resolving regressions, or when any test or build is failing. Also activate when the user says "it broke," "not working," "error," "bug," "failing test,", "regression," "unexpected behavior," "crash," "exception," or describes symptoms without understanding causes. Activate even for seemingly simple bugs — the methodology prevents the most common AI debugging failure: jumping to fixes without understanding root cause. This skill applies to ALL languages, frameworks, and tech stacks.
---

# Systematic Debugging — Root Cause First

## The Prime Directive

**🚫 NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

This is not a suggestion. This is the single rule that separates effective debugging from
an endless cycle of symptom-patching. Google, Amazon, Netflix, and Microsoft all enforce
this principle through formal processes (postmortems, COEs, blameless reviews).

The reason is simple: bugs are symptoms, not problems. A null pointer exception is a
symptom. A failed assertion is a symptom. A timeout is a symptom. The root cause lives
upstream — often far from where the error appears. Fixing at the symptom site creates
"band-aid code" that masks the real defect, which will resurface elsewhere.

IBM research shows defects caught in production cost 100× more than those caught during
design. Every shortcut at the debugging stage compounds this cost.

---

## The Nine-Step Debugging Sequence

Each step MUST complete before the next begins. Do not skip steps. Do not combine steps.
This sequence mirrors the scientific method (Zeller), Agans' 9 Rules, and the debugging
workflows documented at Google, Amazon, and Microsoft.

### Step 1 — Read the Complete Error

Parse error messages, stack traces, and log output FULLY before forming any hypothesis.

- Read every line of the stack trace — the root cause is often in the middle, not the top
- Note the exact error type, message text, file, and line number
- Look for "Caused by" chains — the deepest cause is usually the real one
- Check for warnings or deprecation notices preceding the error
- If there are multiple errors, identify which is PRIMARY (first chronologically)

**Why this matters:** Not reading error messages carefully is one of the most common
debugging anti-patterns. Stack traces frequently contain the exact file, line, and failure
mode. Engineers who spend 30 seconds reading carefully save hours of guessing.

### Step 2 — Reproduce the Failure

Verify the bug exists and identify exact triggering conditions.

- Run the failing test or trigger the error yourself — see it with your own eyes
- Note exact inputs, environment, and sequence that triggers it
- If you can't reproduce it, you can't study it and you can't verify a fix
- For intermittent failures: look for race conditions, timing dependencies, shared
  mutable state, or environment-specific factors
- Determine: is this a regression (worked before) or a new feature bug?

**If it's a regression:** Use `git log`, `git diff`, or `git bisect` to identify what
changed. `git bisect` uses binary search across commit history — it can find the breaking
commit among 20,000 commits in about 15 tests.

### Step 3 — Form a Hypothesis

Reason explicitly about what could cause this specific error. State it clearly.

- Formulate ONE clear, testable hypothesis: "The error occurs because X"
- Base it on evidence from Steps 1-2, not intuition or pattern-matching
- The hypothesis must explain ALL observed symptoms, not just some
- If you have multiple hypotheses, rank them by likelihood and test the most
  likely first

**Guard against confirmation bias:** ACM research (2022) found ~70% of developer actions
were associated with at least one cognitive bias. Actively consider explanations that
contradict your initial instinct. Ask: "What evidence would DISPROVE my hypothesis?"

### Step 4 — Gather Evidence

Use tools to verify or refute the hypothesis. Never claim anything about code without
investigating.

- Read the actual source code at the location indicated by the stack trace
- Use grep/search to find all callers, all usages of the affected function
- Check git log/diff for recent changes to the affected files
- Add temporary logging or use a debugger to inspect runtime values
- Trace data flow: follow the call chain backward from where bad values appear
- Check configuration, environment variables, dependency versions

**Root Cause Tracing Technique (the "5 Whys" applied to code):**
```
Observe the symptom     → WHERE does the error manifest?
Find immediate cause    → WHICH code directly produces the error?
Ask "what called this?" → Map the call chain upward
Keep tracing upstream   → Follow invalid data backward through the stack
Find original trigger   → WHERE did the problem actually START?
```

Each "why" digs one level deeper. The root cause is typically 3-5 levels up from the
symptom. Never stop at the first level — that's where band-aid fixes live.

### Step 5 — Isolate the Root Cause

Narrow down to the specific code path causing the issue using divide-and-conquer.

- Binary search the problem space: split the suspect code/data in half, test each half
- Create a minimal reproduction case — strip away everything not needed to trigger the
  failure (delta debugging principle)
- Compare working vs. broken: find similar code that works, identify differences
- Check dependencies: what does this code depend on? Have those changed?
- Verify assumptions: is the database connected? Is the file present? Is the API
  responding? ("Check the plug" — Agans' Rule #7)

**The root cause is identified when you can answer ALL of these:**
1. What is the defective code or configuration?
2. Why does this defect produce the observed failure?
3. When was it introduced (or was it always there)?
4. Why wasn't it caught earlier?

### Step 6 — Write a Failing Test

Before implementing any fix, write a test that captures the bug behavior.

- The test must FAIL with the current code, proving it catches the bug
- It should test the root cause scenario, not just the surface symptom
- Run it and verify it fails for the RIGHT reason (matching the bug, not a setup error)
- This test becomes a permanent regression guard

**Why test first:** Evolveum, after 5+ years of practice: "Even if the bugfix is a
one-liner and the test takes 100 lines to write. Always write the test first and see that
it fails." Without a failing test, you cannot objectively verify your fix worked.

### Step 7 — Implement a Targeted Fix

Only after understanding the root cause. Fix the cause, not the symptom.

- Change ONE thing at a time — never modify multiple variables simultaneously
- The fix should be minimal and focused — no unrelated refactoring
- Explain (to yourself or in a comment) WHY this fix addresses the root cause
- If the fix requires changing multiple files, each change should be traceable
  to the root cause analysis
- Undo any temporary debugging changes (extra logging, test modifications)

**Critical check:** Before committing, ask: "Does this fix the ROOT CAUSE identified
in Step 5, or am I just suppressing the symptom?" A null check that silently swallows
an error is symptom suppression. Fixing why the value is null in the first place is
root cause resolution.

### Step 8 — Verify and Check for Regressions

Run the failing test. Then run everything else.

- Run the test from Step 6 — it MUST now pass
- Run the full test suite — ensure no new failures were introduced
- If any NEW test fails, STOP. Your fix may have incorrect assumptions.
  Return to Step 3 with new information.
- Test edge cases related to your change
- If possible, verify in an environment that matches where the bug was reported

**Agans' Rule #9: "If you didn't fix it, it ain't fixed."** Verify under the exact
conditions that exposed the bug. A fix that passes tests but doesn't resolve the
reported behavior is not a fix.

### Step 9 — Document

Record what happened for future reference.

- What was the root cause? (one sentence)
- What was the fix? (one sentence)
- Why did this bug occur? (process/architecture insight)
- How can similar bugs be prevented? (testing gap, validation missing, etc.)
- Add a brief comment in the code if the fix is non-obvious

This documentation prevents the same root cause from producing new symptoms later.
Google's postmortem culture and Amazon's COE process both mandate this step.

---

## Escalation Rules — When to STOP

### The Three-Strike Rule

If THREE consecutive fix attempts fail, STOP. This signals one of:

- The root cause hypothesis is wrong — return to Step 3 with fresh eyes
- The problem is architectural — it can't be fixed with a patch
- Context has been lost — start a fresh debugging session

After two failed corrections, review all assumptions from the beginning. Do not attempt
a fourth fix without re-examining the root cause.

### Cascade Failure Detection

If fixing one bug reveals new bugs in different areas of the codebase, this indicates
architectural or design-level problems:

- Stop patching individual symptoms
- Document all symptoms observed so far
- Map the relationship between the failures
- The "root cause" may be a design decision, not a code defect
- Flag for team discussion before proceeding

---

## Common Debugging Scenarios

### Test Failures
```
1. Read the FULL assertion error — what was expected vs. actual?
2. Is the test correct? (Tests can have bugs too)
3. Check test setup — fixtures, mocks, environment, database state
4. Check test data — are mock return values realistic?
5. Trace the unexpected value backward through the code under test
6. Check for test isolation issues — does it pass alone but fail in suite?
```

### Runtime Errors (null/undefined, type errors, crashes)
```
1. Read the full stack trace — identify the exact throwing line
2. What value is wrong? (null, wrong type, out of bounds)
3. Where was this value supposed to be set?
4. Trace backward: who called this, with what arguments?
5. Find where the chain breaks — that's the root cause location
6. Add validation at the SOURCE, not at the crash site
```

### Regressions ("it worked before")
```
1. Use git bisect to find the breaking commit
2. Read the breaking commit carefully — what changed and why?
3. Identify which assumption the change violated
4. Fix at the source of the assumption violation
5. Consider: does this reveal a missing test?
```

### Intermittent / Flaky Failures
```
1. Collect multiple failure instances — look for patterns
2. Check for race conditions and shared mutable state
3. Check for timing dependencies (network, disk, thread scheduling)
4. Check for environment differences (timezone, locale, memory)
5. Look for order-dependent test execution
6. Add deterministic synchronization, not arbitrary sleeps
```

### Performance Issues
```
1. Measure before optimizing — profile, don't guess
2. Identify the bottleneck (CPU, memory, I/O, network)
3. Check for N+1 queries, unbounded loops, missing indexes
4. Compare against a known-good baseline
5. Fix the dominant bottleneck only — one change at a time
```

---

## Debugging Anti-Patterns — What NOT To Do

These are the behaviors that cause debugging sessions to spiral. Recognizing them
is as important as knowing the correct methodology.

| Anti-Pattern | What It Looks Like | Why It's Dangerous |
|---|---|---|
| **Shotgun debugging** | Making random changes hoping something works | Almost never works; usually introduces new bugs |
| **Cargo cult fixes** | Copying a StackOverflow answer without understanding it | Creates ritual code no one understands or dares remove |
| **Symptom patching** | Adding a null check instead of fixing why it's null | Masks the defect; it resurfaces elsewhere |
| **Multiple changes at once** | Changing 5 things then testing | Impossible to know which change helped (or hurt) |
| **Skipping reproduction** | "I think I know what's wrong" without seeing the error | You can't verify a fix for a bug you can't trigger |
| **Confirmation bias** | Only looking for evidence that supports your theory | Ignoring contradictory evidence extends debugging time |
| **Fix-and-pray** | Applying a fix without understanding the root cause | 60% chance the bug returns in a different form |

### Red Flag Self-Check

Stop immediately if you catch yourself thinking:

- "Quick fix for now, investigate later" → You won't investigate later. Do it now.
- "One more fix attempt" (after multiple failures) → You're shotgun debugging. Step back.
- "This should work" (without understanding why) → You don't have a root cause yet.
- "Let me just try..." (without a hypothesis) → Formulate what you're testing and why.
- "It works on my machine" → Investigate the environmental difference. That IS the bug.
- "I'll just add a try/catch" → You're suppressing a symptom, not fixing a cause.

---

## AI-Specific Debugging Discipline

These rules exist because AI assistants have a documented bias toward jumping to
solutions. Microsoft Research's Debug-gym project (2025) found that AI tools often
fail to seek additional information when solutions don't work. The "Self-Debugging"
paper (ICLR) showed that when LLMs explain code before attempting fixes, accuracy
improved by 2-12%.

### Rules for Claude When Debugging

1. **Investigate before proposing.** Never suggest a fix in the same response where
   you first encounter an error. Read the error, examine code, gather evidence first.

2. **Show your reasoning.** State your hypothesis explicitly: "I believe the error
   occurs because X, and here's the evidence..." This mirrors rubber duck debugging
   and is proven to improve accuracy.

3. **One change at a time.** Never propose a fix that modifies multiple unrelated
   files or logic paths. If the fix requires touching 5 files, explain why each
   change is necessary and how it connects to the root cause.

4. **Don't mask errors.** Never suggest wrapping code in try/catch, adding null
   checks, or using optional chaining as a "fix" unless the root cause genuinely
   requires that pattern. Silencing errors is not fixing them.

5. **Admit uncertainty.** If you're not confident in the root cause, say so.
   "I'm not certain, but my best hypothesis is X based on Y evidence" is far
   better than a confident wrong answer.

6. **Fresh start after failures.** If two correction attempts fail, re-examine
   all assumptions from scratch. Don't continue tweaking the same approach.

7. **Never blame the framework first.** The bug is almost certainly in the
   application code, not in React, Django, Rails, or the language runtime.
   Verify your code is correct before suspecting tools.

---

## RCA Techniques Reference

Use these when Step 3-5 need structure:

### 5 Whys (Toyota / Lean)
Ask "Why?" iteratively until you reach the root cause (typically 3-5 levels deep).
Best for: Linear causal chains, straightforward bugs.

```
Why did the API return 500?     → The database query threw an exception
Why did the query throw?        → It received a null parameter  
Why was the parameter null?     → The form validation didn't catch empty input
Why didn't validation catch it? → The validation rule was never added for this field
Why wasn't it added?            → The requirements didn't specify this field as required
ROOT CAUSE: Requirements gap → Add validation AND update requirements process
```

### Fishbone Categories (Ishikawa)
When a bug might have multiple contributing causes, mentally categorize across:
Code, Configuration, Dependencies, Infrastructure, Data, and Process.
Best for: Complex bugs with multiple potential sources.

### Divide and Conquer (Binary Search)
Split the suspect code/data/timeline in half, test each half, recurse on the
failing half. Reduces search space logarithmically.
Best for: "It's broken somewhere in this 500-line function" situations.

### IS/IS NOT Analysis (Kepner-Tregoe)
Define what the problem IS and what it IS NOT across dimensions:
- WHAT is failing vs. what is NOT failing?
- WHERE does it fail vs. where does it NOT fail?
- WHEN does it fail vs. when does it NOT fail?
- HOW BIG is the impact vs. what is unaffected?
Best for: Intermittent bugs, environment-specific issues, "works on my machine."

---

## Verification Checklist

Before declaring a bug fixed, ALL of these must be true:

- [ ] Root cause identified — can state it in one clear sentence
- [ ] Root cause explains ALL observed symptoms
- [ ] Hypothesis was tested, not assumed
- [ ] Fix targets the root cause, not a symptom
- [ ] Failing test was written BEFORE the fix
- [ ] That test now passes WITH the fix
- [ ] Full test suite passes — no regressions
- [ ] Fix is minimal — no unrelated changes bundled in
- [ ] Can explain WHY the bug occurred and WHY the fix works
- [ ] No "quick fix" rationalization was used

---

## Key References Behind This Methodology

This skill synthesizes practices from:
- **David Agans** — "Debugging: The 9 Indispensable Rules" (2002)
- **Andreas Zeller** — "Why Programs Fail" (2005 Jolt Award), delta debugging
- **Google SRE** — Blameless postmortem culture, Wheel of Misfortune exercises
- **Amazon** — Correction of Errors (COE) process, 5 Whys, Andon Cord
- **Meta** — Reverse debugging at scale via Intel Processor Trace
- **Netflix** — Chaos Engineering (Chaos Monkey, Chaos Kong)
- **Toyota Production System** — Sakichi Toyoda's 5 Whys, Taiichi Ohno's Andon Cord
- **ITIL v4** — Problem Management, Kepner-Tregoe analysis
- **Six Sigma DMAIC** — Define, Measure, Analyze, Improve, Control
- **IEEE Std 1044-2009** — Software anomaly classification
- **MIT 6.031** — Systematic debugging curriculum
- **Microsoft Research Debug-gym** (2025) — AI debugging methodology
- **LDB "Debug like a Human"** (ACL 2024) — Block-level verification for LLMs

## Integration with Other Skills

- **testing-patterns**: Use when writing the failing test in Step 6 — follow the factory functions and test structure patterns
- **cove**: For complex bugs where you need to verify technical assumptions about API behavior or library internals, use CoVe to fact-check your hypothesis
- **testing-process**: After the bug is fixed and verified, run the full test suite as described in testing-process guidelines
