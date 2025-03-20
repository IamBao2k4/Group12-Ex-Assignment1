import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { StudentSchema } from '../student/schemas/student.schema';
import { FacultyModule } from '../faculty/faculty.module';
import { ProgramModule } from '../program/program.module';
import { StudentStatusModule } from '../student_status/student_status.module';
import { FacultyRepository } from '../faculty/repositories/faculty.repository';
import { ProgramRepository } from '../program/repositories/program.repository';
import { StudentStatusRepository } from '../student_status/repositories/student_status.repository';
import { FACULTY_REPOSITORY } from '../faculty/repositories/faculty.repository.interface';
import { PROGRAM_REPOSITORY } from '../program/repositories/program.repository.interface';
import { STUDENT_STATUS_REPOSITORY } from '../student_status/repositories/student_status.repository.interface';
import { FacultyService } from '../faculty/services/faculty.service';
import { ProgramService } from '../program/services/program.service';
import { StudentStatusService } from '../student_status/services/student_status.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema }
    ]),
    FacultyModule,
    ProgramModule,
    StudentStatusModule
  ],
  controllers: [ExportController],
  providers: [
    ExportService,
    FacultyService,
    ProgramService,
    StudentStatusService,
    {
      provide: FACULTY_REPOSITORY,
      useClass: FacultyRepository,
    },
    {
      provide: PROGRAM_REPOSITORY,
      useClass: ProgramRepository,
    },
    {
      provide: STUDENT_STATUS_REPOSITORY,
      useClass: StudentStatusRepository,
    }
  ],
  exports: [ExportService]
})
export class ExportModule {} 