---
sidebar_position: 9
---

# Unit Testing

## Giới thiệu

Unit testing là một phần quan trọng trong việc đảm bảo chất lượng code của hệ thống Student Management. Document này hướng dẫn cách viết và chạy unit test cho các module trong backend sử dụng Jest testing framework.

## Cấu trúc Test

### Tổ chức File Test

Mỗi module trong hệ thống có các file test riêng theo cấu trúc:

```
src/
├── student/
│   ├── student.controller.spec.ts
│   ├── student.service.spec.ts
│   └── student.repository.spec.ts
├── faculty/
│   ├── faculty.controller.spec.ts
│   ├── faculty.service.spec.ts
│   └── faculty.repository.spec.ts
└── ...
```

### Test File Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

describe('ServiceName', () => {
  let service: ServiceName;
  let mockRepository: any;
  
  beforeEach(async () => {
    // Mock dependencies
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        {
          provide: REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    
    // Mock logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test cases here
});
```

## Viết Unit Test

### Test Service Methods

#### Test Create Method

```typescript
describe('create', () => {
  it('should create a new student successfully', async () => {
    // Arrange
    const studentData = {
      ho_ten: 'Nguyen Van A',
      ma_so_sinh_vien: 'SV001',
      email: 'student@example.com',
      so_dien_thoai: '0123456789',
      khoa: 'faculty-id',
      chuong_trinh: 'program-id',
      tinh_trang: 'status-id',
      ngay_sinh: new Date('2000-01-01'),
      gioi_tinh: 'Nam',
      dia_chi: '123 ABC Street',
    };
    
    const expectedResult = {
      _id: 'new-student-id',
      ...studentData,
    };
    
    mockRepository.create.mockResolvedValue(expectedResult);
    mockRepository.findByMSSV.mockResolvedValue(null);
    mockRepository.findByEmailOrPhone.mockResolvedValue(null);

    // Act
    const result = await service.create(studentData);

    // Assert
    expect(mockRepository.create).toHaveBeenCalledWith(studentData);
    expect(result).toEqual(expectedResult);
  });

  it('should throw error if MSSV already exists', async () => {
    // Arrange
    const studentData = {
      ma_so_sinh_vien: 'SV001',
      // ... other fields
    };
    
    mockRepository.findByMSSV.mockResolvedValue({ _id: 'existing-id' });

    // Act & Assert
    await expect(service.create(studentData))
      .rejects
      .toThrow(StudentIdExistsException);
  });
});
```

#### Test Update Method

```typescript
describe('update', () => {
  it('should update student successfully', async () => {
    // Arrange
    const studentId = '507f1f77bcf86cd799439011';
    const updateData = {
      ho_ten: 'Updated Name',
      dia_chi: 'New Address'
    };
    
    const currentStudent = {
      _id: studentId,
      ho_ten: 'Old Name',
      ma_so_sinh_vien: 'SV001',
      tinh_trang: 'status-id'
    };
    
    const expectedResult = {
      ...currentStudent,
      ...updateData
    };
    
    mockRepository.findById.mockResolvedValue(currentStudent);
    mockRepository.update.mockResolvedValue(expectedResult);

    // Act
    const result = await service.update(studentId, updateData);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(studentId);
    expect(mockRepository.update).toHaveBeenCalledWith(studentId, updateData);
    expect(result).toEqual(expectedResult);
  });

  it('should validate status transition', async () => {
    // Test status transition logic
    const studentId = '507f1f77bcf86cd799439011';
    const updateData = {
      tinh_trang: 'new-status-id'
    };
    
    const currentStudent = {
      _id: studentId,
      tinh_trang: 'current-status-id'
    };
    
    mockRepository.findById.mockResolvedValue(currentStudent);
    mockStudentStatusService.detail
      .mockResolvedValueOnce({ tinh_trang: { vi: 'Đang học' } })
      .mockResolvedValueOnce({ tinh_trang: { vi: 'Tốt nghiệp' } });
    
    // Mock invalid transition
    jest.spyOn(service as any, 'isValidStatusTransition')
      .mockResolvedValue(false);

    // Act & Assert
    await expect(service.update(studentId, updateData))
      .rejects
      .toThrow(InvalidStatusTransitionException);
  });
});
```

### Test Controller Methods

```typescript
describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;
  let transcriptService: TranscriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            detail: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: TranscriptService,
          useValue: {
            findByStudentId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
    transcriptService = module.get<TranscriptService>(TranscriptService);
  });

  describe('GET /students', () => {
    it('should return paginated students', async () => {
      // Arrange
      const query = { page: 1, limit: 10 };
      const expectedResult = {
        data: [{ _id: '1', ho_ten: 'Student 1' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      
      jest.spyOn(service, 'get').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.get(query, '', '', 1);

      // Assert
      expect(service.get).toHaveBeenCalledWith(query, '', '', 1);
      expect(result).toEqual(expectedResult);
    });
  });
});
```

## Mock Dependencies

### Mock Repository

```typescript
const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
});
```

### Mock External Services

```typescript
// Mock Faculty Service
const mockFacultyService = {
  detail: jest.fn().mockImplementation((id) => {
    if (id === 'valid-faculty-id') {
      return Promise.resolve({
        _id: id,
        ten_khoa: { vi: 'Khoa CNTT', en: 'IT Faculty' }
      });
    }
    throw new FacultyNotFoundException(id);
  }),
};

// Mock Program Service
const mockProgramService = {
  detail: jest.fn().mockImplementation((id) => {
    if (id === 'valid-program-id') {
      return Promise.resolve({
        _id: id,
        ten_chuong_trinh: 'Kỹ sư phần mềm'
      });
    }
    throw new ProgramNotFoundException(id);
  }),
};
```

### Mock Validation Utils

```typescript
// Mock isValidObjectId
jest.mock('../common/utils/validation.util', () => ({
  isValidObjectId: jest.fn().mockImplementation((id) => {
    // Simple ObjectId validation mock
    return /^[0-9a-fA-F]{24}$/.test(id);
  }),
}));
```

## Test Validation và Error Handling

### Test Input Validation

```typescript
describe('validation', () => {
  it('should validate email format', async () => {
    const invalidData = {
      ho_ten: 'Test Student',
      email: 'invalid-email',
      // ... other fields
    };

    await expect(service.create(invalidData))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should validate phone number format', async () => {
    const invalidData = {
      ho_ten: 'Test Student',
      so_dien_thoai: '123', // Too short
      // ... other fields
    };

    await expect(service.create(invalidData))
      .rejects
      .toThrow(BadRequestException);
  });
});
```

### Test Error Handling

```typescript
describe('error handling', () => {
  it('should handle database errors', async () => {
    // Arrange
    const dbError = new Error('Database connection failed');
    dbError.name = 'MongoError';
    mockRepository.create.mockRejectedValue(dbError);

    // Act & Assert
    await expect(service.create({}))
      .rejects
      .toThrow(InternalServerErrorException);
  });

  it('should handle not found errors', async () => {
    // Arrange
    const invalidId = 'invalid-id';
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(service.detail(invalidId))
      .rejects
      .toThrow(StudentNotFoundException);
  });
});
```

## Running Tests

### Run All Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Run Specific Tests

```bash
# Run tests for a specific file
npm test student.service.spec.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should create"

# Run tests for a specific module
npm test -- student/
```

### Test Coverage

```bash
# Generate coverage report
npm run test:cov

# Coverage thresholds in package.json
"jest": {
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## Best Practices

### 1. Test Structure

- Sử dụng pattern **Arrange-Act-Assert** (AAA)
- Group related tests với `describe` blocks
- Sử dụng descriptive test names

### 2. Mocking

- Mock external dependencies
- Reset mocks trong `afterEach`
- Sử dụng `jest.spyOn` cho partial mocking

### 3. Async Testing

```typescript
// Use async/await
it('should handle async operations', async () => {
  const result = await service.asyncMethod();
  expect(result).toBeDefined();
});

// Test rejected promises
it('should throw on error', async () => {
  await expect(service.methodThatThrows())
    .rejects
    .toThrow(ExpectedError);
});
```

### 4. Test Data

```typescript
// Create test data factories
const createTestStudent = (overrides = {}) => ({
  ho_ten: 'Test Student',
  ma_so_sinh_vien: 'SV001',
  email: 'test@student.edu.vn',
  so_dien_thoai: '0123456789',
  ngay_sinh: new Date('2000-01-01'),
  gioi_tinh: 'Nam',
  dia_chi: 'Test Address',
  ...overrides
});

// Use in tests
const studentData = createTestStudent({ ho_ten: 'Custom Name' });
```

## Integration Testing

### Test Database Integration

```typescript
describe('StudentRepository Integration', () => {
  let connection: Connection;
  let repository: StudentRepository;

  beforeAll(async () => {
    connection = await createTestConnection();
    repository = new StudentRepository(connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create and retrieve student', async () => {
    // Arrange
    const studentData = createTestStudent();

    // Act
    const created = await repository.create(studentData);
    const retrieved = await repository.findById(created._id);

    // Assert
    expect(retrieved).toMatchObject(studentData);
  });
});
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Check import paths
   - Ensure all dependencies are mocked

2. **Timeout errors**
   - Increase jest timeout: `jest.setTimeout(10000)`
   - Check for unresolved promises

3. **Mock not working**
   - Verify mock is defined before module creation
   - Check mock function names match actual methods

### Debug Tips

```typescript
// Enable debug logging
console.log('Mock calls:', mockRepository.create.mock.calls);

// Check if mock was called
expect(mockRepository.create).toHaveBeenCalled();
expect(mockRepository.create).toHaveBeenCalledTimes(1);

// Inspect mock arguments
expect(mockRepository.create).toHaveBeenCalledWith(
  expect.objectContaining({
    ho_ten: 'Expected Name'
  })
);
```

## Conclusion

Unit testing là essential cho việc maintain code quality trong Student Management System. Follow các best practices và patterns trong document này để ensure tests are reliable và maintainable.

## See Also

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Overview of Architecture](./overview-of-architecture.md)
