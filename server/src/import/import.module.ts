import { Module } from '@nestjs/common';
import { ImportController } from './import.controller.js';
import { ImportService } from './import.service.js';
import { StudentModule } from '../student/student.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        StudentModule,
    ],
    controllers: [ImportController],
    providers: [ImportService],
})
export class ImportModule { } 