import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/http-exception.filter';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Log môi trường ngay khi bắt đầu
  logger.log(`Starting application in ${process.env.NODE_ENV || 'development'} environment`);

  const app = await NestFactory.create(AppModule);
  
  // Cho phép validators sử dụng dependency injection
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = formatValidationErrors(validationErrors);
        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
      stopAtFirstError: false,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}


function formatValidationErrors(
  errors: ValidationError[], 
  parentField = ''
): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  errors.forEach(error => {
    const field = parentField ? `${parentField}.${error.property}` : error.property;
    
    if (error.constraints) {
      formattedErrors[field] = Object.values(error.constraints);
    }
    
    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children, field);
      Object.assign(formattedErrors, childErrors);
    }
  });

  return formattedErrors;
}

bootstrap();
