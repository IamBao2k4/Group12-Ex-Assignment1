import { Module } from '@nestjs/common';
import { StudentStatusController } from './student_status.controller';
import { StudentStatusService } from './student_status.service';

@Module({
  controllers: [StudentStatusController],
  providers: [StudentStatusService]
})
export class StudentStatusModule {}
