---
sidebar_position: 2
---

# Overview of Architecture

## System Objectives

The **Student Manager Student** is designed to streamline the management of student information within an educational institution. It provides features for handling student data, academic programs, course enrollments, transcripts, and class registrations in an centralized and use-friendly manner.

## Overall Architecture

The system follows a **client-server architecture**, with a clear separation between the frontend (client) and backend (server). The frontend is developed using **React with TypeScript**, while the backend is built using **NestJS**, following the **modular MVC (Model-View-Control)** design pattern. Data is stored in **MongoDB**.

```
┌─────────────────────┐        ┌─────────────────────┐
│   Frontend (React)  │<──────▶│ API Gateway (NestJS)│
└─────────────────────┘        └─────────────────────┘
                                        │
                                        ▼
                          ┌─────────────────────────────┐
                          │     Backend Services        │
                          │ ┌─────────────────────────┐ │
                          │ │  Student Service        │ │
                          │ │  Faculty Service        │ │
                          │ │  Program Service        │ │
                          │ │  Enrollment Service     │ │
                          │ │  Transcript Service     │ │
                          │ └─────────────────────────┘ │
                          └─────────────┬───────────────┘
                                        │
                                        ▼
                             ┌────────────────────┐
                             │    MongoDB Atlas   │
                             └────────────────────┘
```

## Key Components

### Frontend (React + TypeScript)

-   Built with React and Vite for optimal performance and fast development.

-   Structured using the UI components.

-   Interacts with the backend through RESTful API call (using Axios or Fetch).

-   Implements views and features like student list, course list, enrollment forms, and transcript views.

-   Handles routing, user input validation, and UI state management.

### Backend (NestJS)

-   Developed with **NestJS**, utilizing the **modular** and **MVC** architectural style.

-   Each functional domain is encapsulated in a separate module:

    -   `StudentModule`, `FacultyModule`, `ProgramModule`

    -   `CourseModule`, `EnrollmentModule`,
        `TranscriptModule`

    -   `ImportModule`, `ExportModule`, etc.

-   Each module contains:

    -   **Controller** – Handles HTTP requests.

    -   **Service** – Implements business logic.

    -   **DTOs** – Defines input/output data structures.

    -   **Schemas/Entities** – Defines MongoDB data models.

### Database (MongoDB)

-   A flexible, document-based NoSQL database used for storing unstructured and semi-structured student-related data.

-   Each service module interacts with its own MongoDB collection.

## System Workflow

1. **Users** (e.g., administrators or staff) interact with the system via the **web client**.

2. The **frontend** sends HTTP requests to the **NestJS backend API**.

3. The **backend services** process the logic, communicate with **MongoDB**, and return appropriate responses.

4. The **frontend** renders the data dynamically to the user interface.

## Technology Stack

| Component  | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | React, TypeScript, Vite       |
| Backend    | NestJS, TypeScript            |
| Database   | MongoDB (MongoDB Atlas)       |
| API Format | RESTful APIs                  |
| ORM        | Mongoose                      |
| Dev Tools  | ESLint, Prettier, Git, GitHub |

## Architectural Benefits

-   **Separation of Concerns:** Clear division between client and server logic simplifies development and debugging.

-   **Modular Design:** Backend modules are independently scalable and maintainable.

-   **Scalability:** Easily extendable to support more services (e.g., report generation, authentication).

-   **Cloud-ready:** Can be deployed on cloud services using MongoDB Atlas and containerized backends.

-   **Developer Friendly:** Modern frameworks, static typing, and clear project structure make it easy to onboard new developers.
