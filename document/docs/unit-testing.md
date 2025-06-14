---
sidebar_position: 9
---

# Unit Testing

A comprehensive guide to writing and running unit tests in the **Student Manager System** using Jest and NestJS testing utilities.

## Overview

Unit testing ensures code quality and reliability throughout the application. This guide covers testing patterns for both **backend (NestJS)** and **frontend (React)** components.

## Backend Testing (NestJS)

### Test Environment Setup

The project uses **Jest** as the testing framework with the following configuration:

```json title="jest.config.js"
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

### Service Testing Pattern

Here's the standard pattern for testing services in our application:

```typescript title="student.service.spec.ts"
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { STUDENT_REPOSITORY } from './repositories/student.repository.interface';

describe('StudentService', () => {
  let service: StudentService;
  let mockRepository: any;
  let mockFacultyService: any;
  let mockProgramService: any;
  let mockStudentStatusService: any;

  beforeEach(async () => {
    // Mock dependencies
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      findByMSSV: jest.fn().mockResolvedValue(null),
      findByEmailOrPhone: jest.fn().mockResolvedValue(null),
    };

    mockFacultyService = {
      detail: jest.fn().mockResolvedValue({ _id: 'faculty-id', name: 'Faculty' }),
    };

    // Set up testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: STUDENT_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: FacultyService,
          useValue: mockFacultyService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      // Arrange
      const studentData = {
        ho_ten: 'Nguyen Van A',
        ma_so_sinh_vien: 'SV001',
        email: 'student@example.com',
        so_dien_thoai: '0123456789',
        khoa: 'faculty-id',
        chuong_trinh: 'program-id',
        tinh_trang: 'status-id',
      };
      
      const expectedResult = {
        _id: 'new-student-id',
        ...studentData,
      };
      
      mockRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(studentData);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(studentData);
      expect(result).toEqual(expectedResult);
    });
  });
});
```

### Controller Testing Pattern

```typescript title="student.controller.spec.ts"
import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './services/student.service';

