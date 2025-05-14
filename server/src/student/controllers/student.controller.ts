import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Search,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { SearchOptions } from '../../transcript/dtos/search_options.dto';
import { CreateStudentDto, UpdateStudentDto } from '../dtos/student.dto';
import {
  CCCDDocument,
  CMNDDocument,
  PassportDocument,
} from '../interfaces/id-document.interface';
import { Student } from '../interfaces/student.interface';
import { StudentService } from '../services/student.service';
import { TranscriptService } from '../../transcript/services/transcript.service';
import { query } from 'express';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly transcriptService: TranscriptService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new student',
    description: 'Creates a new student record in the system',
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Student successfully created' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createReq: CreateStudentDto) {
    return this.studentService.create(createReq);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all students',
    description: 'Returns a paginated list of all students',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10)',
    type: Number,
  })
  @ApiQuery({
    name: 'searchString',
    required: false,
    description: 'Search students by name or student ID',
    type: String,
  })
  @ApiQuery({
    name: 'faculty',
    required: false,
    description: 'Filter students by faculty ID',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Returns list of students' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async get(
    @Query() query: PaginationOptions,
    @Query('searchString') searchString: string,
    @Query('faculty') faculty: string,
    @Query('page') page: number,
  ) {
    return this.studentService.get(query, searchString, faculty, page);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get student by ID',
    description: 'Returns a student by their ID',
  })
  @ApiParam({ name: 'id', description: 'Student ID or MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Returns the student details' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async detail(@Param('id') id: string) {
    const sanitizedId = id.trim();
    return this.studentService.detail(sanitizedId);
  }

  @Get('transcripts/:id')
  @ApiOperation({
    summary: 'Get student transcripts',
    description: 'Returns all transcripts for a specific student',
  })
  @ApiParam({ name: 'id', description: 'Student ID or MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Returns the student transcripts' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTranscriptsByStudentId(
    @Param('id') id: string,
    @Query() query: PaginationOptions,
    @Query() searchString: SearchOptions,
  ) {
    const sanitizedId = id.trim();
    return this.transcriptService.findByStudentId(
      sanitizedId,
      query,
      searchString,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update student',
    description: "Updates a student's information",
  })
  @ApiParam({ name: 'id', description: 'Student ID or MongoDB ObjectId' })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateReq: UpdateStudentDto) {
    const sanitizedId = id.trim();

    const { giay_to_tuy_than, ...studentData } = updateReq;
    const updatedStudent: Partial<Student> = studentData;

    if (giay_to_tuy_than && giay_to_tuy_than.length > 0) {
      updatedStudent.giay_to_tuy_than = giay_to_tuy_than.map((doc) => {
        switch (doc.type) {
          case 'cmnd':
            return { ...doc, type: 'cmnd' } as CMNDDocument;
          case 'cccd':
            return { ...doc, type: 'cccd' } as CCCDDocument;
          case 'passport':
            return { ...doc, type: 'passport' } as PassportDocument;
          default:
            throw new HttpException(
              `Unsupported document type: ${doc.type}`,
              HttpStatus.BAD_REQUEST,
            );
        }
      });
    }

    return this.studentService.update(sanitizedId, updatedStudent);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete student',
    description: 'Deletes a student from the system',
  })
  @ApiParam({ name: 'id', description: 'Student ID or MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async delete(@Param('id') id: string) {
    const sanitizedId = id.trim();
    return this.studentService.delete(sanitizedId);
  }
}
