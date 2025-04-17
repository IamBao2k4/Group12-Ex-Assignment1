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
  import { ProgramService } from '../services/program.service';
  import { CreateProgramDto, UpdateProgramDto } from '../dtos/program.dto';
  import { PaginationOptions } from '../../common/paginator/pagination.interface';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
  
  @ApiTags('programs')
  @Controller('programs')
  export class ProgramController {
    private readonly logger = new Logger(ProgramController.name);
  
    constructor(private readonly programService: ProgramService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create new program', description: 'Creates a new academic program in the system' })
    @ApiBody({ type: CreateProgramDto })
    @ApiResponse({ status: 201, description: 'Program successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async create(@Body() createReq: CreateProgramDto) {
      try {
        return await this.programService.create(createReq);
      } catch (error) {
        this.logger.error(`program.controller.create: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all programs', description: 'Returns a paginated list of academic programs' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)', type: Number })
    @ApiQuery({ name: 'searchString', required: false, description: 'Search programs by name or code', type: String })
    @ApiResponse({ status: 200, description: 'Returns list of programs' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async get(
      @Query() query: PaginationOptions,
      @Query('searchString') searchString: string,
      @Query('page') page: number,
    ) {
      try {
        return await this.programService.get(query, searchString, page);
      } catch (error) {
        this.logger.error(`program.controller.get: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update program', description: 'Updates an existing academic program' })
    @ApiParam({ name: 'id', description: 'Program ID (MongoDB ObjectId)' })
    @ApiBody({ type: UpdateProgramDto })
    @ApiResponse({ status: 200, description: 'Program updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
    @ApiResponse({ status: 404, description: 'Program not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async update(@Param('id') id: string, @Body() updateReq: UpdateProgramDto) {
      try {
        return await this.programService.update(id, updateReq);
      } catch (error) {
        this.logger.error(`program.controller.update: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete program', description: 'Deletes an academic program from the system' })
    @ApiParam({ name: 'id', description: 'Program ID (MongoDB ObjectId)' })
    @ApiResponse({ status: 200, description: 'Program deleted successfully' })
    @ApiResponse({ status: 404, description: 'Program not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async delete(@Param('id') id: string) {
      try {
        return await this.programService.delete(id);
      } catch (error) {
        this.logger.error(`program.controller.delete: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all programs without pagination', description: 'Returns all academic programs without pagination' })
    @ApiResponse({ status: 200, description: 'Returns list of all programs' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAll() {
      try {
        return await this.programService.getAll();
      } catch (error) {
        this.logger.error(`program.controller.getAll: ${error.message}`, error.stack);
        throw error;
      }
    }
  }