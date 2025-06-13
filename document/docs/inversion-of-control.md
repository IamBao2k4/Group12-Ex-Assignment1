---
sidebar_position: 7
---

# Inversion of Control & Dependency Injection

Complete guide to **Inversion of Control (IoC)** and **Dependency Injection (DI)** implementation in the Student Management System. This system leverages NestJS's powerful IoC container for dependency management and modular architecture.

## Overview

The Student Management System implements IoC and DI patterns using NestJS's built-in dependency injection container, providing:

- **Loose coupling** between components
- **Testability** through dependency injection
- **Modularity** with clear separation of concerns
- **Scalability** through modular architecture
- **Configuration management** via dependency injection

## Core Concepts

### Inversion of Control (IoC)

IoC is a design principle where the control of object creation and dependency management is transferred from the objects themselves to an external container.

**Benefits:**

- Reduced coupling between components
- Easier testing with mock dependencies
- Centralized dependency management
- Dynamic configuration at runtime

### Dependency Injection (DI)

DI is a technique for implementing IoC where dependencies are "injected" into a class rather than created by the class itself.

**Types implemented:**

- **Constructor Injection** (Primary approach)
- **Property Injection** (Decorators)
- **Interface-based Injection** (Repository pattern)

## NestJS Dependency Injection Container

### Core Decorators

#### `@Injectable()`

Marks a class as a provider that can be managed by the NestJS IoC container.

```typescript
@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository
  ) {}
}
```

**Scope Options:**

```typescript
@Injectable({ scope: Scope.TRANSIENT })  // New instance per injection
@Injectable({ scope: Scope.REQUEST })    // One instance per request
@Injectable()                            // Singleton (default)
```

#### `@Inject()`

Explicitly specifies which dependency to inject using a token.

```typescript
constructor(
  @Inject(STUDENT_REPOSITORY)
  private readonly studentRepository: IStudentRepository,
  @Inject(forwardRef(() => FacultyService))
  private readonly facultyService: FacultyService,
) {}
```

#### `@Module()`

Defines a module and its dependencies, providers, and exports.

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Student", schema: StudentSchema }]),
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentRepository,
    },
  ],
  exports: [StudentService],
})
export class StudentModule {}
```

## Dependency Injection Patterns

### 1. Repository Pattern with Interface Segregation

**Interface Definition:**

```typescript
// student/repositories/student.repository.interface.ts
export const STUDENT_REPOSITORY = "STUDENT_REPOSITORY";

export interface IStudentRepository {
  create(studentData: any): Promise<Student>;
  findById(id: string): Promise<Student | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResponse<Student>>;
  update(id: string, data: Partial<Student>): Promise<Student | null>;
  softDelete(id: string): Promise<Student | null>;
}
```

**Implementation:**

```typescript
// student/repositories/student.repository.ts
@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(@InjectModel("Student") private studentModel: Model<Student>) {}

  async create(studentData: any): Promise<Student> {
    const student = new this.studentModel(studentData);
    return student.save();
  }
  // ... other methods
}
```

**Module Configuration:**

```typescript
@Module({
  providers: [
    {
      provide: STUDENT_REPOSITORY, // Token
      useClass: StudentRepository, // Implementation
    },
  ],
})
export class StudentModule {}
```

**Service Injection:**

```typescript
@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository
  ) {}
}
```

### 2. Circular Dependency Resolution

Using `forwardRef()` to handle circular dependencies between modules:

```typescript
@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(forwardRef(() => FacultyService))
    private readonly facultyService: FacultyService,
    @Inject(forwardRef(() => ProgramService))
    private readonly programService: ProgramService
  ) {}
}
```

**Module Level:**

```typescript
@Module({
  imports: [forwardRef(() => FacultyModule), forwardRef(() => ProgramModule)],
  // ... providers, controllers
})
export class StudentModule {}
```

### 3. Database Model Injection

Using `@InjectModel()` for MongoDB models:

```typescript
@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(@InjectModel("Student") private studentModel: Model<Student>) {}

  async findById(id: string): Promise<Student | null> {
    return this.studentModel.findById(id).exec();
  }
}
```

### 4. Configuration Service Injection

Injecting configuration services for environment-specific settings:

```typescript
@Injectable()
export class EmailDomainValidator implements ValidatorConstraintInterface {
  constructor(private configService: ConfigService) {}

