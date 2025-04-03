import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentController } from './controllers/enrollment.controller';
import { EnrollmentService } from './services/enrollment.service';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { EnrollmentSchema } from './schemas/enrollment.schema';
import { ENROLLMENT_REPOSITORY } from './repositories/enrollment.repository.interface';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Enrollment', schema: EnrollmentSchema }]),
    ConfigModule,
  ],
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService,
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepository,
    },
  ],
  exports: [
    EnrollmentService,
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepository,
    },
    MongooseModule.forFeature([{ name: 'Enrollment', schema: EnrollmentSchema }])
  ],
})
export class EnrollmentModule {} 