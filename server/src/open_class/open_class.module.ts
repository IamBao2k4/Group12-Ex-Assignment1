import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenClassController } from './controllers/open_class.controller';
import { OpenClassService } from './services/open_class.service';
import { OpenClassRepository } from './repositories/open_class.repository';
import { OPEN_CLASS_REPOSITORY } from './repositories/open_class.repository.interface';
import { OpenClassSchema } from './schemas/open_class.schema';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OpenClass', schema: OpenClassSchema }]),
    forwardRef(() => StudentModule),
  ],
  controllers: [OpenClassController],
  providers: [
    OpenClassService,
    {
      provide: OPEN_CLASS_REPOSITORY,
      useClass: OpenClassRepository,
    },
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'OpenClass', schema: OpenClassSchema }]),
    OpenClassService,
  ],
})
export class OpenClassModule {}
