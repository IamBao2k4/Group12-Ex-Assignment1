---
sidebar_position: 10
---

# Registering New Routes

Learn how to register and configure new routes in the **Student Manager System** using NestJS decorators and routing patterns.

## Overview

The application uses NestJS's built-in routing system with decorators to define RESTful API endpoints. Routes are organized by modules following a domain-driven design approach.

## Route Structure

### Base API Prefix

All API routes are prefixed with `/api` as configured in the main application:

```typescript title="main.ts"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global API prefix
  app.setGlobalPrefix('api');
  
  // Enable CORS
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true,
  });
  
  await app.listen(process.env.PORT || 3000);
}
```

## Creating Routes in Controllers

### Basic Route Registration

```typescript title="student/student.controller.ts"
import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students with pagination' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('searchString') searchString?: string,
    @Query('faculty') faculty?: string,
  ) {
    return this.studentService.get({ page, limit }, searchString, faculty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  async findOne(@Param('id') id: string) {
    return this.studentService.detail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student information' })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  async remove(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}
```

### Nested Routes

For related resources, create nested routes:

```typescript title="student/student.controller.ts"
@Controller('students')
export class StudentController {
  // Get student's transcripts
  @Get(':id/transcripts')
  @ApiOperation({ summary: 'Get transcripts for a specific student' })
  async getTranscripts(@Param('id') studentId: string) {
    return this.transcriptService.findByStudent(studentId);
  }

  // Get student's enrollments
  @Get(':id/enrollments')
  @ApiOperation({ summary: 'Get enrollments for a specific student' })
  async getEnrollments(
    @Param('id') studentId: string,
    @Query('semester') semester?: number,
    @Query('year') year?: number,
  ) {
    return this.enrollmentService.findByStudent(studentId, { semester, year });
  }

  // Get student's open classes
  @Get(':id/classes')
  @ApiOperation({ summary: 'Get open classes for a specific student' })
  async getClasses(@Param('id') studentId: string) {
    return this.openClassService.findByStudent(studentId);
  }
}
```

## Route Parameters and Validation

### Path Parameters

```typescript
// Single parameter
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.studentService.detail(id);
}

// Multiple parameters
@Get(':facultyId/programs/:programId')
async findByFacultyAndProgram(
  @Param('facultyId') facultyId: string,
  @Param('programId') programId: string,
) {
  return this.studentService.findByFacultyAndProgram(facultyId, programId);
}
```

### Query Parameters

```typescript
@Get()
async findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('sort') sort?: string,
  @Query('order') order?: 'asc' | 'desc',
) {
  return this.studentService.findAll({ page, limit, sort, order });
}
```

### Request Body Validation

```typescript
import { IsNotEmpty, IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(100)
  ho_ten: string;

  @IsNotEmpty({ message: 'Student ID is required' })
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Student ID must contain only uppercase letters and numbers',
  })
  ma_so_sinh_vien: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsPhoneNumber('VN', { message: 'Invalid phone number format' })
  @IsOptional()
  so_dien_thoai?: string;

  @IsMongoId({ message: 'Invalid Faculty ID format' })
  @IsOptional()
  khoa?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  dia_chi?: AddressDto;
}

// In controller
@Post()
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
}))
async create(@Body() createStudentDto: CreateStudentDto) {
  return this.studentService.create(createStudentDto);
}
```

## Custom Routes

### File Upload Routes

```typescript title="import/import.controller.ts"
@Controller('import')
export class ImportController {
  @Post('csv')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(csv)$/)) {
        return cb(new BadRequestException('Only CSV files are allowed'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  }))
  @ApiOperation({ summary: 'Import students from CSV file' })
  @ApiConsumes('multipart/form-data')
  async importCSV(@UploadedFile() file: Express.Multer.File) {
    return this.importService.processCSV(file.path);
  }
}
```

### Export Routes

