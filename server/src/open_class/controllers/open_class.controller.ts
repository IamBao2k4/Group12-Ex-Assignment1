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
import { OpenClassService } from '../services/open_class.service';
import { CreateOpenClassDto, UpdateOpenClassDto } from '../dtos/open_class.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { SearchOptions } from '../dtos/search_options.dto';
@Controller('open_classs')
export class OpenClassController {
  private readonly logger = new Logger(OpenClassController.name);

  constructor(private readonly open_classService: OpenClassService) {}

  @Post()
  async create(@Body() createReq: CreateOpenClassDto) {
    try {
      return await this.open_classService.create(createReq);
    } catch (error) {
      this.logger.error(
        `open_class.controller.create: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get()
  async get(
    @Query() query: PaginationOptions,
    @Query() searchString: SearchOptions,
  ) {
    try {
      return await this.open_classService.get(query, searchString);
    } catch (error) {
      this.logger.error(`open_class.controller.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReq: UpdateOpenClassDto) {
    try {
      return await this.open_classService.update(id, updateReq);
    } catch (error) {
      this.logger.error(
        `open_class.controller.update: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.open_classService.delete(id);
    } catch (error) {
      this.logger.error(
        `open_class.controller.delete: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get('all')
  async getAll() {
    try {
      return await this.open_classService.getAll();
    } catch (error) {
      this.logger.error(
        `open_class.controller.getAll: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.open_classService.getById(id);
    } catch (error) {
      this.logger.error(
        `open_class.controller.getById: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
