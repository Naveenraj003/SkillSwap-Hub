# SkillSwap Hub - AI Context

Version: 1.0.0
Last Updated: 2026-07-14

---

# 1. Project Overview

## Project Name

SkillSwap Hub

## Description

SkillSwap Hub is a peer-to-peer skill exchange platform where users can teach skills, learn skills, connect with other learners, and build reputation through structured knowledge exchange.

The project focuses on creating a simple, professional, and practical learning network.

---

# 2. Project Goals

Primary goals:

* Allow users to discover skills and people.
* Allow users to teach and learn from each other.
* Provide structured skill profiles.
* Enable connection requests and learning sessions.
* Build trust through ratings and reputation.

The application should prioritize usability, simplicity, and maintainability.

---

# 3. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS v4
* React Router
* Lucide React Icons

## UI Approach

* Custom reusable UI components.
* shadcn/ui principles where useful.
* Component-driven architecture.

## Future Backend

Planned separately.

Possible technologies:

* API layer
* Database
* Authentication
* Real-time communication

Do not implement backend assumptions in frontend code.

---

# 4. Current Frontend Structure

```
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── explore/
│   ├── landing/
│   ├── layout/
│   ├── profile/
│   └── ui/
│
├── constants/
├── context/
├── data/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
└── types/
```

Do not create new folders unless the architecture requires them.

---

# 5. Architecture Rules

## Pages

Pages are responsible for:

* Route-level screens.
* Combining components.
* Page-specific layouts.

Pages should not contain large reusable components.

---

## Components

Components are responsible for:

* Reusable UI.
* Feature-specific UI.
* Presentational logic.

Avoid duplicate components.

---

## Layouts

Layouts control common page structures.

Current layouts:

* PublicLayout
* DashboardLayout

---

## Services

Services contain future external communication logic.

Examples:

* API calls
* Authentication services
* Data fetching

Do not place API logic inside components.

---

## Hooks

Custom reusable React logic belongs here.

Naming:

```
useSomething.ts
```

Example:

```
useAuth.ts
```

---

# 6. Routing Rules

Routes are managed only inside:

```
src/routes/AppRoutes.tsx
```

Rules:

* Do not create routes inside components.
* Use React Router.
* Keep route names simple and consistent.

Current routes:

```
/
 /login
 /register
 /dashboard
 /explore
 /profile
 /requests
 /sessions
 /chat
 /settings
```

---

# 7. Naming Conventions

## React Components

Use:

```
PascalCase
```

Examples:

```
Navbar.tsx
Hero.tsx
DashboardCard.tsx
```

---

## Utility Files

Use:

```
camelCase/lowercase
```

Examples:

```
utils.ts
routes.ts
```

---

## Hooks

Use:

```
useName.ts
```

Example:

```
useAuth.ts
```

---

# 8. TypeScript Rules

* Use TypeScript everywhere.
* Avoid `any`.
* Prefer clear types.
* Avoid unnecessary interfaces.
* Use type aliases when extending existing types without adding properties.
* Keep types reusable.

Example:

Good:

```ts
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
```

Avoid:

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
```

---

# 9. UI Design Philosophy

SkillSwap Hub should look like a professional engineering student's final-year project.

The design should be:

* Simple
* Clean
* Professional
* Functional
* Consistent

Avoid AI-generated looking designs.

---

# 10. Design Rules

## Colors

Primary:

* White background
* Gray text
* Gray borders
* Blue accent

Use minimal colors.

---

## Avoid

Do not use:

* Gradients
* Glassmorphism
* Excessive animations
* Neon colors
* Large decorative effects
* Excessive rounded cards
* Heavy shadows

---

## Use

Prefer:

* Simple layouts
* Clear typography
* Consistent spacing
* Subtle borders
* Small shadows
* Practical UI patterns

---

# 11. Component Design Rules

Reusable components should:

* Have a single responsibility.
* Accept props instead of duplicated versions.
* Support className customization when needed.
* Avoid feature-specific business logic.

UI components should not contain API calls.

---

# 12. Styling Rules

Use Tailwind CSS.

Preferred:

```
p-4
p-6
gap-4
gap-6
rounded-md
border
shadow-sm
```

Avoid random styling values.

Maintain consistency across all pages.

---

# 13. AI Development Rules

Before making changes:

AI must:

1. Read this file.
2. Understand existing architecture.
3. Identify affected files.
4. Avoid unnecessary modifications.

AI must not:

* Create unnecessary files.
* Rewrite working code without reason.
* Change architecture without explanation.
* Add unnecessary dependencies.
* Introduce inconsistent styles.

---

# 14. Development Workflow

For every feature:

1. Plan the implementation.
2. Identify files to modify.
3. Build the smallest working version.
4. Test.
5. Review.
6. Commit.

Keep changes focused.

---

# 15. Git Rules

Commit messages:

```
feat: add new feature
fix: fix issue
refactor: improve code structure
docs: update documentation
style: update UI styling
```

Example:

```
feat: build dashboard layout
```

---

# 16. Current Development Priority

Build order:

1. Application routing
2. Public pages
3. Authentication UI
4. Dashboard shell
5. User profile
6. Skill exploration
7. Requests
8. Chat
9. Sessions
10. Backend integration

---

# Final Rule

Build SkillSwap Hub as a real application.

Prioritize:

* Clean architecture
* Consistent UI
* Maintainable code
* Practical features

Simple and reliable is better than complicated and flashy.
