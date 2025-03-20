import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramController } from './controllers/program.controller';
import { ProgramService } from './services/program.service';
import { ProgramRepository } from './repositories/program.repository';
import { PROGRAM_REPOSITORY } from './repositories/program.repository.interface';
import { ProgramSchema } from './schemas/program.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Program', schema: ProgramSchema }]),
  ],
  controllers: [ProgramController],
  providers: [
    ProgramService,
    {
      provide: PROGRAM_REPOSITORY,
      useClass: ProgramRepository,
    },
  ],
  exports: [MongooseModule],
})
export class ProgramModule {}