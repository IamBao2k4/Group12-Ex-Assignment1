---
sidebar_position: 3
---

# Source Code Organization

The source code of the **Student Manager System** is structured according to best practices for maintainability, modularity, and scalability. The project is divided into two main directories: one for the **frontend (client)** and another for the **backend (server)**.

## Frontend – React + TypeScript

### Location: `/client`

The frontend is built with **React** and structured as a component-based application using **TypeScript** and **Vite** for fast development.

### Key Directories and Files:

| Path                          | Description                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| `/client/src`                 | Main source folder                                              |
| `/client/src/components`      | Reusable UI components                                          |
| `/components/common`          | Shared/common UI components (e.g., buttons, cards, modals)      |
| `/components/horizontalNav`   | Navigation bar and tab controls                                 |
| `/components/mainInformation` | Components that render main dashboard content                   |
| `/client/src/pages`           | Page-level components for routing (if present)                  |
| `/client/src/assets`          | Static assets such as images and icons                          |
| `/client/src/App.tsx`         | Main application component (entry point for routing and layout) |
| `/client/src/main.tsx`        | Vite entry file                                                 |
| `/client/vite.config.ts`      | Vite build configuration                                        |
| `/client/tsconfig.json`       | TypeScript configuration                                        |
| `/client/public`              | Public folder for static resources (favicon, HTML template)     |

## Backend – NestJS + MongoDB

### Location: `/server`

The backend uses **NestJS**, structured into **modular service layers**. Each module follows the standard NestJS convention: `controller`, `service`, `dto`, `schema`.

### Key Directories and Files:

| Path                         | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `/server/src`                | Main source code for backend                           |
| `/server/src/modules`        | Core business logic modules                            |
| `/modules/student`           | Manages student records                                |
| `/modules/faculty`           | Manages faculty (departments)                          |
| `/modules/program`           | Manages academic programs                              |
| `/modules/course`            | Handles courses and course information                 |
| `/modules/enrollment`        | Handles student enrollments in courses                 |
| `/modules/transcript`        | Generates and handles student transcripts              |
| `/modules/open_class`        | Manages class offerings                                |
| `/modules/import`, `/export` | Handles file import/export features (CSV, Excel, etc.) |
| `/server/src/common`         | Shared utility classes, constants, and helpers         |
| `/server/src/config`         | Environment and application-level configuration        |
| `/server/src/app.module.ts`  | Main root module that imports all feature modules      |
| `/server/src/main.ts`        | Application bootstrap entry point                      |
| `/server/.env`               | Environment variables for database, port, etc.         |
| `/server/migration`          | Scripts for initial data setup or database seeding     |
| `/server/test`               | Test folder (unit or e2e tests, if applicable)         |

## API Design & Routing

-   Each backend module defines its own controller, exposing a set of RESTful API endpoints.

-   Example:

    -   `GET /students` – Fetch student list

    -   `POST /enrollments` – Register a student to a course

    -   `GET /transcripts/:studentId` – View transcript for a student

Routing is handled internally by NestJS decorators such as `@Controller()` and `@Get()`, and data validation is done using DTOs and Pipes.

## Organization Principles

-   **Separation of concerns:** Each module is isolated and responsible for a specific domain.

-   **Scalability:** Easy to extend by adding new modules without affecting others.

-   **Reusability:** Common logic is centralized in common/ folders (both frontend and backend).

-   **Consistency:** Naming conventions and file structures follow NestJS and React standards.

## Conclusion

This well-organized codebase helps both new and existing developers easily navigate and understand the project. With a clear separation between frontend and backend responsibilities, the system is highly maintainable and ready for real-world deployment or further feature expansion.
