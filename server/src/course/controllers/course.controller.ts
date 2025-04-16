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
import { CourseService } from '../services/course.service';
import { CreateCourseDto, UpdateCourseDto } from '../dtos/course.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  private readonly logger = new Logger(CourseController.name);

  constructor(private readonly courseService: CourseService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new course', description: 'Creates a new course in the system' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'Course successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createReq: CreateCourseDto) {
    try {
      return await this.courseService.create(createReq);
    } catch (error) {
      this.logger.error(`course.controller.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses', description: 'Returns a paginated list of courses' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)', type: Number })
  @ApiQuery({ name: 'faculty', required: false, description: 'Filter courses by faculty ID', type: String })
  @ApiQuery({ name: 'available', required: false, description: 'Filter by course availability', type: String })
  @ApiResponse({ status: 200, description: 'Returns list of courses' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async get(
    @Query() query: PaginationOptions,
    @Query('faculty') faculty: string,
    @Query('available') available: string,
  ) {
    try {
      return await this.courseService.get(query, faculty, available);
    } catch (error) {
      this.logger.error(`course.controller.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('all-available')
  @ApiOperation({ summary: 'Get all available courses', description: 'Returns a list of all available courses' })
  @ApiResponse({ status: 200, description: 'Returns list of available courses' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllAvailable() {
    try {
      return await this.courseService.getAllAvailable();
    } catch (error) {
      this.logger.error(`course.controller.getAllAvailable: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course', description: 'Updates an existing course' })
  @ApiParam({ name: 'id', description: 'Course ID (MongoDB ObjectId)' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('id') id: string, @Body() updateReq: UpdateCourseDto) {
    try {
      return await this.courseService.update(id, updateReq);
    } catch (error) {
      this.logger.error(`course.controller.update: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course', description: 'Deletes a course from the system' })
  @ApiParam({ name: 'id', description: 'Course ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async delete(@Param('id') id: string) {
    try {
      return await this.courseService.delete(id);
    } catch (error) {
      this.logger.error(`course.controller.delete: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all courses without pagination', description: 'Returns all courses without pagination' })
  @ApiResponse({ status: 200, description: 'Returns list of all courses' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAll() {
    try {
      return await this.courseService.getAll();
    } catch (error) {
      this.logger.error(`course.controller.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID', description: 'Returns a course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Returns course details' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getById(@Param('id') id: string) {
    try {
      return await this.courseService.getById(id);
    } catch (error) {
      this.logger.error(`course.controller.getById: ${error.message}`, error.stack);
      throw error;
    }
  }
}