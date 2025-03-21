import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Delete,
    Param,
    Patch,
  } from '@nestjs/common';
  import { StudentStatusService } from '../services/student_status.service';
  import { CreateStudentStatusDto, UpdateStudentStatusDto } from '../dtos/student_status.dto';
  import { PaginationOptions } from '../../common/paginator/pagination.interface';
  
  @Controller('student-statuses')
  export class StudentStatusController {
    constructor(private readonly studentStatusService: StudentStatusService) {}
  
    @Post()
    async create(@Body() createReq: CreateStudentStatusDto) {
      return this.studentStatusService.create(createReq);
    }
  
    @Get()
    async get(
      @Query() query: PaginationOptions,
      @Query('searchString') searchString: string,
      @Query('page') page: number,
    ) {
      return this.studentStatusService.get(query, searchString, page);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReq: UpdateStudentStatusDto) {
      return this.studentStatusService.update(id, updateReq);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.studentStatusService.delete(id);
    }

    @Get('all')
    async getAll() {
      return this.studentStatusService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
      return this.studentStatusService.getOne(id);
    }
  }