import { Controller , Get, Post, Body, Query} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dtos/student.dto';
import { PaginationOptions } from '../paginator/pagination.interface';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(
   @Body() createReq: CreateStudentDto
  ) {
    return this.studentService.create(createReq);
  }

  @Get()
  async get(@Query() query: PaginationOptions) {
    return this.studentService.get(query);
  }
}