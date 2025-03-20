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
  import { FacultyService } from '../services/faculty.service';
  import { CreateFacultyDto, UpdateFacultyDto } from '../dtos/faculty.dto';
  import { PaginationOptions } from '../../common/paginator/pagination.interface';
  
  @Controller('faculties')
  export class FacultyController {
    constructor(private readonly facultyService: FacultyService) {}
  
    @Post()
    async create(@Body() createReq: CreateFacultyDto) {
      return this.facultyService.create(createReq);
    }
  
    @Get()
    async get(
      @Query() query: PaginationOptions,
      @Query('searchString') searchString: string,
      @Query('page') page: number,
    ) {
      return this.facultyService.get(query, searchString, page);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReq: UpdateFacultyDto) {
      return this.facultyService.update(id, updateReq);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.facultyService.delete(id);
    }

    @Get('all')
    async getAll() {
      return this.facultyService.getAll();
    }
  }