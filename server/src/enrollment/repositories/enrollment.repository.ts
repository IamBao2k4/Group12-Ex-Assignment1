import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from '../interfaces/enrollment.interface';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../dtos/enrollment.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { IEnrollmentRepository } from './enrollment.repository.interface';
import { 
  EnrollmentNotFoundException, 
  EnrollmentUpsertFailedException,
  EnrollmentConflictException
} from '../exceptions';

@Injectable()
export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @InjectModel('Enrollment') private readonly enrollmentModel: Model<Enrollment>,
  ) {}

  async create(enrollment: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      const newEnrollment = new this.enrollmentModel(enrollment);
      return await newEnrollment.save();
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        const { ma_sv, ma_lop_mo } = enrollment;
        throw new EnrollmentConflictException(ma_sv, ma_lop_mo, 'Duplicate entry found with a different ID');
      }
      throw error;
    }
  }

  async update(id: string, enrollment: UpdateEnrollmentDto): Promise<Enrollment> {
    try {
      const updatedEnrollment = await this.enrollmentModel.findByIdAndUpdate(
        id,
        {
          ...enrollment,
          updated_at: new Date(),
        },
        { new: true },
      );
      
      if (!updatedEnrollment) {
        throw new EnrollmentNotFoundException(id);
      }
      
      return updatedEnrollment;
    } catch (error) {
      if (error instanceof EnrollmentNotFoundException) {
        throw error;
      }
      throw new EnrollmentUpsertFailedException(error.message);
    }
  }

  async findById(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel.findById(id).exec();
    
    if (!enrollment) {
      throw new EnrollmentNotFoundException(id);
    }
    
    return enrollment;
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResponse<Enrollment>> {
    try {
      const query = this.enrollmentModel.find({ deleted_at: null });
      const total = await this.enrollmentModel.countDocuments({ deleted_at: null }).exec();
      
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      
      if (options?.page && options?.limit) {
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);
      }
      
      const data = await query.exec();
      const totalPages = Math.ceil(total / limit);
      
      return new PaginatedResponse<Enrollment>(data, page, limit, totalPages, total);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<Enrollment> {
    const deletedEnrollment = await this.enrollmentModel.findByIdAndUpdate(
      id,
      {
        deleted_at: new Date(),
      },
      { new: true },
    );
    
    if (!deletedEnrollment) {
      throw new EnrollmentNotFoundException(id);
    }
    
    return deletedEnrollment;
  }

  async upsert(enrollment: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      const { ma_sv, ma_lop_mo } = enrollment;
      
      // Query filter based on the compound key
      const filter = { ma_sv, ma_lop_mo, deleted_at: null };
      
      // Update operation with proper handling of timestamps
      const update = {
        $set: {
          ...enrollment,
          updated_at: new Date(),
        },
        // Only set created_at when inserting a new document
        $setOnInsert: {
          created_at: new Date()
        }
      };
      
      // Perform upsert with MongoDB native upsert option
      const upsertedEnrollment = await this.enrollmentModel.findOneAndUpdate(
        filter,
        update,
        { 
          new: true,            // Return the modified document
          upsert: true,         // Create document if it doesn't exist
          setDefaultsOnInsert: true  // Apply schema defaults for new documents
        }
      ).exec();
      
      if (!upsertedEnrollment) {
        throw new EnrollmentUpsertFailedException();
      }
      
      return upsertedEnrollment;
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error
        const { ma_sv, ma_lop_mo } = enrollment;
        throw new EnrollmentConflictException(
          ma_sv, 
          ma_lop_mo, 
          'Duplicate entry found with a different ID'
        );
      }
      
      if (error instanceof EnrollmentUpsertFailedException) {
        throw error;
      }
      
      throw new EnrollmentUpsertFailedException(error.message);
    }
  }

  async findByStudentId(studentId: string): Promise<Enrollment[]> {
    try {
      return await this.enrollmentModel.find({ ma_sv: studentId, deleted_at: null }).exec();
    } catch (error) {
      throw error;
    }
  }

  async deleteByCourseId(courseId: string) {
    try {
      await this.enrollmentModel.findOneAndDelete(
        { ma_mon: courseId },
      );
      
    } catch (error) {
      console.error(`Error occurred while deleting enrollment: ${error.message}`);
      throw error;
    }
  }
} 