import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { StudentSchema } from './schemas/student.schema';
import { StudentRepository } from './repositories/student.repository';
import { STUDENT_REPOSITORY } from './repositories/student.repository.interface';
import { IsFacultyExistsConstraint } from './validators/is-faculty-exists.validator';
import { IsProgramExistsConstraint } from './validators/is-program-exists.validator';
import { IsStudentStatusExistsConstraint } from './validators/is-student-status-exists.validator';
import { FacultyModule } from '../faculty/faculty.module'; 
import { ProgramModule } from '../program/program.module'; 
import { StudentStatusModule } from '../student_status/student_status.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    FacultyModule, 
    ProgramModule, 
    StudentStatusModule, 
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentRepository,
    },
    IsFacultyExistsConstraint,
    IsProgramExistsConstraint,
    IsStudentStatusExistsConstraint,
  ],
  exports: [
    StudentService,
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }])
  ],
})
export class StudentModule { }