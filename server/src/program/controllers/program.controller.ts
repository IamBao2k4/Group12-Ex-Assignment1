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
  
  @Controller('programs')
  export class ProgramController {
    private readonly logger = new Logger(ProgramController.name);
  
    constructor(private readonly programService: ProgramService) {}
  
    @Post()
    async create(@Body() createReq: CreateProgramDto) {
      try {
        return await this.programService.create(createReq);
      } catch (error) {
        this.logger.error(`program.controller.create: ${error.message}`, error.stack);
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
        return await this.programService.get(query, searchString, page);
      } catch (error) {
        this.logger.error(`program.controller.get: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReq: UpdateProgramDto) {
      try {
        return await this.programService.update(id, updateReq);
      } catch (error) {
        this.logger.error(`program.controller.update: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      try {
        return await this.programService.delete(id);
      } catch (error) {
        this.logger.error(`program.controller.delete: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get('all')
    async getAll() {
      try {
        return await this.programService.getAll();
      } catch (error) {
        this.logger.error(`program.controller.getAll: ${error.message}`, error.stack);
        throw error;
      }
    }
  }