import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Course } from '../interfaces/course.interface';
import { ICourseRepository, COURSE_REPOSITORY } from '../repositories/course.repository.interface';
import { CreateCourseDto, UpdateCourseDto } from '../dtos/course.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { isValidObjectId } from 'mongoose';
import { CourseNotFoundException } from '../exceptions/course-not-found.exception';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courseRepository: ICourseRepository,
  ) {}

  async create(createReq: CreateCourseDto): Promise<Course> {
    try {
      return await this.courseRepository.create(createReq);
    } catch (error) {
      this.logger.error(`course.service.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  async get(
    query: PaginationOptions,
    faculty: string,
    available: string,
    lang: string = 'vi',
    searchString: string
  ): Promise<PaginatedResponse<Course>> {
    try {
      return await this.courseRepository.findAll(query, faculty, available, lang, searchString);
    } catch (error) {
      this.logger.error(`course.service.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAllAvailable(): Promise<Course[]> {
    try {
      return await this.courseRepository.findAllAvailable();
    } catch (error) {
      this.logger.error(`course.service.getAllAvailable: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateReq: UpdateCourseDto): Promise<Course | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`course.service.update: Invalid ObjectId format for ID ${id}`);
        throw new CourseNotFoundException(id, true);
      }
      const result = await this.courseRepository.update(id, updateReq);
      if (!result) {
        throw new CourseNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof CourseNotFoundException) {
        this.logger.error(`course.service.update: ${error.message}`, error.stack);
      } else {
        this.logger.error(`course.service.update: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Course | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`course.service.delete: Invalid ObjectId format for ID ${id}`);
        throw new CourseNotFoundException(id, true);
      }
      
      // Gọi repository và kiểm tra kết quả trả về
      const result = await this.courseRepository.softDelete(id);
      if (!result) {
        this.logger.error(`course.service.delete: Course with ID ${id} not found`);
        throw new CourseNotFoundException(id);
      }
      return result;
      
    } catch (error) {
      if (error instanceof CourseNotFoundException) {
        this.logger.error(`course.service.delete: ${error.message}`, error.stack);
      } else {
        this.logger.error(`course.service.delete: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async getAll(): Promise<Course[]> {
    try {
      return await this.courseRepository.getAll();
    } catch (error) {
      this.logger.error(`course.service.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCode(ma: string): Promise<Course | null> {
    try {
      return await this.courseRepository.findByCode(ma);
    } catch (error) {
      this.logger.error(`course.service.findByCode: ${error.message}`, error.stack);
      throw error;
    }
  }

  async detail(id: string): Promise<Course> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`course.service.detail: Invalid ObjectId format for ID ${id}`);
        throw new CourseNotFoundException(id, true);
      }
      const course = await this.courseRepository.detail(id);
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
    } catch (error) {
      this.logger.error(`course.service.detail: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getById(id: string): Promise<Course | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`course.service.getById: Invalid ObjectId format for ID ${id}`);
        throw new CourseNotFoundException(id, true);
      }
      const course = await this.courseRepository.getById(id);
      if (!course) {
        this.logger.error(`course.service.getById: Course with ID ${id} not found`);
        throw new CourseNotFoundException(id);
      }
      return course;
    } catch (error) {
      this.logger.error(`course.service.getById: ${error.message}`, error.stack);
      throw error;
    }
  }
}