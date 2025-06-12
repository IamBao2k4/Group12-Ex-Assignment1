---
sidebar_position: 1
---

# Coding Standard

Maintaining consistent and high-quality code is essential for collaborative development and long-term maintainability. This section outlines the coding conventions and best practices followed in the Student Manager System project, covering both the **frontend (React + TypeScript)** and **backend (NestJS + TypeScript)**.

## Frontend (React + TypeScript)

### General Guidelines

-   All code must be written in **TypeScript**.

-   Use **ESLint** and **Prettier** to ensure code formatting and linting consistency.

-   Follow functional and **component-based architecture** with clean separation of logic and UI.

### Code Structure

-   Use **PascalCase** for component and file names: `StudentList.tsx`, `CourseForm.tsx`

-   Use **camelCase** for variables, function names, and props.

-   Group related components into subfolders (e.g., `/components/common`, `/components/forms`).

### React Conventions

-   Use **functional components** and **React Hooks** (`useState`, `useEffect`, etc.).

-   Keep component files small and focused. Split logic into custom hooks if needed.

-   Avoid inline styles; use CSS modules or styled-components if styling is required.

### Type Safety

-   Always define **interfaces or types** for component props and API data.

-   Use `React.FC<Props>` for typing functional components.

-   Validate all user inputs before sending to the backend.

## Backend (NestJS + TypeScript)

### General Guidelines

-   Follow **NestJS’s official style guide** and use TypeScript across all backend code.

-   Organize code into clearly defined **modules** based on features/domains.

-   Use **DTOs** (Data Transfer Objects) for input validation and typing.

### Naming Conventions

| Entity              | Naming Style     | Example                              |
| ------------------- | ---------------- | ------------------------------------ |
| Modules             | kebab-case       | `student`, `enrollment`              |
| Classes/Interfaces  | PascalCase       | `StudentService`, `CreateStudentDto` |
| Variables/Methods   | camelCase        | `getAllStudents()`                   |
| MongoDB Collections | plural lowercase | `students`, `programs`               |

### File Structure Standard

```bash
/modules
  /student
    student.controller.ts
    student.service.ts
    student.module.ts
    dto/
    schemas/
```

### Validation & Error Handling

-   Use `class-validator` decorators for validating request DTOs.

-   Return meaningful HTTP status codes (e.g., `200 OK`, `400 Bad Request`, `404 Not Found`).

-   Handle errors centrally using NestJS's exception filters.

## Code Formatting Tools

| Tool             | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| **ESLint**       | Enforces coding rules and style                     |
| **Prettier**     | Automatically formats code                          |
| **Husky**        | Runs pre-commit hooks (optional)                    |
| **EditorConfig** | Maintains consistent indentation & newline settings |

All developers should ensure their IDE/editor is configured to auto-format on save and to respect `.prettierrc` and `.eslintrc.js`.

## Documentation

-   Every service and controller function should have **JSDoc-style comments** explaining the purpose and parameters.

-   For complex logic, inline comments should be used to enhance readability.

-   Components and APIs should be self-explanatory and well-typed.

Example:

```jsx title="ts"
/**
* Retrieves all students in the system.
* @returns List of students.
*/

findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
}
```

## Testing and Quality

-   Basic **unit tests** should be written for critical services and logic.

-   Use meaningful variable and function names – avoid single letters unless used in short loops or temporary calculations.

-   Avoid hard-coded values; use environment variables or configuration files where appropriate.

## Anti-Patterns to Avoid

-   Large components or services (>300 lines) without separation of concerns.

-   Ignoring type safety or using `any` unnecessarily.

-   Mixing presentation and business logic in the same file.

-   Committing code that fails ESLint/Prettier checks.

## Summary

Adhering to a consistent coding standard:

-   Makes code easier to read, review, and maintain.

-   Reduces bugs and speeds up onboarding for new developers.

-   Reduces bugs and speeds up onboarding for new developers.
