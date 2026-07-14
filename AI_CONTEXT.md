# AI_CONTEXT

Version: 1.0.0

Last Updated: 2026-07-14

Architecture Status:
Stable

Current Phase:
Frontend Development

# SkillSwap Hub AI Context

## Project Overview

SkillSwap Hub is a peer-to-peer skill exchange platform where users teach skills and learn skills from one another. The product is centered on discovery, trust, communication, scheduling, and profile-driven matching.

This document is the permanent architectural reference for AI assistants working in this repository. It defines the intended structure, conventions, and decision boundaries so that future code generation remains consistent, maintainable, and production-oriented.

## Vision

Build a polished, trustworthy, and scalable skill exchange experience that helps people discover compatible learning partners, manage skill-sharing sessions, and communicate efficiently across the platform.

## Goals

- Create a strong first-use experience that quickly explains the value of the platform.
- Make it easy to browse skills, create a profile, request exchanges, and manage sessions.
- Keep the frontend modular, reusable, and easy to extend.
- Establish conventions that support a future production backend without coupling the frontend to implementation details.
- Prioritize accessibility, responsiveness, and performance from the start.

## Target Users

- Individuals who want to teach a skill and learn another skill in return.
- New users exploring whether the platform is a good fit for their interests.
- Active members managing exchange requests, sessions, and messages.
- Future administrators or moderators who may need operational dashboards.

## Core Features

- User onboarding and authentication flows.
- Public landing experience and platform overview.
- Skill discovery and browsing.
- User profile presentation and editing.
- Exchange requests and request management.
- Session tracking and coordination.
- Real-time or near-real-time chat experience.
- Settings and account preferences.
- Dashboard views for personalized activity.

## MVP Scope

The minimum viable product should focus on the smallest complete loop that validates the platform:

- Landing page with clear product positioning.
- Authentication screens for login and registration.
- Dashboard entry point after authentication.
- Explore page for browsing skills and users.
- Profile page for personal identity and listed skills.
- Requests page for managing exchange requests.
- Sessions page for active and past skill exchanges.
- Chat page for conversation threads.
- Settings page for account and preferences.
- Reliable navigation and empty/error states.

## Future Scope

The product may later expand to include:

- Advanced matching and recommendation logic.
- Search filters, sorting, and saved discovery views.
- Availability calendars and scheduling coordination.
- Reputation, ratings, and feedback systems.
- Notifications across in-app, email, and push channels.
- Reports, moderation, and safety tooling.
- Community features such as groups, challenges, or events.
- Subscription, monetization, or premium matching features if needed.

## Technology Stack

The current frontend stack is:

- React
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- React Router

Supporting libraries currently present in the project may be used when they serve the architecture cleanly, but they should not drive design decisions. The stack should remain lightweight, composable, and predictable.

## Project Folder Structure

The current frontend structure is intentional and should be preserved:

- src/
- assets/
- components/
- common/
- dashboard/
- explore/
- landing/
- layout/
- profile/
- ui/
- constants/
- context/
- data/
- hooks/
- layouts/
- lib/
- pages/
- routes/
- services/
- types/

Folder purpose rules:

- assets/ contains static local assets such as images and icons.
- components/ contains reusable UI building blocks grouped by feature or domain.
- components/common/ holds broadly reusable shared components that are not tied to a single page.
- components/dashboard/, components/explore/, components/landing/, and components/profile/ hold feature-scoped components.
- components/layout/ holds shared shell elements such as navigation and footer pieces.
- components/ui/ holds design-system primitives and shadcn/ui-based components.
- constants/ stores stable application constants, enums, and configuration values.
- context/ contains React context providers and hooks for cross-cutting UI or session state.
- data/ contains static datasets, fixtures, or local content models that are not server state.
- hooks/ contains reusable custom hooks.
- layouts/ contains route-level or page-shell layout components.
- lib/ contains low-level utilities and helper functions.
- pages/ contains route components that represent screens.
- routes/ contains route definitions, route configuration, and routing composition.
- services/ contains API clients and domain service modules.
- types/ contains shared TypeScript types and interfaces.

