import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { StudentSchema } from './schemas/student.schema';
import { StudentRepository } from './repositories/student.repository';
import { STUDENT_REPOSITORY } from './repositories/student.repository.interface';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }])],
  controllers: [StudentController],
  providers: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentRepository,
    }
  ],
  exports: [StudentService],
})
export class StudentModule {}