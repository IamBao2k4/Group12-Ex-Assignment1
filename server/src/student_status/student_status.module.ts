import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentStatusController } from './controllers/student_status.controller';
import { StudentStatusService } from './services/student_status.service';
import { StudentStatusRepository } from './repositories/student_status.repository';
import { STUDENT_STATUS_REPOSITORY } from './repositories/student_status.repository.interface';
import { StudentStatusSchema } from './schemas/student_status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'StudentStatus', schema: StudentStatusSchema }]),
  ],
  controllers: [StudentStatusController],
  providers: [
    StudentStatusService,
    {
      provide: STUDENT_STATUS_REPOSITORY,
      useClass: StudentStatusRepository,
    },
  ],
  exports: [MongooseModule],
})
export class StudentStatusModule {}