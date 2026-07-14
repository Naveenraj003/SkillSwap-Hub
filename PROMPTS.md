# SkillSwap Hub - AI Prompts

Version: 1.0.0

Purpose:
This file contains reusable prompts for AI-assisted development.
All AI tools should follow AI_CONTEXT.md before generating code.

---

# Standard Development Prompt

Read AI_CONTEXT.md before making any changes.

Follow all existing:
- Architecture rules
- Folder structure
- Naming conventions
- Coding standards
- Technology choices

Before writing code:

1. Explain the implementation approach.
2. List files that will be created or modified.
3. Identify possible architecture changes.
4. Confirm whether AI_CONTEXT.md requires updates.

Implementation rules:

- Modify only required files.
- Do not create unnecessary files.
- Do not duplicate existing components.
- Use React + TypeScript.
- Use Tailwind CSS v4.
- Use shadcn/ui when suitable.
- Follow existing project structure.
- Write clean and maintainable code.
- Keep components reusable.

After implementation:

Provide:
- Modified files list
- Summary of changes
- Testing steps
- Suggested git commit message

---

# Build New Component

Create a reusable React TypeScript component.

Requirements:

- Follow AI_CONTEXT.md.
- Place the component in the correct folder.
- Use existing styling patterns.
- Avoid unnecessary dependencies.
- Make the component responsive.

---

# Build New Page

Create a new application page.

Before coding:

- Explain page structure.
- Identify required components.
- Identify required routes.

Implementation:

- Use existing layouts.
- Reuse components.
- Follow routing conventions.

---

# Debug Prompt

Analyze the issue.

Provide:

1. Root cause.
2. Files affected.
3. Minimal fix.
4. Potential side effects.

Do not rewrite unrelated code.

---

# Code Review Prompt

Review this code according to AI_CONTEXT.md.

Check:

- Architecture
- TypeScript quality
- React practices
- Performance
- Accessibility
- Maintainability

Suggest improvements only when required.

---

# Refactoring Prompt

Refactor only if it improves:

- Readability
- Maintainability
- Performance
- Reusability

Do not change functionality.

---

# Documentation Update Prompt

Review recent project changes.

Determine whether:

- AI_CONTEXT.md needs updating.
- README.md needs updating.
- New prompts should be added.

Suggest required updates.