---
sidebar_position: 11
---

# Getting Started

This section provides instructions to help developers set up the project on their local machines for developments and testing purposes.

## Prerequisites

Before you begin, make sure you have the following installed:

-   Node.js (v14 or higher)

-   npm (comes with Node.js)

-   MongoDB

-   A code editor (e.g., Visual Studio Code)

## Installation Steps

### Clone the repository:

```js title=bash
git clone https://github.com/IamBao2k4/Group12-Ex-Assignment1.git
cd Group12-Ex-Assignment1
```

### Install dependencies:

```js title=bash
npm install
```

### Create environment configuration:

-   Create a `.env` file in the `migration` directory with the content:

    -   `MONGO_URI=`

-   Create a `.env` file in the `server` directory with the content:

    -   NODE_ENV=development

    -   MONGO_URI_DEV=

    -   MONGO_URI_PROD=

    -   PORT=3001

### Start the server:

-   Open 3 terminals:

    -   Terminal 1:

        ```js title=bash
        cd migration
        npm install
        node migration.js
        ```

    -   Terminal 2:

        ```js title=bash
        cd server
        npm install
        npm run start:dev
        ```

    -   Terminal 3:

        ```js title=bash
        cd client
        npm install
        npm run dev
        ```

### Read Document

```
cd document
npm run start
```

## Project Structure Overview

### Overview

-   Source code consists of 2 main parts: client (frontend) and server (backend)

-   Each section is organized in a modular structure, with each folder representing a separate feature or component.

### Client (Frontend)

-   Using React with TypeScript

-   Directory structure:

    -   `/src`: Contains the main source code of the application

        -   `/components`: UI components used in the application

            -   `/common:` Common components

            -   `/mainInformation`: Components that display main information

            -   `/horizontalNav`: Horizontal navigation bar component

        -   `/assets`: Stores resources such as images, icons

        -   `App.tsx`: The root component of the application

        -   `main.tsx`: The starting point of the application

    -   `/public`: Chứa các tệp tĩnh được phục vụ trực tiếp

    -   Các file cấu hình: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`

### Server (Backend)

-   Using NestJS framework with TypeScript

-   Directory structure:

    -   `/src`: Contains the main source code of the server

        -   `/common`: Common utilities, middleware, and filters

        -   `/config`: Application configuration

        -   `/types`: Defines data types

        -   Functional modules and their tests:

            -   `/student`: Manage student information

            -   `/faculty`: Faculty management

            -   `/program`: Manage learning programs

            -   `/student_status`: Manage student status

            -   `/course`: Course management

            -   `/enrollment`: Manage course registration

            -   `/transcript`: Manage transcripts

            -   `/open_class`: Manage open classes

            -   `/import`: Data import function

            -   `/export`: Data export function

        -   `app.module.ts`: Root module that connects child modules

        -   `main.ts`: The starting point of the server application

    -   `/dist`: Directory containing compiled code

    -   `/test`: Initialize test

    -   Configuration files: `tsconfig.json`, `nest-cli.json`, `.env`

    -   `/uploads`: Store uploaded files

    -   `/exports`: Stores export files

Each module in the server is organized according to the MVC model with separate controller, service, DTO, entity and repository, following the NestJS architecture.
