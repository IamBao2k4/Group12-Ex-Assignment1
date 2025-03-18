import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { FacultyModule } from './faculty/faculty.module';
import { StudentStatusModule } from './student_status/student_status.module';
import { ProgramModule } from './program/program.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exceptions/http-exception.filter';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', 
      isGlobal: true,      
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/default'),
    StudentModule,
    FacultyModule,
    StudentStatusModule,
    ProgramModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