## Routing Structure

Routing should be centralized and predictable.

- Public routes should cover landing, login, register, and not-found behavior.
- Authenticated routes should cover dashboard, explore, profile, requests, sessions, chat, and settings.
- Route composition should live in routes/ and remain the single source of truth for navigation structure.
- Layout separation should be preserved between public and authenticated experiences.
- Route protection, redirects, and fallback behaviors should be explicit and easy to reason about.

Current pages to support:

- Landing
- Login
- Register
- Dashboard
- Explore
- Profile
- Requests
- Sessions
- Chat
- Settings
- NotFound

## Component Architecture

Component architecture should follow a layered model:

- Pages define screen-level composition and route ownership.
- Layouts define persistent shells and shared page framing.
- Feature components encapsulate domain-specific UI and interactions.
- Common components handle shared patterns used across multiple areas.
- UI primitives remain small, composable, and styling-focused.

Rules:

- Keep components focused on one responsibility.
- Prefer composition over inheritance and avoid overly generic abstractions.
- Move duplicated UI into reusable components only after repeated use is proven.
- Keep feature logic near the feature that owns it.
- Keep page components thin and delegate detail rendering to child components.

## Naming Conventions

- Use PascalCase for React components, types, interfaces, and enums.
- Use camelCase for variables, functions, hooks, and object properties.
- Use use prefixes for custom hooks.
- Use descriptive names that reflect domain meaning rather than implementation detail.
- Use singular names for components and types unless the domain naturally requires plural form.
- Avoid abbreviations unless they are widely understood and stable.

## React Best Practices

- Prefer function components and hooks.
- Keep render logic deterministic and side effects isolated.
- Avoid unnecessary state duplication.
- Derive data whenever possible instead of storing derived values in state.
- Keep effects minimal and scoped to external synchronization.
- Split complex screens into smaller components before logic becomes difficult to follow.
- Pass only the props a component truly needs.
- Avoid premature abstraction and keep component boundaries easy to understand.

## TypeScript Standards

- Use strict, explicit typing where it improves clarity and safety.
- Prefer shared types from types/ for domain models reused across features.
- Avoid any unless there is a documented and unavoidable boundary.
- Use union types for constrained state and workflow variants.
- Model nullable and optional values intentionally rather than implicitly.
- Keep type definitions close to the domain they describe, then elevate shared ones into types/ when reuse is established.
- Prefer type-safe utilities and avoid unsafe casting.

## Tailwind CSS Guidelines

- Use Tailwind CSS v4 as the primary styling system.
- Prefer utility classes for layout, spacing, alignment, typography, and visual states.
- Keep class composition readable; extract repeated class sets into reusable patterns or UI primitives.
- Use design tokens and shared theme values consistently.
- Avoid arbitrary values unless a specific design need cannot be met cleanly otherwise.
- Keep responsive styling intentional rather than accumulating overrides.
- Ensure dark or light themes are applied consistently if the product supports them.

## shadcn/ui Usage Rules

- Use shadcn/ui as the basis for accessible, composable interface primitives.
- Treat shadcn/ui components as a starting point, not a reason to skip architectural discipline.
- Extend primitives through composition and variant patterns rather than copy-pasting markup.
- Keep the ui/ folder focused on reusable design-system elements.
- Preserve accessibility, keyboard behavior, and semantic structure when adapting shadcn/ui components.
- Use the smallest component that satisfies the interface need.

## State Management Strategy

- Keep local UI state local to the component that owns it.
- Lift state only when multiple sibling components need to coordinate.
- Use context for cross-cutting client state that is not server data and would otherwise require excessive prop drilling.
- Avoid introducing global state management libraries unless the product scale clearly demands them.
- Keep server state separate from UI state.
- Cache, loading, and synchronization concerns should remain explicit and not mixed with display-only state.

