import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Query, 
  UsePipes, 
  ValidationPipe, 
  Logger,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { EnrollmentService } from '../services/enrollment.service';
import { CreateEnrollmentDto } from '../dtos/enrollment.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { 
  EnrollmentNotFoundException, 
  EnrollmentUpsertFailedException,
  EnrollmentValidationException,
  EnrollmentConflictException
} from '../exceptions';

@Controller('enrollments')
export class EnrollmentController {
  private readonly logger = new Logger(EnrollmentController.name);

  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async upsert(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    try {
      return await this.enrollmentService.upsert(createEnrollmentDto);
    } catch (error) {
      this.logger.error(`Error during enrollment upsert: ${error.message}`, error.stack);
      
      if (error instanceof EnrollmentValidationException || 
          error instanceof EnrollmentUpsertFailedException ||
          error instanceof EnrollmentConflictException) {
        throw error;
      }
      
      throw new HttpException(
        'An error occurred while processing your enrollment request', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async get(@Query() query: PaginationOptions) {
    try {
      return await this.enrollmentService.get(query);
    } catch (error) {
      this.logger.error(`Error fetching enrollments: ${error.message}`, error.stack);
      throw new HttpException(
        'An error occurred while fetching enrollments', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    try {
      const sanitizedId = id.trim();
      return await this.enrollmentService.detail(id);
    } catch (error) {
      this.logger.error(`Error fetching enrollment with ID ${id}: ${error.message}`, error.stack);
      
      if (error instanceof EnrollmentNotFoundException) {
        throw error;
      }
      
      throw new HttpException(
        'An error occurred while fetching the enrollment', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const sanitizedId = id.trim();
      return await this.enrollmentService.delete(sanitizedId);
    } catch (error) {
      this.logger.error(`Error deleting enrollment with ID ${id}: ${error.message}`, error.stack);
      
      if (error instanceof EnrollmentNotFoundException) {
        throw error;
      }
      
      throw new HttpException(
        'An error occurred while deleting the enrollment', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('/student/:studentId')
  async getByStudentId(@Param('studentId') studentId: string) {
    try {
      return await this.enrollmentService.getByStudentId(studentId);
    } catch (error) {
      this.logger.error(`Error fetching enrollment for student ID ${studentId}: ${error.message}`, error.stack);
      throw new HttpException(
        'An error occurred while fetching the enrollment', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(`/course/:courseId`)
  async deleteByCourseId(@Param('courseId') courseId: string) {
    try {
      return await this.enrollmentService.deleteByCourseId(courseId);
    } catch (error) {
      this.logger.error(`Error deleting enrollment for course ID ${courseId}: ${error.message}`, error.stack);
      throw new HttpException(
        'An error occurred while deleting the enrollment', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 