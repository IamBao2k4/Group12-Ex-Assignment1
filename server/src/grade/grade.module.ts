import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeController } from './controllers/grade.controller';
import { GradeService } from './services/grade.service';
import { GradeRepository } from './repositories/grade.repository';
import { GRADE_REPOSITORY } from './repositories/grade.repository.interface';
import { GradeSchema } from './schemas/grade.schema';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grade', schema: GradeSchema }]),
    forwardRef(() => StudentModule),
  ],
  controllers: [GradeController],
  providers: [
    GradeService,
    {
      provide: GRADE_REPOSITORY,
      useClass: GradeRepository,
    },
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Grade', schema: GradeSchema }]),
    GradeService,
  ],
})
export class GradeModule {}
