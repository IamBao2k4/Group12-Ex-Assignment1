import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { FacultyModule } from './faculty/faculty.module';
import { StudentStatusModule } from './student_status/student_status.module';
import { ProgramModule } from './program/program.module';
import { ImportModule } from './import/import.module';
import { ExportModule } from './export/export.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CourseModule } from './course/course.module';
import { TranscriptModule } from './transcript/transcript.module';
import { GradeModule } from './grade/grade.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exceptions/http-exception.filter';
import { ApiLoggerService } from './common/logger/api-logger.service';
import { ApiLoggerInterceptor } from './common/logger/api-logger.interceptor';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
    }),
    StudentModule,
    FacultyModule,
    StudentStatusModule,
    ProgramModule,
    ImportModule,
    ExportModule,
    EnrollmentModule,
    CourseModule,
    TranscriptModule,
    GradeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApiLoggerService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiLoggerInterceptor,
    },
  ],
})
export class AppModule { }
