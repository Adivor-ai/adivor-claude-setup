# By The Way (BTW)

Ask a quick question without contaminating the current conversation context.

Arguments: $ARGUMENTS (your question)

## Purpose

Sometimes you need to ask Claude something quick:
- "what does this function do?"
- "is this the right approach?"
- "what package do I need to install?"

But you don't want that question and answer to pollute your main conversation context, especially during focused implementation.

The /btw command addresses this by providing a way to ask questions that don't accumulate in context.

## Usage

```
/btw what does the getUserSession function do?
/btw is there a better way to handle this error?
/btw what's the syntax for async/await in Python?
/btw should I use Map or Object for this cache?
```

## What This Command Does

### Response Format

Provide a concise, direct answer to $ARGUMENTS.

**Keep it brief:**
- Answer the specific question asked
- Don't elaborate beyond what's needed
- Include code examples only if requested
- Reference docs/files if relevant

**Example responses:**

```
Q: /btw what does getUserSession do?
A: getUserSession() in auth/session.ts:42 retrieves the current user's
session from localStorage, validates the token, and returns the session
object or null if invalid/expired.
```

```
Q: /btw is there a better way to handle this error?
A: Yes - instead of try/catch, use .catch() on the promise chain, or
better yet, use an error boundary if this is React component code.
```

```
Q: /btw what package do I need for JWT?
A: For this project, we use 'jsonwebtoken'. It's already in package.json.
Import: import jwt from 'jsonwebtoken'
```

## Important Constraints

**DO:**
- Answer the question directly
- Be concise (2-4 sentences max)
- Reference specific file:line if relevant
- Suggest follow-up actions if needed

**DON'T:**
- Provide lengthy explanations
- Make changes to code
- Start implementation
- Expand scope beyond the question
- Accumulate discussion in the main context

## Context Management

The whole point of /btw is to NOT pollute the main conversation context.

After answering:
- The answer is provided
- The context is NOT preserved
- The main conversation continues as before
- It's as if the question was never asked (from a context perspective)

This is similar to an "overlay" or "popup" response that's discarded after reading.

## When to Use vs. Not Use

**Use /btw when:**
- You have a quick question
- You're in the middle of focused work
- You don't want to derail the conversation
- The answer is simple and self-contained

**Don't use /btw when:**
- You need a detailed explanation
- The answer requires reading multiple files
- You want to discuss trade-offs
- The question is central to the current task

For complex questions, just ask normally in the main conversation.

## Limitations

**Note:** This command is a BEST-EFFORT implementation of the /btw concept from Boris Cherny's workflow.

True /btw functionality would require:
- Separate context management
- Overlay rendering
- Automatic cleanup after response

Since Claude Code doesn't have native support for this, we approximate it by:
- Providing concise, focused answers
- Avoiding context buildup
- Keeping responses self-contained

The main benefit is the MINDSET: keeping questions separate from implementation flow, even if the technical implementation isn't perfect.

## Pro Tips

- Use /btw for "interrupt-driven" questions that pop up mid-task
- Chain multiple /btw questions if needed: they're designed to be fast
- If you find yourself using /btw repeatedly for the same topic, that topic probably belongs in the main conversation
- After getting a /btw answer, immediately continue where you left off

## Example Session Flow

```
[Main conversation: implementing authentication]

/btw does bcrypt work on Windows?

Response: Yes, bcrypt works on Windows. Node bcrypt package includes
prebuilt binaries for Windows. Already in your package.json v5.1.1.

[Resume main conversation: implementing authentication]
```

The /btw question didn't derail the implementation - you got the answer and moved on.

## Remember

From Boris Cherny:
> "/btw - Question something without breaking Claude's flow (answer appears in discardable overlay)"

The goal is to preserve focus while still being able to ask quick questions. Don't let small questions derail big tasks.