## API Folder Strategy

- services/ is the home for all data access and integration logic.
- API calls should be isolated from page and presentation components.
- Each service should map to a domain or backend resource, not to a screen.
- Service modules should expose stable, intention-revealing functions.
- UI components should receive prepared data, not directly orchestrate network details.
- API response normalization should happen in the service layer or a nearby adapter, not inside rendering code.

## Service Layer Rules

- Keep service functions small, composable, and domain-oriented.
- Centralize request configuration and shared transport behavior.
- Do not leak transport-specific details into UI components.
- Handle translation between backend payloads and frontend domain models in one place.
- Keep error and success semantics predictable across services.
- Avoid duplicate request logic by reusing common service helpers.

## Constants and Context Folder Purpose

- constants/ stores stable values that should not be recreated throughout the app.
- Use constants for route labels, UI limits, status keys, and shared static values.
- context/ stores application-wide providers and hooks for shared state.
- Use context only when the state truly needs to be shared across unrelated branches.
- Avoid putting feature-specific logic in context unless it is intentionally cross-cutting.

## Reusable Component Guidelines

- Extract reusable components when the same pattern appears more than once and is likely to stay stable.
- Prefer domain-aware shared components over generic utilities with unclear intent.
- Keep reusable components prop-driven, focused, and easy to test.
- Reusable components should improve clarity, not hide business meaning.
- Avoid creating a component library layer that is more abstract than the product needs.

## File Naming Rules

- Use PascalCase for React component files.
- Use camelCase for utility and hook files when that matches existing conventions.
- Keep route files and page files named to reflect the screen or domain.
- Keep type files descriptive and grouped by domain when possible.
- Avoid ambiguous names such as temp, common2, or final.

## Import Order Rules

- Import React and framework dependencies first.
- Import third-party libraries next.
- Import absolute or aliased internal modules after external packages.
- Import sibling and local modules after higher-level shared modules if that improves clarity.
- Keep imports grouped, sorted, and free of unused entries.
- Prefer one clear import style consistently across the codebase.

## Coding Standards

- Keep code readable, explicit, and consistent.
- Avoid cleverness that makes intent harder to follow.
- Favor small functions and components with clear responsibilities.
- Reuse shared patterns rather than reinventing them per page.
- Keep domain logic and view logic separated where practical.
- Maintain a professional, production-ready standard in all generated code.

## Error Handling Standards

- Treat failures as first-class states in UI and service design.
- Show user-facing fallback states for loading, empty, error, and unauthorized conditions.
- Avoid silent failures.
- Normalize and surface errors consistently from the service layer.
- Keep error messages helpful, concise, and free of internal implementation detail.
- Distinguish between recoverable validation issues and unexpected operational failures.

## Accessibility Guidelines

- Use semantic HTML whenever possible.
- Ensure keyboard navigation works for all interactive flows.
- Maintain visible focus states.
- Provide meaningful labels, names, and descriptions for controls.
- Keep color contrast at accessible levels.
- Do not rely on color alone to communicate meaning.
- Make modal, drawer, and overlay interactions fully accessible.

## Responsive Design Rules

- Design mobile-first and progressively enhance for larger viewports.
- Ensure critical flows work cleanly on small screens.
- Avoid fixed-width assumptions that break on phones or tablets.
- Use responsive spacing, layout, and typography deliberately.
- Test content-heavy pages for overflow, wrapping, and truncation.
- Preserve usability before decorative complexity.

## Performance Guidelines

- Keep initial bundles lean and avoid unnecessary dependencies.
- Use code splitting and route-based loading where beneficial.
- Prevent avoidable re-renders by keeping component responsibilities narrow.
- Avoid excessive nested component trees when a simpler structure will do.
- Load data intentionally and do not duplicate network work.
- Prefer efficient list rendering for large collections.
- Keep assets optimized and only load what a page needs.

