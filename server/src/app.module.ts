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
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exceptions/http-exception.filter';
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
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
