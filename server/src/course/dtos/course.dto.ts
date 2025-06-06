import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsBoolean } from "class-validator";
import { ObjectId } from "mongoose";
import { CourseNameDto } from "./courseName.dto";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty({ description: 'Course code', example: 'CS101' })
    @IsString()
    @IsNotEmpty()
    readonly ma_mon_hoc: string; // Course code

    @ApiProperty({ description: 'Course name', example: 'Introduction to Programming' })
    @IsString()
    @IsNotEmpty()
    readonly ten: CourseNameDto; // Course name

    @ApiProperty({ description: 'Number of credits', example: 3 })
    @IsNumber()
    @IsNotEmpty()
    readonly tin_chi: number; // Credits

    @ApiProperty({ description: 'Faculty ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf5' })
    @IsString()
    @IsNotEmpty()
    readonly khoa: string; // Faculty ID

    @ApiPropertyOptional({ description: 'Prerequisite course IDs', type: [String], example: ['60d6ec9d1c9d440000d7dcf6'] })
    @IsArray()
    @IsOptional()
    readonly mon_tien_quyet?: ObjectId[]; // Prerequisite course IDs

    @ApiPropertyOptional({ description: 'Disable course flag', example: false })
    @IsBoolean()
    @IsOptional()
    readonly vo_hieu_hoa?: boolean; // Soft delete flag
}

export class UpdateCourseDto {
    @ApiPropertyOptional({ description: 'Course code', example: 'CS101' })
    @IsString()
    @IsOptional()
    readonly ma_mon_hoc?: string; // Course code

    @ApiPropertyOptional({ description: 'Course name', example: 'Introduction to Programming' })
    @IsString()
    @IsOptional()
    readonly ten?: CourseNameDto; // Course name

    @ApiPropertyOptional({ description: 'Number of credits', example: 3 })
    @IsNumber()
    @IsOptional()
    readonly tin_chi?: number; // Credits

    @ApiPropertyOptional({ description: 'Faculty ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf5' })
    @IsString()
    @IsOptional()
    readonly khoa?: string; // Faculty ID

    @ApiPropertyOptional({ description: 'Prerequisite course IDs', type: [String], example: ['60d6ec9d1c9d440000d7dcf6'] })
    @IsArray()
    @IsOptional()
    readonly mon_tien_quyet?: ObjectId[]; // Prerequisite course IDs

    @ApiPropertyOptional({ description: 'Disable course flag', example: false })
    @IsBoolean()
    @IsOptional()
    readonly vo_hieu_hoa?: boolean;
}