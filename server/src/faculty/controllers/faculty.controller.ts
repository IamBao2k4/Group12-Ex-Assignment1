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
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
  
  @ApiTags('faculties')
  @Controller('faculties')
  export class FacultyController {
    private readonly logger = new Logger(FacultyController.name);
  
    constructor(private readonly facultyService: FacultyService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create new faculty', description: 'Creates a new faculty in the system' })
    @ApiBody({ type: CreateFacultyDto })
    @ApiResponse({ status: 201, description: 'Faculty successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async create(@Body() createReq: CreateFacultyDto) {
      try {
        return await this.facultyService.create(createReq);
      } catch (error) {
        this.logger.error(`faculty.controller.create: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all faculties', description: 'Returns a paginated list of faculties' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)', type: Number })
    @ApiQuery({ name: 'searchString', required: false, description: 'Search faculties by name or code', type: String })
    @ApiResponse({ status: 200, description: 'Returns list of faculties' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async get(
      @Query() query: PaginationOptions,
      @Query('searchString') searchString: string,
      @Query('page') page: number,
      @Query('lang') lang: string = 'vi'
    ) {
      try {
        return await this.facultyService.get(query, searchString, page, lang);
      } catch (error) {
        this.logger.error(`faculty.controller.get: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update faculty', description: 'Updates an existing faculty' })
    @ApiParam({ name: 'id', description: 'Faculty ID (MongoDB ObjectId)' })
    @ApiBody({ type: UpdateFacultyDto })
    @ApiResponse({ status: 200, description: 'Faculty updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
    @ApiResponse({ status: 404, description: 'Faculty not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async update(@Param('id') id: string, @Body() updateReq: UpdateFacultyDto) {
      try {
        return await this.facultyService.update(id, updateReq);
      } catch (error) {
        this.logger.error(`faculty.controller.update: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete faculty', description: 'Deletes a faculty from the system' })
    @ApiParam({ name: 'id', description: 'Faculty ID (MongoDB ObjectId)' })
    @ApiResponse({ status: 200, description: 'Faculty deleted successfully' })
    @ApiResponse({ status: 404, description: 'Faculty not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async delete(@Param('id') id: string) {
      try {
        return await this.facultyService.delete(id);
      } catch (error) {
        this.logger.error(`faculty.controller.delete: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all faculties without pagination', description: 'Returns all faculties without pagination' })
    @ApiResponse({ status: 200, description: 'Returns list of all faculties' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAll() {
      try {
        return await this.facultyService.getAll();
      } catch (error) {
        this.logger.error(`faculty.controller.getAll: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get faculty by ID', description: 'Returns a faculty by ID' })
    @ApiParam({ name: 'id', description: 'Faculty ID (MongoDB ObjectId)' })
    @ApiResponse({ status: 200, description: 'Returns faculty details' })
    @ApiResponse({ status: 404, description: 'Faculty not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getById(@Param('id') id: string) {
      try {
        return await this.facultyService.getById(id);
      } catch (error) {
        this.logger.error(`faculty.controller.getById: ${error.message}`, error.stack);
        throw error;
      }
    }
  }