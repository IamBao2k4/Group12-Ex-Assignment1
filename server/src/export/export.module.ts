import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { StudentSchema } from '../student/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema }
    ])
  ],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService]
})
export class ExportModule {} 