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
  
  @Controller('student-statuses')
  export class StudentStatusController {
    private readonly logger = new Logger(StudentStatusController.name);
  
    constructor(private readonly studentStatusService: StudentStatusService) {}
  
    @Post()
    async create(@Body() createReq: CreateStudentStatusDto) {
      try {
        return await this.studentStatusService.create(createReq);
      } catch (error) {
        this.logger.error(`student_status.controller.create: ${error.message}`, error.stack);
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
        return await this.studentStatusService.get(query, searchString, page);
      } catch (error) {
        this.logger.error(`student_status.controller.get: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReq: UpdateStudentStatusDto) {
      try {
        return await this.studentStatusService.update(id, updateReq);
      } catch (error) {
        this.logger.error(`student_status.controller.update: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      try {
        return await this.studentStatusService.delete(id);
      } catch (error) {
        this.logger.error(`student_status.controller.delete: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get('all')
    async getAll() {
      try {
        return await this.studentStatusService.getAll();
      } catch (error) {
        this.logger.error(`student_status.controller.getAll: ${error.message}`, error.stack);
        throw error;
      }
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
      return this.studentStatusService.getOne(id);
    }
  }