  validate(email: string): boolean {
    const allowedDomains = this.configService.get<string[]>(
      "validation.email.allowedDomains"
    );
    return allowedDomains.some((domain) => email.endsWith(domain));
  }
}
```

### 5. Multi-Dependency Injection

Complex services with multiple dependencies:

```typescript
@Injectable()
export class ExportService {
  constructor(
    @InjectModel("Student") private studentModel: Model<Student>,
    private readonly facultyService: FacultyService,
    private readonly programService: ProgramService,
    private readonly studentStatusService: StudentStatusService
  ) {}
}
```

## Module Architecture

### Module Hierarchy

```
AppModule (Root)
├── ConfigModule (Global)
├── MongooseModule (Database)
├── StudentModule
│   ├── StudentController
│   ├── StudentService
│   ├── StudentRepository
│   └── Custom Validators
├── FacultyModule
├── ProgramModule
├── CourseModule
├── EnrollmentModule
├── TranscriptModule
├── OpenClassModule
└── Common Modules
    ├── Logger
    ├── Exception Filters
    └── Interceptors
```

### Provider Types

#### 1. Class Providers

```typescript
providers: [
  StudentService, // Shorthand for { provide: StudentService, useClass: StudentService }
];
```

#### 2. Value Providers

```typescript
providers: [
  {
    provide: "APP_CONFIG",
    useValue: {
      apiUrl: "http://localhost:3000",
      timeout: 5000,
    },
  },
];
```

#### 3. Factory Providers

```typescript
providers: [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: (configService: ConfigService) => {
      return createDatabaseConnection(configService.get("DATABASE_URL"));
    },
    inject: [ConfigService],
  },
];
```

#### 4. Interface-based Providers

```typescript
providers: [
  {
    provide: STUDENT_REPOSITORY,
    useClass: StudentRepository,
  },
];
```

## Dependency Injection Tokens

### String Tokens

```typescript
export const STUDENT_REPOSITORY = "STUDENT_REPOSITORY";
export const FACULTY_REPOSITORY = "FACULTY_REPOSITORY";
export const COURSE_REPOSITORY = "COURSE_REPOSITORY";
```

### Symbol Tokens (Alternative)

```typescript
export const STUDENT_REPOSITORY = Symbol("STUDENT_REPOSITORY");
```

### Custom Injection Tokens

```typescript
import { InjectionToken } from "@nestjs/common";

export const DATABASE_CONFIG = new InjectionToken("DATABASE_CONFIG");
```

## Practical Examples

### 1. Complete Service Implementation

```typescript
@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(forwardRef(() => FacultyService))
    private readonly facultyService: FacultyService,
    @Inject(forwardRef(() => ProgramService))
    private readonly programService: ProgramService,
    @Inject(forwardRef(() => StudentStatusService))
    private readonly studentStatusService: StudentStatusService
  ) {}

  async create(studentData: CreateStudentDto): Promise<Student> {
    // Validate related entities exist
    await this.validateFacultyExists(studentData.khoa);
    await this.validateProgramExists(studentData.chuong_trinh);
    await this.validateStudentStatusExists(studentData.tinh_trang);

    return this.studentRepository.create(studentData);
  }

  private async validateFacultyExists(facultyId: string): Promise<void> {
    const faculty = await this.facultyService.getById(facultyId);
    if (!faculty) {
      throw new FacultyNotExistsException(facultyId);
    }
  }
}
```

### 2. Controller with Service Injection

```typescript
@Controller("students")
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly transcriptService: TranscriptService
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get(":id/transcripts")
  async getTranscripts(@Param("id") id: string) {
    return this.transcriptService.findByStudentId(id);
  }
}
```

### 3. Repository with Model Injection

```typescript
@Injectable()
export class OpenClassRepository implements IOpenClassRepository {
  constructor(
    @InjectModel("OpenClass") private openClassModel: Model<OpenClass>,
    @InjectModel("Transcript") private transcriptModel: Model<Transcript>,
    @InjectModel("Course") private courseModel: Model<Course>,
    @InjectModel("Student") private studentModel: Model<Student>,
    @InjectModel("Enrollment") private enrollmentModel: Model<Enrollment>
  ) {}

