---
sidebar_position: 10
---

# Registering New Routes

## Giới thiệu

Document này hướng dẫn cách đăng ký và cấu hình routes trong hệ thống Student Management sử dụng NestJS framework. Routes định nghĩa các endpoints API mà client có thể truy cập.

## Route Structure trong NestJS

### Controller-based Routing

Trong NestJS, routes được định nghĩa thông qua decorators trong controllers:

```typescript
@Controller('students')
export class StudentController {
  // Routes will be defined here
}
```

### HTTP Method Decorators

```typescript
@Get()       // GET request
@Post()      // POST request
@Patch()     // PATCH request
@Put()       // PUT request
@Delete()    // DELETE request
```

## Tạo Routes Cơ Bản

### 1. Simple Route

```typescript
@Controller('students')
export class StudentController {
  @Get()
  async findAll() {
    // GET /students
    return this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // GET /students/:id
    return this.studentService.findById(id);
  }
}
```

### 2. Route với Query Parameters

```typescript
@Get()
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'searchString', required: false, type: String })
@ApiQuery({ name: 'faculty', required: false, type: String })
async getStudents(
  @Query() query: PaginationOptions,
  @Query('searchString') searchString: string,
  @Query('faculty') faculty: string,
  @Query('page') page: number,
) {
  return this.studentService.get(query, searchString, faculty, page);
}
```

### 3. Route với Path Parameters

```typescript
@Get(':id')
@ApiParam({ name: 'id', description: 'Student ID or MongoDB ObjectId' })
async getStudentDetail(@Param('id') id: string) {
  const sanitizedId = id.trim();
  return this.studentService.detail(sanitizedId);
}
```

### 4. Route với Request Body

```typescript
@Post()
@ApiBody({ type: CreateStudentDto })
@UsePipes(new ValidationPipe({ transform: true }))
async createStudent(@Body() createDto: CreateStudentDto) {
  return this.studentService.create(createDto);
}
```

## Nested Routes

### Sub-resource Routes

```typescript
@Controller('students')
export class StudentController {
  // GET /students/:id/transcripts
  @Get(':id/transcripts')
  @ApiOperation({ summary: 'Get student transcripts' })
  async getTranscripts(
    @Param('id') id: string,
    @Query() query: PaginationOptions,
  ) {
    return this.transcriptService.findByStudentId(id, query);
  }

  // POST /students/:id/enrollments
  @Post(':id/enrollments')
  async enrollCourse(
    @Param('id') studentId: string,
    @Body() enrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentService.enroll(studentId, enrollmentDto);
  }
}
```

## Route Validation

### 1. DTO Validation

```typescript
// create-student.dto.ts
export class CreateStudentDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  @MaxLength(100)
  ho_ten: string;

  @IsNotEmpty({ message: 'MSSV không được để trống' })
  @Matches(/^[A-Z0-9]+$/, {
    message: 'MSSV chỉ chứa chữ cái viết hoa và số',
  })
  ma_so_sinh_vien: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  email?: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsOptional()
  so_dien_thoai?: string;

  @IsMongoId({ message: 'Faculty ID không hợp lệ' })
  @IsOptional()
  khoa?: string;
}
```

### 2. Custom Validation Pipe

```typescript
@Post()
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
async create(@Body() dto: CreateStudentDto) {
  return this.studentService.create(dto);
}
```

### 3. Parameter Validation

```typescript
@Get(':id')
async findOne(@Param('id', ParseMongoIdPipe) id: string) {
  return this.studentService.findById(id);
}

// Custom pipe for MongoDB ObjectId validation
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
    }
    return value;
  }
}
```

## Route Documentation với Swagger

### 1. Basic Documentation

```typescript
@ApiTags('students')
@Controller('students')
export class StudentController {
  @Post()
  @ApiOperation({
    summary: 'Create new student',
    description: 'Creates a new student record in the system',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Student successfully created',
    type: StudentResponseDto,
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }
}
```

### 2. Response DTOs

```typescript
export class StudentResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  ho_ten: string;

  @ApiProperty({ example: 'SV001' })
  ma_so_sinh_vien: string;

  @ApiProperty({ example: 'student@example.edu.vn' })
  email: string;

  @ApiProperty({ example: '0123456789' })
  so_dien_thoai: string;

  @ApiProperty({ type: () => FacultyDto })
  khoa: FacultyDto;

  @ApiProperty({ type: () => ProgramDto })
  chuong_trinh: ProgramDto;

  @ApiProperty({ type: () => StudentStatusDto })
  tinh_trang: StudentStatusDto;
}
```

## Advanced Routing Patterns

### 1. Route Guards

```typescript
@Controller('admin/students')
@UseGuards(AuthGuard, RoleGuard)
export class AdminStudentController {
  @Get()
  @Roles('admin', 'manager')
  async getAllStudents() {
    return this.studentService.findAll();
  }
}
```