```typescript title="export/export.controller.ts"
@Controller('export')
export class ExportController {
  @Get('students/excel')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=students.xlsx')
  @ApiOperation({ summary: 'Export students to Excel file' })
  async exportStudentsExcel(@Res() res: Response) {
    const buffer = await this.exportService.exportStudentsToExcel();
    res.send(buffer);
  }

  @Get('students/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=students.csv')
  @ApiOperation({ summary: 'Export students to CSV file' })
  async exportStudentsCSV(@Res() res: Response) {
    const csv = await this.exportService.exportStudentsToCSV();
    res.send(csv);
  }
}
```

## Route Guards and Middleware

### Authentication Guard (Future Implementation)

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Add authentication logic here
    return true;
  }
}

// Apply to routes
@UseGuards(AuthGuard)
@Controller('admin/students')
export class AdminStudentController {
  @Get()
  @Roles('admin', 'manager')
  async getAllStudents() {
    return this.studentService.findAll();
  }
}
```

### Request Logging Middleware

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}

// Apply in module
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```

## Route Organization Best Practices

### Module-Based Organization

Each domain has its own module with routes:

```
src/
├── student/
│   ├── student.controller.ts
│   ├── student.service.ts
│   └── student.module.ts
├── faculty/
│   ├── faculty.controller.ts
│   ├── faculty.service.ts
│   └── faculty.module.ts
└── course/
    ├── course.controller.ts
    ├── course.service.ts
    └── course.module.ts
```

### Route Naming Conventions

Follow RESTful naming conventions:

| HTTP Method | Route Pattern          | Action         | Example                      |
| ----------- | --------------------- | -------------- | ---------------------------- |
| GET         | `/resources`          | List all       | `GET /api/students`          |
| GET         | `/resources/:id`      | Get one        | `GET /api/students/123`      |
| POST        | `/resources`          | Create new     | `POST /api/students`         |
| PATCH       | `/resources/:id`      | Update partial | `PATCH /api/students/123`    |
| PUT         | `/resources/:id`      | Update full    | `PUT /api/students/123`      |
| DELETE      | `/resources/:id`      | Delete         | `DELETE /api/students/123`   |

### Versioning Strategy

For API versioning (future implementation):

```typescript
// Version in URL
@Controller('v1/students')
export class StudentV1Controller {}

@Controller('v2/students')
export class StudentV2Controller {}

// Version in header
@Controller('students')
export class StudentController {
  @Get()
  @Version('1')
  findAllV1() {}

  @Get()
  @Version('2')
  findAllV2() {}
}
```

## Swagger Documentation

All routes are automatically documented with Swagger:

```typescript title="main.ts"
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Student Manager API')
    .setDescription('API documentation for Student Management System')
    .setVersion('1.0')
    .addTag('students')
    .addTag('faculties')
    .addTag('courses')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
```

Access documentation at: `http://localhost:3000/api/docs`

## Adding a New Route Module

### Step 1: Create the Module Structure

```bash
# Create new module
nest g module attendance
nest g controller attendance
nest g service attendance
```

### Step 2: Define the Schema

```typescript title="attendance/schemas/attendance.schema.ts"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Attendance extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'OpenClass', required: true })
  class: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: ['present', 'absent', 'late'], required: true })
  status: string;

  @Prop()
  notes?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
```

### Step 3: Create DTOs

```typescript title="attendance/dto/create-attendance.dto.ts"
import { IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Student ID' })
  student: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Class ID' })
  class: string;

  @IsDateString()
  @ApiProperty({ description: 'Attendance date' })
  date: string;

  @IsEnum(['present', 'absent', 'late'])
  @ApiProperty({ enum: ['present', 'absent', 'late'] })
  status: string;

  @IsOptional()
  @ApiProperty({ required: false })
  notes?: string;
}
```

### Step 4: Implement the Controller

```typescript title="attendance/attendance.controller.ts"
@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Record attendance' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get attendance by class' })
  findByClass(
    @Param('classId') classId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findByClass(classId, date);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get attendance by student' })
  findByStudent(
    @Param('studentId') studentId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.findByStudent(studentId, { from, to });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance record' })
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }
}
```

### Step 5: Register in App Module

