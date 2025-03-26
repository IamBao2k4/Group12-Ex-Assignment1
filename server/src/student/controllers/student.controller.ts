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
  Logger,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, UpdateStudentDto } from '../dtos/student.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { BaseException } from '../../common/exceptions/base.exception';
import { Student } from '../interfaces/student.interface';
import { IDDocument, CMNDDocument, CCCDDocument, PassportDocument } from '../interfaces/id-document.interface';

@Controller('students')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(private readonly studentService: StudentService) { }

  @Post()
  async create(@Body() createReq: CreateStudentDto) {
    try {
      const result = await this.studentService.create(createReq);
      return result;
    } catch (error) {
      this.logger.error(`student.controller.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  async get(
    @Query() query: PaginationOptions,
    @Query('searchString') searchString: string,
    @Query('faculty') faculty: string,
    @Query('page') page: number,
  ) {

    try {
      const result = await this.studentService.get(query, faculty, searchString, page);
      return result;
    } catch (error) {
      this.logger.error(`student.controller.get: ${error.message}`, error.stack);
      throw error;
    }

  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const sanitizedId = id.trim();
    
    try {
      const result = await this.studentService.detail(sanitizedId);
      return result;
    } catch (error) {
      this.logger.error(`student.controller.detail: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReq: UpdateStudentDto) {
    const sanitizedId = id.trim();

    try {
      const { giay_to_tuy_than, ...studentData } = updateReq;
      const updatedStudent: Partial<Student> = studentData;

      if (giay_to_tuy_than && giay_to_tuy_than.length > 0) {
        updatedStudent.giay_to_tuy_than = giay_to_tuy_than.map(doc => {
          switch (doc.type) {
            case 'cmnd': return { ...doc, type: 'cmnd' } as CMNDDocument;
            case 'cccd': return { ...doc, type: 'cccd' } as CCCDDocument;
            case 'passport': return { ...doc, type: 'passport' } as PassportDocument;
          }
        });
      }
      
      const result = await this.studentService.update(sanitizedId, updatedStudent);
      return result;
    } catch (error) {
      this.logger.error(`student.controller.update: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const sanitizedId = id.trim();
    
    try {
      const result = await this.studentService.delete(sanitizedId);
      return result;
    } catch (error) {
      this.logger.error(`student.controller.delete: ${error.message}`, error.stack);
      throw error;
    }
  }
}
