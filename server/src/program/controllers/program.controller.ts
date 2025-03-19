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
  import { ProgramService } from '../services/program.service';
  import { CreateProgramDto, UpdateProgramDto } from '../dtos/program.dto';
  import { PaginationOptions } from '../../common/paginator/pagination.interface';
  
  @Controller('programs')
  export class ProgramController {
    constructor(private readonly programService: ProgramService) {}
  
    @Post()
    async create(@Body() createReq: CreateProgramDto) {
      return this.programService.create(createReq);
    }
  
    @Get()
    async get(
      @Query() query: PaginationOptions,
      @Query('searchString') searchString: string,
      @Query('page') page: number,
    ) {
      return this.programService.get(query, searchString, page);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReq: UpdateProgramDto) {
      return this.programService.update(id, updateReq);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.programService.delete(id);
    }
  }