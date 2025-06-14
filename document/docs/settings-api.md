---
sidebar_position: 8
---

# Settings API

Learn how to manage application settings and configuration in the **Student Manager System** using NestJS ConfigModule and environment variables.

## Overview

The Settings API provides a centralized way to manage application configuration, including database connections, API settings, and feature flags. The system uses environment variables and configuration modules for flexible deployment across different environments.

## Configuration Structure

### Environment Variables

The application uses `.env` files for environment-specific settings:

```bash title=".env"
# Application
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/student_management

# Client
CLIENT_URL=http://localhost:3001

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DEST=./uploads

# API Settings
API_TIMEOUT=30000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### Configuration Module Setup

```typescript title="config/configuration.ts"
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true,
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    destination: process.env.UPLOAD_DEST || './uploads',
    allowedMimeTypes: {
      csv: ['text/csv', 'application/csv'],
      excel: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
    },
  },
  
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  api: {
    timeout: parseInt(process.env.API_TIMEOUT, 10) || 30000,
    rateLimit: {
      ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },
  },
});
```

## Loading Configuration

### In App Module

```typescript title="app.module.ts"
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        ...configService.get('mongodb.options'),
      }),
    }),
  ],
})
export class AppModule {}
```

### In Services

```typescript title="services/example.service.ts"
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExampleService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number;
  
  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('upload.destination');
    this.maxFileSize = this.configService.get<number>('upload.maxFileSize');
  }
  
  async processFile(file: Express.Multer.File) {
    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds limit');
    }
    // Process file
  }
}
```

## Feature-Specific Settings

### Database Settings

```typescript title="config/database.config.ts"
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: process.env.NODE_ENV === 'development',
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  },
  
  // Collection specific settings
  collections: {
    students: {
      indexes: [
        { ma_so_sinh_vien: 1 },
        { email: 1 },
        { 'khoa': 1, 'chuong_trinh': 1 },
      ],
    },
    courses: {
      indexes: [
        { ma_mon_hoc: 1 },
        { khoa: 1 },
      ],
    },
  },
}));
```

### File Upload Settings

```typescript title="config/upload.config.ts"
import { registerAs } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

export default registerAs('upload', () => ({
  storage: diskStorage({
    destination: process.env.UPLOAD_DEST || './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
    },
  }),
  
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
    files: parseInt(process.env.MAX_FILES, 10) || 1,
  },
  
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const ext = extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return cb(new BadRequestException('Invalid file type'), false);
    }
    
    cb(null, true);
  },
}));
```

### API Settings

```typescript title="config/api.config.ts"
import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  // Versioning
  version: process.env.API_VERSION || 'v1',
  
  // Security
  security: {
    helmet: {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
    },
    cors: {
      origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:3001'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },
  },
  
  // Pagination
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  // Timeouts
  timeouts: {
    server: parseInt(process.env.SERVER_TIMEOUT, 10) || 30000,
    database: parseInt(process.env.DB_TIMEOUT, 10) || 5000,
  },
}));
```

## Dynamic Settings Management

### Settings Service

```typescript title="settings/settings.service.ts"
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
  ) {}
  
  async get(key: string): Promise<any> {
    const setting = await this.settingModel.findOne({ key }).exec();
    return setting?.value;
  }
  
  async set(key: string, value: any): Promise<Setting> {
    return this.settingModel.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true },
    ).exec();
  }
  
  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    const settings = await this.settingModel.find({ key: { $in: keys } }).exec();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
  
  async delete(key: string): Promise<void> {
    await this.settingModel.deleteOne({ key }).exec();
  }
}
```

### Settings Schema

```typescript title="settings/schemas/setting.schema.ts"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ required: true, unique: true })
  key: string;
  
  @Prop({ type: Schema.Types.Mixed, required: true })
  value: any;
  
  @Prop()
  description?: string;
  
  @Prop()
  category?: string;
  
  @Prop({ default: true })
  isActive: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
