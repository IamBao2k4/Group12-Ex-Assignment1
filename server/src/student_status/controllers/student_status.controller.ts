import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Delete,
    Param,
    Patch,
    Logger,
  } from '@nestjs/common';
  import { StudentStatusService } from '../services/student_status.service';
  import { CreateStudentStatusDto, UpdateStudentStatusDto } from '../dtos/student_status.dto';
  import { PaginationOptions } from '../../common/paginator/pagination.interface';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
  
  @ApiTags('student-statuses')
  @Controller('student-statuses')
  export class StudentStatusController {
    private readonly logger = new Logger(StudentStatusController.name);
  
    constructor(private readonly studentStatusService: StudentStatusService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create new student status', description: 'Creates a new student status in the system' })
    @ApiBody({ type: CreateStudentStatusDto })
    @ApiResponse({ status: 201, description: 'Student status successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async create(@Body() createReq: CreateStudentStatusDto) {
      try {
        return await this.studentStatusService.create(createReq);
      } catch (error) {
        this.logger.error(`student_status.controller.create: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all student statuses', description: 'Returns a paginated list of student statuses' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)', type: Number })
    @ApiQuery({ name: 'searchString', required: false, description: 'Search student statuses by name or code', type: String })
    @ApiResponse({ status: 200, description: 'Returns list of student statuses' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async get(
      @Query() query: PaginationOptions,
      @Query('searchString') searchString: string,
      @Query('page') page: number,
      @Query('lang') lang: string = 'vi'
    ) {
      try {
        return await this.studentStatusService.get(query, searchString, page, lang);
      } catch (error) {
        this.logger.error(`student_status.controller.get: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update student status', description: 'Updates an existing student status' })
    @ApiParam({ name: 'id', description: 'Student status ID (MongoDB ObjectId)' })
    @ApiBody({ type: UpdateStudentStatusDto })
    @ApiResponse({ status: 200, description: 'Student status updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
    @ApiResponse({ status: 404, description: 'Student status not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async update(@Param('id') id: string, @Body() updateReq: UpdateStudentStatusDto) {
      try {
        return await this.studentStatusService.update(id, updateReq);
      } catch (error) {
        this.logger.error(`student_status.controller.update: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete student status', description: 'Deletes a student status from the system' })
    @ApiParam({ name: 'id', description: 'Student status ID (MongoDB ObjectId)' })
    @ApiResponse({ status: 200, description: 'Student status deleted successfully' })
    @ApiResponse({ status: 404, description: 'Student status not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async delete(@Param('id') id: string) {
      try {
        return await this.studentStatusService.delete(id);
      } catch (error) {
        this.logger.error(`student_status.controller.delete: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all student statuses without pagination', description: 'Returns all student statuses without pagination' })
    @ApiResponse({ status: 200, description: 'Returns list of all student statuses' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAll() {
      try {
        return await this.studentStatusService.getAll();
      } catch (error) {
        this.logger.error(`student_status.controller.getAll: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get student status by ID', description: 'Returns a student status by ID' })
    @ApiParam({ name: 'id', description: 'Student status ID (MongoDB ObjectId)' })
    @ApiResponse({ status: 200, description: 'Returns student status details' })
    @ApiResponse({ status: 404, description: 'Student status not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async detail(@Param('id') id: string) {
      try {
        return await this.studentStatusService.detail(id);
      } catch (error) {
        this.logger.error(`student_status.controller.detail: ${error.message}`, error.stack);
        throw error;
      }
    }
  }