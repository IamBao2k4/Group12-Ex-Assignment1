import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { StudentRepository } from './repositories/student.repository';
import { StudentSchema } from './schemas/student.schema';
import { FacultyModule } from '../faculty/faculty.module';
import { ProgramModule } from '../program/program.module';
import { StudentStatusModule } from '../student_status/student_status.module';
import { EmailDomainValidator } from './validators/is-valid-email-domain.validator';
import { PhoneNumberValidator } from './validators/is-valid-phone-number.validator';
import { ConfigModule } from '@nestjs/config';
import { STUDENT_REPOSITORY } from './repositories/student.repository.interface';
import { TranscriptModule } from 'src/transcript/transcript.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    forwardRef(() => FacultyModule),
    forwardRef(() => ProgramModule),
    forwardRef(() => StudentStatusModule),
    ConfigModule,
    TranscriptModule,
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentRepository,
    },
    EmailDomainValidator,
    PhoneNumberValidator,
  ],
  exports: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentRepository,
    },
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
  ],
})
export class StudentModule {}