```typescript title="app.module.ts"
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    // ... other modules
    AttendanceModule,
  ],
})
export class AppModule {}
```

## Testing Routes

### Using Thunder Client or Postman

```json
// POST /api/students
{
  "ho_ten": "Nguyen Van Test",
  "ma_so_sinh_vien": "SV12345",
  "email": "test@student.edu.vn",
  "so_dien_thoai": "0123456789",
  "khoa": "507f1f77bcf86cd799439011",
  "chuong_trinh": "507f1f77bcf86cd799439012",
  "tinh_trang": "507f1f77bcf86cd799439013"
}

// GET /api/students?page=1&limit=10&searchString=Nguyen&faculty=507f1f77bcf86cd799439011
```

### Using cURL

```bash
# Create a student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"ho_ten":"Test Student","ma_so_sinh_vien":"SV999"}'

# Get students with pagination
curl "http://localhost:3000/api/students?page=1&limit=10"

# Update a student
curl -X PATCH http://localhost:3000/api/students/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"ho_ten":"Updated Name"}'
```

### E2E Testing

```typescript title="test/student.e2e-spec.ts"
describe('StudentController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/students (GET)', () => {
    return request(app.getHttpServer())
      .get('/students')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
      });
  });

  it('/students (POST)', () => {
    const createDto = {
      ho_ten: 'Test Student',
      ma_so_sinh_vien: 'SV999',
      email: 'test@example.com',
    };

    return request(app.getHttpServer())
      .post('/students')
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.ho_ten).toBe(createDto.ho_ten);
        expect(res.body.ma_so_sinh_vien).toBe(createDto.ma_so_sinh_vien);
      });
  });
});
```

## Common Route Patterns

### Search and Filter

```typescript
@Get('search')
@ApiOperation({ summary: 'Search students with filters' })
async search(
  @Query('q') query: string,
  @Query('filters') filters?: string,
) {
  const parsedFilters = filters ? JSON.parse(filters) : {};
  return this.studentService.search(query, parsedFilters);
}
```

### Bulk Operations

```typescript
@Post('bulk')
@ApiOperation({ summary: 'Create multiple students' })
async bulkCreate(@Body() students: CreateStudentDto[]) {
  return this.studentService.createMany(students);
}

@Delete('bulk')
@ApiOperation({ summary: 'Delete multiple students' })
async bulkDelete(@Body('ids') ids: string[]) {
  return this.studentService.deleteMany(ids);
}
```

### Aggregation Routes

```typescript
@Get('statistics')
@ApiOperation({ summary: 'Get student statistics' })
async getStatistics() {
  return this.studentService.getStatistics();
}

@Get('faculty/:facultyId/count')
@ApiOperation({ summary: 'Count students by faculty' })
async countByFaculty(@Param('facultyId') facultyId: string) {
  return this.studentService.countByFaculty(facultyId);
}
```

## Troubleshooting

### Route Not Found

1. Check route registration in controller
2. Verify module is imported in AppModule
3. Ensure correct HTTP method is used
4. Check for typos in route path

### Parameter Validation Errors

1. Verify DTO decorators are correct
2. Check if ValidationPipe is globally enabled
3. Ensure class-validator is installed

### CORS Issues

```typescript
// Enable CORS with specific options
app.enableCors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
});
```

## Best Practices

1. **Use proper HTTP methods** - GET for read, POST for create, etc.
2. **Validate all inputs** - Use DTOs with validation decorators
3. **Return consistent responses** - Follow the same response structure
4. **Document with Swagger** - Add ApiOperation and ApiResponse decorators
5. **Handle errors properly** - Use exception filters
6. **Use meaningful route names** - Clear and descriptive paths
7. **Version your API** - Plan for future changes
8. **Test all routes** - Write integration tests

## Conclusion

Routes are the foundation of the API in the Student Management System. Proper route design and organization ensures a scalable and maintainable API structure.

## See Also

- [API Documentation](./api-documentation.md)
- [Source Code Organization](./source-code-organization.md)
- [Database Schema](./database-schema.md)
