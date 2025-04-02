import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';
import { CourseRepository } from './repositories/course.repository';
import { COURSE_REPOSITORY } from './repositories/course.repository.interface';
import { CourseSchema } from './schemas/course.schema';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    forwardRef(() => StudentModule),
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseRepository,
    },
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    CourseService,
  ],
})
export class CourseModule {}