import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../interfaces/course.interface';
import { ICourseRepository } from './course.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from '../../common/exceptions/base.exception';
import { CourseNotFoundException } from '../exceptions/course-not-found.exception';

@Injectable()
export class CourseRepository implements ICourseRepository {
  private readonly logger = new Logger(CourseRepository.name);

  constructor(@InjectModel('Course') private courseModel: Model<Course>) {}

  async create(courseData: any): Promise<Course> {
    const course = new this.courseModel(courseData);
    let createdCourse: Course | null = null;
    try {
      createdCourse = await course.save();
    } catch (error) {
      this.logger.error('course.repository.create: Error creating course', error.stack);
      throw new BaseException(error, 'CREATE_COURSE_ERROR');
    }
    return createdCourse;
  }

  async update(id: string, courseData: Partial<Course>): Promise<Course | null> {
    try {
      const updatedCourse = await this.courseModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }]
          },
          courseData,
          { new: true }
        )
        .exec();
      
      if (!updatedCourse) {
        throw new CourseNotFoundException(id);
      }
      
      return updatedCourse;
    } catch (error) {
      if (error instanceof CourseNotFoundException) {
        throw error;
      }
      this.logger.error(`course.repository.update: Error updating course with ID ${id}`, error.stack);
      throw new BaseException(error, 'UPDATE_COURSE_ERROR');
    }
  }

  async findAll(
    paginationOpts: PaginationOptions,
    faculty: string,
    available: string,
  ): Promise<PaginatedResponse<Course>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();
    const  page = pagination.Page();

    let query: any = { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] };

    if (faculty) {
      query = {
        $and: [
          { $or: [{ ma_khoa: faculty }, { ten_khoa: faculty }]},
          query,
        ]
      };
    }
    if (available === 'true') {
      query = {
        $and: [
          { $or: [{ vo_hieu_hoa: { $exists: false } }, { vo_hieu_hoa: false }]},
          query,
        ]
      };
    }
    if (available === 'false') {
      query = {
        $and: [
          { $or: [{ vo_hieu_hoa: { $exists: true } }, { vo_hieu_hoa: true }]},
          query,
        ]
      };
    }
    let courses: Course[] = [];
    try {
      courses = await this.courseModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.error('course.repository.findAll: Error finding courses', error.stack);
      throw new BaseException(error, 'FIND_ALL_COURSE_ERROR');
    }

    let total = 0;
    try {
      total = await this.courseModel.countDocuments({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] });
    } catch (error) {
      this.logger.error('course.repository.findAll: Error counting courses', error.stack);
      throw new BaseException(error, 'COUNT_COURSES_ERROR');
    }
    
    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<Course>(
      courses,
      page,
      limit,
      totalPages,
      total,
    );
  }

  async findAllAvailable(): Promise<Course[]> {
    let courses: Course[] = [];
    const query = {
      $and: [
        { $or: [{vo_hieu_hoa: { $exists: false }}, {vo_hieu_hoa: false}] },
        { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] },
      ],
    };
    try {
      courses = await this.courseModel
        .find(query)
        .exec();
      console.log('courses', courses);
    } catch (error) {
      this.logger.error('course.repository.getAllAvailable: Error getting all available courses', error.stack);
      throw new BaseException(error, 'GET_ALL_AVAILABLE_COURSES_ERROR');
    }
    return courses;
  }

  async softDelete(id: string): Promise<Course | null> {
    try {
      const deletedCourse = await this.courseModel
        .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
        .exec();
      
      if (!deletedCourse) {
        throw new CourseNotFoundException(id);
      }
      
      return deletedCourse;
    } catch (error) {
      if (error instanceof CourseNotFoundException) {
        throw error;
      }
      this.logger.error(`course.repository.softDelete: Error deleting course with ID ${id}`, error.stack);
      throw new BaseException(error, 'DELETE_COURSE_ERROR');
    }
  }

  async getAll(): Promise<Course[]> {
    let courses: Course[] = [];
    try {
      courses = await this.courseModel.find({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error('course.repository.getAll: Error getting all courses', error.stack);
      throw new BaseException(error, 'GET_ALL_COURSES_ERROR');
    }
    return courses;
  }

  async findByCode(code: string): Promise<Course | null> {
    try {
      return this.courseModel.findOne({ ma_mon_hoc: code, $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error(`course.repository.findByCode: Error finding course by code ${code}`, error.stack);
      throw new BaseException(error, 'FIND_COURSE_BY_CODE_ERROR');
    }
  }

  async detail(id: string): Promise<Course | null> {
    try {
      return this.courseModel.findOne({ _id: id, $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error(`course.repository.detail: Error finding course by id ${id}`, error.stack);
      throw new BaseException(error, 'FIND_COURSE_BY_ID_ERROR');
    }
  }

  async getById(id: string): Promise<Course | null> {
    try {
      return this.courseModel.findOne({ _id: id, $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error(`course.repository.getById: Error finding course by id ${id}`, error.stack);
      throw new BaseException(error, 'FIND_COURSE_BY_ID_ERROR');
    }
  }
}