```

### Settings Controller

```typescript title="settings/settings.controller.ts"
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  
  @Get(':key')
  @ApiOperation({ summary: 'Get setting by key' })
  async get(@Param('key') key: string) {
    return this.settingsService.get(key);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create or update setting' })
  async set(@Body() dto: { key: string; value: any }) {
    return this.settingsService.set(dto.key, dto.value);
  }
  
  @Get()
  @ApiOperation({ summary: 'Get multiple settings' })
  async getMultiple(@Query('keys') keys: string) {
    const keyArray = keys.split(',');
    return this.settingsService.getMultiple(keyArray);
  }
  
  @Delete(':key')
  @ApiOperation({ summary: 'Delete setting' })
  async delete(@Param('key') key: string) {
    return this.settingsService.delete(key);
  }
}
```

## Environment-Specific Configuration

### Development Settings

```typescript title="config/environments/development.ts"
export default {
  database: {
    synchronize: true,
    logging: true,
    debug: true,
  },
  
  api: {
    swagger: {
      enabled: true,
      path: 'api/docs',
    },
    cors: {
      origin: true, // Allow all origins in development
    },
  },
  
  logging: {
    level: 'debug',
    format: 'dev',
  },
};
```

### Production Settings

```typescript title="config/environments/production.ts"
export default {
  database: {
    synchronize: false,
    logging: false,
    ssl: true,
  },
  
  api: {
    swagger: {
      enabled: false,
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    },
    helmet: {
      enabled: true,
      contentSecurityPolicy: true,
    },
  },
  
  logging: {
    level: 'info',
    format: 'json',
  },
};
```

## Application Settings

### System Settings

```typescript title="config/system-settings.ts"
export const SystemSettings = {
  // Academic Year Settings
  academic: {
    currentYear: 2024,
    currentSemester: 1,
    semesterStartDate: '2024-09-01',
    semesterEndDate: '2025-01-15',
  },
  
  // Student Settings
  student: {
    idPrefix: 'SV',
    idLength: 8,
    maxCoursesPerSemester: 8,
    minCreditsPerSemester: 12,
    maxCreditsPerSemester: 24,
  },
  
  // Course Settings
  course: {
    maxStudentsPerClass: 50,
    minStudentsToOpen: 10,
    registrationDeadlineDays: 7,
  },
  
  // Grading Settings
  grading: {
    scale: {
      'A': { min: 8.5, max: 10 },
      'B': { min: 7.0, max: 8.4 },
      'C': { min: 5.5, max: 6.9 },
      'D': { min: 4.0, max: 5.4 },
      'F': { min: 0, max: 3.9 },
    },
    passingGrade: 4.0,
  },
};
```

### Feature Flags

```typescript title="config/feature-flags.ts"
export const FeatureFlags = {
  // Enable/disable features
  features: {
    studentRegistration: true,
    onlineEnrollment: true,
    gradeCalculation: true,
    transcriptGeneration: true,
    bulkImport: true,
    emailNotifications: false, // Coming soon
    smsNotifications: false,   // Coming soon
  },
  
  // Experimental features
  experimental: {
    advancedSearch: false,
    aiRecommendations: false,
    realTimeSync: false,
  },
};
```

## Settings Validation

### Configuration Validation

```typescript title="config/validation.ts"
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
    
  PORT: Joi.number()
    .min(1)
    .max(65535)
    .default(3000),
    
  MONGODB_URI: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\//)
    .required(),
    
  CLIENT_URL: Joi.string()
    .uri()
    .required(),
    
  MAX_FILE_SIZE: Joi.number()
    .min(1024) // 1KB minimum
    .max(52428800) // 50MB maximum
    .default(5242880), // 5MB default
    
  API_TIMEOUT: Joi.number()
    .min(1000)
    .max(300000)
    .default(30000),
});
```

### Runtime Validation

```typescript title="config/config.validator.ts"
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigValidator {
  constructor(private configService: ConfigService) {}
  
  validate(): void {
    const requiredConfigs = [
      'mongodb.uri',
      'cors.origin',
      'port',
    ];
    
    for (const config of requiredConfigs) {
      const value = this.configService.get(config);
      if (value === undefined || value === null || value === '') {
        throw new Error(`Missing required configuration: ${config}`);
      }
    }
    
    // Validate specific formats
    const mongoUri = this.configService.get<string>('mongodb.uri');
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format');
    }
    
    const port = this.configService.get<number>('port');
    if (port < 1 || port > 65535) {
      throw new Error('Port must be between 1 and 65535');
    }
  }
}
```

## Using Settings in Frontend

### API Configuration

```typescript title="client/src/config/api.config.ts"
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  students: '/students',
  faculties: '/faculties',
  courses: '/courses',
  enrollments: '/enrollments',
  transcripts: '/transcripts',
  settings: '/settings',
};
```

### Environment Configuration

```typescript title="client/src/config/environment.ts"
export const environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  
  features: {
    darkMode: process.env.REACT_APP_FEATURE_DARK_MODE === 'true',
    analytics: process.env.REACT_APP_FEATURE_ANALYTICS === 'true',
  },
  
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
  
  dateFormat: 'DD/MM/YYYY',
  language: 'vi',
};
```

## Best Practices

1. **Use environment variables** for sensitive data and deployment-specific settings
2. **Validate configuration** at startup to catch errors early
3. **Provide defaults** for non-critical settings
4. **Group related settings** using configuration namespaces
5. **Document all settings** with descriptions and examples
6. **Use type safety** with TypeScript interfaces
7. **Separate concerns** between static and dynamic settings
8. **Version your API** to support backward compatibility

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use secrets management** for production deployments
3. **Encrypt sensitive settings** in the database
4. **Limit access** to settings endpoints
5. **Audit setting changes** for compliance
6. **Validate all inputs** before storing settings

## See Also

- [Source Code Organization](./source-code-organization.md)
- [Database Schema](./database-schema.md)
- [API Documentation](./api-documentation.md)