  async create(openClassData: any): Promise<OpenClass> {
    const openClass = new this.openClassModel(openClassData);
    return openClass.save();
  }
}
```

## Testing with Dependency Injection

### Unit Testing with Mocks

```typescript
describe("StudentService", () => {
  let service: StudentService;
  let repository: IStudentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: STUDENT_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            // ... other mocked methods
          },
        },
        {
          provide: FacultyService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get<IStudentRepository>(STUDENT_REPOSITORY);
  });

  it("should create a student", async () => {
    const studentData = {
      /* test data */
    };
    repository.create = jest.fn().mockResolvedValue(studentData);

    const result = await service.create(studentData);
    expect(result).toEqual(studentData);
  });
});
```

### Integration Testing

```typescript
describe("StudentController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/students (POST)", () => {
    return request(app.getHttpServer())
      .post("/students")
      .send(studentData)
      .expect(201);
  });
});
```

## Global Providers

### Exception Filters

```typescript
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

### Interceptors

```typescript
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiLoggerInterceptor,
    },
  ],
})
export class AppModule {}
```

### Configuration

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class AppModule {}
```

## Best Practices

### 1. Interface Segregation

Create specific interfaces for different use cases:

```typescript
export interface IStudentReader {
  findById(id: string): Promise<Student | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResponse<Student>>;
}

export interface IStudentWriter {
  create(data: CreateStudentDto): Promise<Student>;
  update(id: string, data: UpdateStudentDto): Promise<Student | null>;
  delete(id: string): Promise<void>;
}

export interface IStudentRepository extends IStudentReader, IStudentWriter {
  // Combines both interfaces
}
```

### 2. Dependency Token Management

Centralize tokens in a constants file:

```typescript
// constants/injection-tokens.ts
export const REPOSITORIES = {
  STUDENT: "STUDENT_REPOSITORY",
  FACULTY: "FACULTY_REPOSITORY",
  COURSE: "COURSE_REPOSITORY",
} as const;
```

### 3. Async Provider Configuration

```typescript
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("mongodb.uri"),
      }),
    }),
  ],
})
export class AppModule {}
```

### 4. Conditional Provider Registration

```typescript
const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: (configService: ConfigService) => {
      const env = configService.get("NODE_ENV");
      if (env === "test") {
        return createTestDatabase();
      }
      return createProductionDatabase();
    },
    inject: [ConfigService],
  },
];
```

## Common Patterns

### 1. Factory Pattern with DI

```typescript
@Injectable()
export class DocumentFactory {
  createDocument(type: string, data: any): IDDocument {
    switch (type) {
      case "cccd":
        return new CCCDDocument(data);
      case "cmnd":
        return new CMNDDocument(data);
      case "passport":
        return new PassportDocument(data);
      default:
        throw new Error("Unknown document type");
    }
  }
}
```

### 2. Strategy Pattern with DI

```typescript
@Injectable()
export class ExportStrategy {
  constructor(
    private readonly excelExporter: ExcelExporter,
    private readonly csvExporter: CsvExporter
  ) {}

  export(format: "excel" | "csv", data: any[]) {
    switch (format) {
      case "excel":
        return this.excelExporter.export(data);
      case "csv":
        return this.csvExporter.export(data);
    }
  }
}
```

### 3. Observer Pattern with DI

```typescript
@Injectable()
export class StudentEventService {
  constructor(
    private readonly emailService: EmailService,
    private readonly auditService: AuditService
  ) {}

  async onStudentCreated(student: Student) {
    await Promise.all([
      this.emailService.sendWelcomeEmail(student.email),
      this.auditService.logStudentCreation(student.id),
    ]);
  }
}
```

## Performance Considerations

### 1. Scope Management

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  // New instance for each injection
}

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  // One instance per HTTP request
}

@Injectable() // Default: Singleton
export class SingletonService {
  // One instance for the entire application
}
```

### 2. Lazy Loading

```typescript
@Module({
  imports: [
    // Lazy load heavy modules
    () =>
      import("./heavy-feature/heavy-feature.module").then(
        (m) => m.HeavyFeatureModule
      ),
  ],
})
export class AppModule {}
```

### 3. Circular Dependency Optimization

```typescript
// Use forwardRef only when necessary
@Inject(forwardRef(() => FacultyService))
private readonly facultyService: FacultyService;

// Consider redesigning to avoid circular dependencies
```

This IoC and DI implementation provides a robust, testable, and maintainable architecture for the Student Management System, ensuring loose coupling and high cohesion throughout the application.
