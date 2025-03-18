import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, UpdateStudentDto } from '../dtos/student.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { BaseException } from '../../common/exceptions/base.exception';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createReq: CreateStudentDto) {
    return this.studentService.create(createReq);
  }

  @Get()
  async get(
    @Query() query: PaginationOptions,
    @Query('searchString') searchString: string,
    @Query('page') page: number,
  ) {
    return this.studentService.get(query, searchString, page);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReq: UpdateStudentDto) {
    return this.studentService.update(id, updateReq);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
      return this.studentService.delete(id);
  }
}
