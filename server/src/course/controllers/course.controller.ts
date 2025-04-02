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

@Controller('courses')
export class CourseController {
  private readonly logger = new Logger(CourseController.name);

  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() createReq: CreateCourseDto) {
    try {
      return await this.courseService.create(createReq);
    } catch (error) {
      this.logger.error(`course.controller.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  async get(
    @Query() query: PaginationOptions,
    @Query('searchString') searchString: string,
    @Query('page') page: number,
  ) {
    try {
      return await this.courseService.get(query, searchString, page);
    } catch (error) {
      this.logger.error(`course.controller.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReq: UpdateCourseDto) {
    try {
      return await this.courseService.update(id, updateReq);
    } catch (error) {
      this.logger.error(`course.controller.update: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.courseService.delete(id);
    } catch (error) {
      this.logger.error(`course.controller.delete: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('all')
  async getAll() {
    try {
      return await this.courseService.getAll();
    } catch (error) {
      this.logger.error(`course.controller.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.courseService.getById(id);
    } catch (error) {
      this.logger.error(`course.controller.getById: ${error.message}`, error.stack);
      throw error;
    }
  }
}