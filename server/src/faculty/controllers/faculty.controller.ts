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
  import { FacultyService } from '../services/faculty.service';
  import { CreateFacultyDto, UpdateFacultyDto } from '../dtos/faculty.dto';
  import { PaginationOptions } from '../../common/paginator/pagination.interface';
  
  @Controller('faculties')
  export class FacultyController {
    private readonly logger = new Logger(FacultyController.name);
  
    constructor(private readonly facultyService: FacultyService) {}
  
    @Post()
    async create(@Body() createReq: CreateFacultyDto) {
      try {
        return await this.facultyService.create(createReq);
      } catch (error) {
        this.logger.error(`faculty.controller.create: ${error.message}`, error.stack);
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
        return await this.facultyService.get(query, searchString, page);
      } catch (error) {
        this.logger.error(`faculty.controller.get: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReq: UpdateFacultyDto) {
      try {
        return await this.facultyService.update(id, updateReq);
      } catch (error) {
        this.logger.error(`faculty.controller.update: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      try {
        return await this.facultyService.delete(id);
      } catch (error) {
        this.logger.error(`faculty.controller.delete: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get('all')
    async getAll() {
      try {
        return await this.facultyService.getAll();
      } catch (error) {
        this.logger.error(`faculty.controller.getAll: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
      try {
        return await this.facultyService.getById(id);
      } catch (error) {
        this.logger.error(`faculty.controller.getById: ${error.message}`, error.stack);
        throw error;
      }
    }
  }