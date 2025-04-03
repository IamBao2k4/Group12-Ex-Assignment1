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
import { GradeService } from '../services/grade.service';
import { CreateGradeDto, UpdateGradeDto } from '../dtos/grade.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';

@Controller('grades')
export class GradeController {
  private readonly logger = new Logger(GradeController.name);

  constructor(private readonly gradeService: GradeService) {}

  @Post()
  async create(@Body() createReq: CreateGradeDto) {
    try {
      return await this.gradeService.create(createReq);
    } catch (error) {
      this.logger.error(
        `grade.controller.create: ${error.message}`,
        error.stack,
      );
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
      return await this.gradeService.get(query, searchString, page);
    } catch (error) {
      this.logger.error(`grade.controller.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReq: UpdateGradeDto) {
    try {
      return await this.gradeService.update(id, updateReq);
    } catch (error) {
      this.logger.error(
        `grade.controller.update: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.gradeService.delete(id);
    } catch (error) {
      this.logger.error(
        `grade.controller.delete: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get('all')
  async getAll() {
    try {
      return await this.gradeService.getAll();
    } catch (error) {
      this.logger.error(
        `grade.controller.getAll: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.gradeService.getById(id);
    } catch (error) {
      this.logger.error(
        `grade.controller.getById: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
