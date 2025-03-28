import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { StudentModule } from '../student/student.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultyModule } from '../faculty/faculty.module';
import { ProgramModule } from '../program/program.module';
import { FacultyRepository } from '../faculty/repositories/faculty.repository';
import { ProgramRepository } from '../program/repositories/program.repository';
import { FACULTY_REPOSITORY } from '../faculty/repositories/faculty.repository.interface';
import { PROGRAM_REPOSITORY } from '../program/repositories/program.repository.interface';
import { FacultyService } from '../faculty/services/faculty.service';
import { ProgramService } from '../program/services/program.service';

@Module({
    imports: [
        StudentModule,
        FacultyModule,
        ProgramModule,
    ],
    controllers: [ImportController],
    providers: [
        ImportService,
        FacultyService,
        ProgramService,
        {
            provide: FACULTY_REPOSITORY,
            useClass: FacultyRepository,
        },
        {
            provide: PROGRAM_REPOSITORY,
            useClass: ProgramRepository,
        }
    ],
})
export class ImportModule { } 