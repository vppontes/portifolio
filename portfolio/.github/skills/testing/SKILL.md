
---
name: testing
description: Guidelines for creating and running automated tests using Vitest and React Testing Library in the CP3 portfolio.
---

# Testing

Use this skill when creating features, fixing bugs, or verifying application behavior.

## Mandatory Tests

1. Individual contact form field validation.
2. Dashboard access restriction for unauthenticated users.

## Workflow

1. Identify the behavior to test.
2. Check existing tests.
3. Write tests focused on observable behavior.
4. Use Vitest and React Testing Library.
5. Avoid unnecessary implementation details.
6. Run the tests.
7. Fix implementation issues.
8. Report actual results.

## Rules

- Never invent test results.
- Never remove tests just to make the suite pass.
- Never ignore failures.
- Use descriptive test names.
- Avoid duplication.
- Keep tests inside src/tests or the existing test structure.
