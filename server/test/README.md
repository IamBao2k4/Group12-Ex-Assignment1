# Testing Documentation

This directory contains the test files for the Student Management System.

## Test Structure

```
test/
├── unit/               # Unit tests for individual components
│   ├── enrollment/     # Tests for the enrollment module
│   │   ├── enrollment.service.spec.ts
│   │   ├── enrollment.controller.spec.ts
│   │   ├── enrollment.repository.spec.ts
│   │   └── exceptions/
│   │       └── enrollment-exceptions.spec.ts
│   ├── student/        # Tests for the student module
│   │   ├── student.service.spec.ts
│   │   ├── student.controller.spec.ts
│   │   └── student.repository.spec.ts
│   ├── faculty/        # Tests for the faculty module
│   ├── program/        # Tests for the program module
│   └── ...             # Other domain modules
├── e2e/                # End-to-end tests
│   └── app.e2e-spec.ts
└── jest-e2e.json       # Jest configuration for e2e tests
```

## Running Tests

### Unit Tests

To run all unit tests:

```bash
npm test
```

To run tests with watch mode:

```bash
npm run test:watch
```

To run tests with coverage:

```bash
npm run test:cov
```

### E2E Tests

To run end-to-end tests:

```bash
npm run test:e2e
```

## Testing Guidelines

1. **Test Organization**:

   - Follow the same structure as the source code for test files
   - Unit tests should be located next to their respective implementation files
   - Use descriptive test names

2. **Test Coverage**:

   - Aim for 70%+ code coverage
   - Ensure all core business logic is well-tested
   - Focus on testing edge cases and error handling

3. **Test Isolation**:

   - Each test should be independent and not rely on the state from other tests
   - Use mocks for external dependencies
   - Reset state between tests

4. **Mocking**:

   - Use Jest's mocking capabilities for dependencies
   - Mock database calls, external services, etc.
   - For repositories, mock the Mongoose models

5. **AAA Pattern**:
   - Arrange: Set up the test data and conditions
   - Act: Perform the operation being tested
   - Assert: Verify the result meets expectations

## Template Tests

The `student` and `enrollment` modules contain template tests that should be used as a reference when creating tests for other modules. These templates demonstrate:

- Proper dependency injection and mocking
- Testing services, controllers, and repositories
- Error handling and edge cases
- Validation and business logic testing

## Best Practices

1. Write tests before implementing features (TDD) when possible
2. Keep tests small and focused
3. Test both happy paths and error scenarios
4. Use descriptive test names that express what the test is checking
5. Regularly run tests to catch regressions
6. Keep test code clean and maintainable
