import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultyController } from './controllers/faculty.controller';
import { FacultyService } from './services/faculty.service';
import { FacultyRepository } from './repositories/faculty.repository';
import { FACULTY_REPOSITORY } from './repositories/faculty.repository.interface';
import { FacultySchema } from './schemas/faculty.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Faculty', schema: FacultySchema }]),
  ],
  controllers: [FacultyController],
  providers: [
    FacultyService,
    {
      provide: FACULTY_REPOSITORY,
      useClass: FacultyRepository,
    },
  ],
  exports: [FACULTY_REPOSITORY],
})
export class FacultyModule {}