import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentStatusController } from './controllers/student_status.controller';
import { StudentStatusService } from './services/student_status.service';
import { StudentStatusRepository } from './repositories/student_status.repository';
import { STUDENT_STATUS_REPOSITORY } from './repositories/student_status.repository.interface';
import { StudentStatusSchema } from './schemas/student_status.schema';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'StudentStatus', schema: StudentStatusSchema }]),
    forwardRef(() => StudentModule),
  ],
  controllers: [StudentStatusController],
  providers: [
    StudentStatusService,
    {
      provide: STUDENT_STATUS_REPOSITORY,
      useClass: StudentStatusRepository,
    },
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'StudentStatus', schema: StudentStatusSchema }]),
    StudentStatusService
  ],
})
export class StudentStatusModule {}