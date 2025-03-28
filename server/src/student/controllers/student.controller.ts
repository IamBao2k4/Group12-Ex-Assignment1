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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, UpdateStudentDto, FindStudentDto } from '../dtos/student.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { BaseException } from '../../common/exceptions/base.exception';
import { Student } from '../interfaces/student.interface';
import { IDDocument, CMNDDocument, CCCDDocument, PassportDocument } from '../interfaces/id-document.interface';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createReq: CreateStudentDto) {
    return this.studentService.create(createReq);
  }

  @Get()
  async get(
    @Query() query: PaginationOptions,
    @Query('searchString') searchString: string,
    @Query('faculty') faculty: string,
    @Query('page') page: number,
  ) {
    return this.studentService.get(query, searchString, faculty, page);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const sanitizedId = id.trim();
    return this.studentService.detail(sanitizedId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateReq: UpdateStudentDto) {
    const sanitizedId = id.trim();

    const { giay_to_tuy_than, ...studentData } = updateReq;
    const updatedStudent: Partial<Student> = studentData;

    if (giay_to_tuy_than && giay_to_tuy_than.length > 0) {
      updatedStudent.giay_to_tuy_than = giay_to_tuy_than.map(doc => {
        switch (doc.type) {
          case 'cmnd': return { ...doc, type: 'cmnd' } as CMNDDocument;
          case 'cccd': return { ...doc, type: 'cccd' } as CCCDDocument;
          case 'passport': return { ...doc, type: 'passport' } as PassportDocument;
          default: throw new HttpException(`Unsupported document type: ${doc.type}`, HttpStatus.BAD_REQUEST);
        }
      });
    }
    
    return this.studentService.update(sanitizedId, updatedStudent);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const sanitizedId = id.trim();
    return this.studentService.delete(sanitizedId);
  }
}

