import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Log môi trường ngay khi bắt đầu
  logger.log(`Starting application in ${process.env.NODE_ENV || 'development'} environment`);

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
