# SkillSwap Hub - AI Development Rules & Architectural Guidelines

## 1. Role Definition
* **Roles:** Lead Software Architect, Senior Full Stack Engineer, UI/UX Engineer, Database Architect, Technical Reviewer.
* **Goal:** Deliver a production-quality application with priority on maintainability, consistency, scalability, performance, and correctness. 
* **Approach:** Think before implementing. Do not act as a mere code generator.

---

## 2. Project Context
* **Rebuild from Scratch:** The previous implementation is discarded. Do not restore deleted files or reuse old code.
* **Authoritative Specification:** The Software Requirements Specification (`SkillSwap-Hub-SRS.md`) is the ONLY source of truth.
* **No Assumptions:** If the SRS is ambiguous or silent, stop and ask the user for clarification.

---

## 3. Implementation Principles
* **Vertical Slices:** Build complete vertical slices (Frontend, Backend, Database, Validation, Error Handling, Integration, Testing) one feature at a time.
* **No Speculative Features:** Only implement what is explicitly defined in the SRS. No future scope, speculative tables, or unapproved APIs.
* **Simplicity Wins:** Choose the simpler, cleaner, and more maintainable solution whenever options satisfy the SRS equally well.

---

## 4. Frontend Guidelines
* **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router.
* **UI Design:**
  * Simple, professional, minimal, consistent, responsive, accessible.
  * Looks like a polished student-built professional application.
  * **AVOID:** Glassmorphism, heavy gradients, random animations, excessive shadows, and "AI-vibe" interfaces.
* **Folder Structure:**
  * `pages/` (Route-level screens)
  * `components/` (Reusable, single-responsibility UI)
  * `hooks/` (Reusable logic, named `useSomething.ts`)
  * `services/` (API layer and external integrations; no API calls inside components)
  * `types/`, `utils/`, `context/`, `layouts/`, `assets/`

---

## 5. Backend Guidelines
* **Tech Stack:** FastAPI, PostgreSQL, Supabase.
* **Principles:**
  * Business logic must never exist inside routers.
  * Separate layer structure: `routers/`, `services/`, `schemas/`, `models/`, `repositories/`, `auth/`, `utils/`.
  * Every endpoint must include: input validation, error handling, authorization, and meaningful HTTP response codes.

---

## 6. Database & Auth Guidelines
* **PostgreSQL:** normalized tables, UUID primary keys, proper foreign keys, and indexes where beneficial.
* **Authentication:** Supabase Authentication (Email + Password only). No phone/OTP auth.
* **Privacy:** Private info (Email, Phone, Location) must never appear publicly or be search-accessible.

---

## 7. Quality Checklist & Verification
Before considering any task complete:
- [ ] No TypeScript errors or warnings.
- [ ] Clean builds without compilation errors.
- [ ] No duplicated code or unused imports.
- [ ] Clean routing and functional APIs.
- [ ] Sanitized user input and input validation.
- [ ] Proper error handling.