describe('StudentController', () => {
  let controller: StudentController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      get: jest.fn(),
      create: jest.fn(),
      detail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  describe('findAll', () => {
    it('should return paginated students', async () => {
      // Arrange
      const expectedResult = {
        data: [{ _id: '1', ho_ten: 'Student 1' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockService.get.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll(1, 10, '', '');

      // Assert
      expect(mockService.get).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        '',
        ''
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
```

### Testing Validation

Testing DTOs with validation decorators:

```typescript title="student.dto.spec.ts"
import { validate } from 'class-validator';
import { CreateStudentDto } from './student.dto';

describe('CreateStudentDto', () => {
  it('should fail validation with invalid email', async () => {
    // Arrange
    const dto = new CreateStudentDto();
    dto.email = 'invalid-email';
    dto.ho_ten = 'Test Student';
    dto.ma_so_sinh_vien = 'SV001';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should pass validation with valid data', async () => {
    // Arrange
    const dto = new CreateStudentDto();
    dto.email = 'student@university.edu.vn';
    dto.ho_ten = 'Test Student';
    dto.ma_so_sinh_vien = 'SV001';
    dto.so_dien_thoai = '0123456789';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
```

### Testing MongoDB Schemas

```typescript title="student.schema.spec.ts"
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.schema';

describe('Student Schema', () => {
  let studentModel: Model<Student>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Student.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    studentModel = module.get<Model<Student>>(getModelToken(Student.name));
  });

  it('should be defined', () => {
    expect(studentModel).toBeDefined();
  });
});
```

## Frontend Testing (React + TypeScript)

### Component Testing

```typescript title="StudentList.test.tsx"
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StudentList } from './StudentList';
import { studentService } from '../../services/student.service';

jest.mock('../../services/student.service');

describe('StudentList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render student list', async () => {
    // Arrange
    const mockStudents = [
      { _id: '1', ho_ten: 'Nguyen Van A', ma_so_sinh_vien: 'SV001' },
      { _id: '2', ho_ten: 'Tran Thi B', ma_so_sinh_vien: 'SV002' },
    ];
    
    (studentService.getAll as jest.Mock).mockResolvedValue({
      data: mockStudents,
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });

    // Act
    render(<StudentList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
      expect(screen.getByText('Tran Thi B')).toBeInTheDocument();
    });
  });

  it('should handle search functionality', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<StudentList />);

    // Act
    const searchInput = screen.getByPlaceholderText('Search students...');
    await user.type(searchInput, 'Nguyen');

    // Assert
    await waitFor(() => {
      expect(studentService.getAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        searchString: 'Nguyen',
      });
    });
  });
});
```

### Service Testing

```typescript title="student.service.test.ts"
import axios from 'axios';
import { studentService } from './student.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('StudentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch students with pagination', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: [{ _id: '1', ho_ten: 'Test Student' }],
          meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      // Act
      const result = await studentService.getAll({ page: 1, limit: 10 });

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('/students', {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('create', () => {
    it('should create a new student', async () => {
      // Arrange
      const studentData = {
        ho_ten: 'New Student',
        ma_so_sinh_vien: 'SV003',
        email: 'newstudent@example.com',
      };
      const mockResponse = { data: { _id: '3', ...studentData } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      // Act
      const result = await studentService.create(studentData);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith('/students', studentData);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

## Running Tests

### Backend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test student.service.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create"
```

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test suite
npm test StudentList.test.tsx
```

## Test Coverage

### Coverage Requirements

| Component         | Minimum Coverage |
| ----------------- | --------------- |
| Services          | 80%             |
| Controllers       | 70%             |
| DTOs/Schemas      | 60%             |
| Utility Functions | 90%             |
| React Components  | 70%             |

### Viewing Coverage Reports

```bash
# Backend coverage
npm run test:cov
# Open coverage/lcov-report/index.html

# Frontend coverage
npm test -- --coverage --watchAll=false
# Open coverage/lcov-report/index.html
```

## Mocking Best Practices

### Mocking MongoDB Operations

```typescript
// Mock repository pattern
const mockRepository = {
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
  }),
};
```

### Mocking External Services

```typescript
// Mock external API calls
jest.mock('../common/utils/external-api', () => ({
  fetchExternalData: jest.fn().mockResolvedValue({ data: 'mocked' }),
}));
```

### Mocking File Operations

```typescript
// Mock file upload
const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });
const mockMulterFile = {
  fieldname: 'file',
  originalname: 'test.csv',
  encoding: '7bit',
  mimetype: 'text/csv',
  buffer: Buffer.from('content'),
  size: 7,
};
```

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  // Using async/await
  const result = await service.asyncMethod();
  expect(result).toBeDefined();

  // Using promises
  return service.asyncMethod().then(result => {
    expect(result).toBeDefined();
  });
});
```

### Testing Error Handling

```typescript
it('should handle errors gracefully', async () => {
  // Arrange
  mockRepository.findById.mockRejectedValue(new Error('Database error'));

  // Act & Assert
  await expect(service.detail('invalid-id')).rejects.toThrow('Database error');
});
```

### Testing Validation Errors

```typescript
it('should throw BadRequestException for invalid data', async () => {
  // Arrange
  const invalidData = { email: 'invalid' };

  // Act & Assert
  await expect(controller.create(invalidData)).rejects.toThrow(BadRequestException);
});
```

## CI/CD Integration

### GitHub Actions Configuration

```yaml title=".github/workflows/test.yml"
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: |
          cd server && npm install
          cd ../client && npm install
          
      - name: Run backend tests
        run: cd server && npm test
        
      - name: Run frontend tests
        run: cd client && npm test -- --watchAll=false
```

## Troubleshooting

### Common Issues

**MongoDB Memory Server Issues**
```typescript
// Use in-memory database for tests
beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
```

**Timeout Issues**
```typescript
// Increase timeout for slow operations
jest.setTimeout(30000); // 30 seconds
```

**Module Import Errors**
```typescript
// Configure module name mapper in jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

## Best Practices Summary

1. **Write tests first** - Follow TDD when possible
2. **Test behavior, not implementation** - Focus on what the code does
3. **Keep tests simple and readable** - One assertion per test when possible
4. **Use descriptive test names** - Should explain what is being tested
5. **Mock external dependencies** - Isolate the unit being tested
6. **Clean up after tests** - Use afterEach to reset state
7. **Test edge cases** - Include boundary conditions and error scenarios
8. **Maintain test coverage** - Aim for high coverage but focus on quality

## See Also

- [Coding Standard](./coding-standard.md)
- [API Documentation](./api-documentation.md)
- [Source Code Organization](./source-code-organization.md)
