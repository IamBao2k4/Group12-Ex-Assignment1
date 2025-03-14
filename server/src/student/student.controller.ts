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
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto } from './dtos/student.dto';
import { PaginationOptions } from '../paginator/pagination.interface';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createReq: CreateStudentDto) {
    try {
      return this.studentService.create(createReq);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi không xác định',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    try {
      return this.studentService.update(id, updateReq);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi không xác định',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}