## Git Commit Convention

- Use clear, concise commit messages.
- Prefer conventional-style commit types such as feat, fix, refactor, docs, chore, test, and style.
- Keep commits focused on one logical change.
- Avoid bundling unrelated work into the same commit.
- Commit messages should explain what changed, not how the entire system works.

## Branch Naming Convention

- Use short, descriptive branch names.
- Prefer a structured format such as feature/..., fix/..., chore/..., or refactor/....
- Keep branch names readable and purpose-driven.
- Avoid vague names such as update, work, or newbranch.

## Testing Strategy

- Prioritize testing at the boundaries where logic is most valuable.
- Test critical user flows, route guards, and service behavior.
- Add component-level tests for reusable and behavior-heavy UI.
- Validate empty, loading, error, and success states.
- Keep tests stable and focused on observable behavior.
- Use testing to protect architectural contracts, not implementation trivia.

## Future Backend Architecture

The backend is not implemented in this document and no backend code should be added here. The intended future backend architecture should support:

- Clear domain boundaries for users, skills, requests, sessions, chat, and notifications.
- REST or similarly structured APIs with predictable contracts.
- Authentication and authorization separation.
- Service-oriented organization with clean business logic boundaries.
- Validation at the API edge.
- Integration points for notifications, messaging, and search as the platform grows.

The frontend should remain backend-agnostic enough to adapt to a production API without large structural rewrites.

## Database Planning

The future database design should support:

- Users and profiles.
- Skills and skill tags.
- Teaching and learning preferences.
- Exchange requests and request status history.
- Sessions and availability coordination.
- Conversation threads and messages.
- Notifications and read state.
- Auditability where needed for trust and moderation.

The schema should favor clarity, relational integrity, and extensibility over premature optimization.

## Authentication Planning

The platform should eventually support a secure authentication model with:

- Registration and login.
- Protected routes for authenticated experiences.
- Session persistence.
- Account recovery and verification flows as needed.
- Role-aware access if moderation or administration is introduced.
- Secure handling of tokens, cookies, or session state depending on the final backend architecture.

Authentication decisions should be centralized and consistent across routing, services, and UI state.

## Deployment Planning

The deployment strategy should support:

- Separate environments for local development, staging, and production.
- Environment-driven configuration.
- Static frontend deployment with reliable asset delivery.
- Clean build and preview flows.
- Observable runtime behavior with predictable error handling.
- A production rollout path that does not require redesigning the frontend architecture.

## AI Instructions

Every AI assistant working in this repository must follow these rules:

- Never create unnecessary files.
- Never modify unrelated files.
- Always follow existing project architecture.
- Prefer reusable components.
- Maintain consistent naming.
- Avoid duplicate logic.
- Explain architectural changes before suggesting them.

AI assistants should treat this document as the source of truth for repository-wide conventions unless a more specific file in the project explicitly overrides a rule.

## Development Roadmap

Implementation should generally proceed in this order:

1. Project shell, routing, and layout foundation.
2. Landing experience and public navigation.
3. Authentication screens and protected route flow.
4. Dashboard composition and authenticated shell.
5. Profile creation and profile editing flow.
6. Explore and discovery experience.
7. Requests workflow and request state management.
8. Sessions workflow and scheduling-oriented views.
9. Chat interface and messaging structure.
10. Settings and account management.
11. Shared services, hooks, constants, and types hardening.
12. Error states, empty states, accessibility pass, and responsive polish.
13. Testing coverage for critical user journeys.
14. Performance review, deployment readiness, and production hardening.

## Operating Principle

When in doubt, prefer the smallest change that preserves architecture, improves clarity, and supports future scale.

## Product Differentiation

SkillSwap Hub focuses on structured peer-to-peer learning.

Key differentiators:
- Skill identity profiles
- Skill matching
- Reputation system
- Controlled communication
- Mutual session approval
- AI-powered learning assistance (future)