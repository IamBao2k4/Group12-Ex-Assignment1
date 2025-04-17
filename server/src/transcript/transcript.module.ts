import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TranscriptController } from './controllers/transcript.controller';
import { TranscriptService } from './services/transcript.service';
import { TranscriptRepository } from './repositories/transcript.repository';
import { TRANSCRIPT_REPOSITORY } from './repositories/transcript.repository.interface';
import { TranscriptSchema } from './schemas/transcript.schema';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transcript', schema: TranscriptSchema },
    ]),
    forwardRef(() => StudentModule),
  ],
  controllers: [TranscriptController],
  providers: [
    TranscriptService,
    {
      provide: TRANSCRIPT_REPOSITORY,
      useClass: TranscriptRepository,
    },
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'Transcript', schema: TranscriptSchema },
    ]),
    TranscriptService,
    MongooseModule,
  ],
})
export class TranscriptModule {}