### 2. Route Interceptors

```typescript
@Controller('students')
@UseInterceptors(LoggingInterceptor)
export class StudentController {
  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll() {
    return this.studentService.findAll();
  }
}
```

### 3. Route Filters

```typescript
@Controller('students')
@UseFilters(HttpExceptionFilter)
export class StudentController {
  @Post()
  @UseFilters(ValidationExceptionFilter)
  async create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }
}
```

## Module-based Route Organization

### 1. Feature Module Routes

```typescript
// student.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema }
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
  exports: [StudentService],
})
export class StudentModule {}

// faculty.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Faculty', schema: FacultySchema }
    ]),
  ],
  controllers: [FacultyController],
  providers: [FacultyService, FacultyRepository],
  exports: [FacultyService],
})
export class FacultyModule {}
```

### 2. Route Prefix Configuration

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  // Module-specific prefix
  app.use('/api/v2/students', studentRouter);
  
  await app.listen(3001);
}
```

## Route Best Practices

### 1. RESTful Conventions

```typescript
@Controller('students')
export class StudentController {
  @Get()                    // GET /students
  findAll() {}

  @Get(':id')              // GET /students/:id
  findOne() {}

  @Post()                  // POST /students
  create() {}

  @Patch(':id')            // PATCH /students/:id
  update() {}

  @Delete(':id')           // DELETE /students/:id
  delete() {}
}
```

### 2. Versioning

```typescript
// Version in URL
@Controller('v1/students')
export class StudentV1Controller {}

@Controller('v2/students')
export class StudentV2Controller {}

// Header versioning
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

### 3. Error Handling

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  try {
    const student = await this.studentService.findById(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  } catch (error) {
    if (error instanceof StudentNotFoundException) {
      throw new NotFoundException(error.message);
    }
    throw new InternalServerErrorException('Failed to fetch student');
  }
}
```

## Testing Routes

### 1. E2E Testing

```typescript
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

  it('/students/:id (GET)', () => {
    const studentId = '507f1f77bcf86cd799439011';
    return request(app.getHttpServer())
      .get(`/students/${studentId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id', studentId);
      });
  });
});
```

### 2. Route Integration Testing

```typescript
describe('Student Routes Integration', () => {
  it('should handle pagination correctly', async () => {
    const response = await request(app.getHttpServer())
      .get('/students')
      .query({ page: 2, limit: 10 })
      .expect(200);

    expect(response.body.meta.page).toBe(2);
    expect(response.body.meta.limit).toBe(10);
    expect(response.body.data.length).toBeLessThanOrEqual(10);
  });

  it('should validate input data', async () => {
    const invalidData = {
      ho_ten: '', // Empty name
      ma_so_sinh_vien: 'invalid!@#', // Invalid format
    };

    const response = await request(app.getHttpServer())
      .post('/students')
      .send(invalidData)
      .expect(400);

    expect(response.body.message).toContain('Validation failed');
  });
});
```

## Common Route Patterns

### 1. Search and Filter

```typescript
@Get('search')
async search(
  @Query('q') query: string,
  @Query('faculty') faculty: string,
  @Query('status') status: string,
  @Query() pagination: PaginationOptions,
) {
  return this.studentService.search({
    query,
    filters: { faculty, status },
    pagination,
  });
}
```

### 2. Bulk Operations

```typescript
@Post('bulk')
async bulkCreate(@Body() students: CreateStudentDto[]) {
  return this.studentService.createMany(students);
}

@Delete('bulk')
async bulkDelete(@Body() ids: string[]) {
  return this.studentService.deleteMany(ids);
}
```

### 3. File Upload Routes

```typescript
@Post('import')
@UseInterceptors(FileInterceptor('file'))
async importStudents(@UploadedFile() file: Express.Multer.File) {
  return this.importService.importStudents(file);
}

@Get('export')
async exportStudents(@Res() res: Response) {
  const file = await this.exportService.exportStudents();
  res.download(file.path, file.filename);
}
```

## Troubleshooting

### Common Issues

1. **Route not found (404)**
   - Check controller is registered in module
   - Verify route path and HTTP method
   - Check global prefix configuration

2. **Validation errors not showing**
   - Ensure ValidationPipe is applied
   - Check DTO decorators are correct
   - Verify class-transformer is installed

3. **Parameters not binding**
   - Check decorator usage (@Param, @Query, @Body)
   - Verify parameter names match
   - Ensure proper type transformation

## Conclusion

Routes là foundation của API trong Student Management System. Proper route design và organization ensures scalable và maintainable API structure.

## See Also

- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [API Documentation](./api-documentation.md)
- [Overview of Architecture](./overview-of-architecture.md)
