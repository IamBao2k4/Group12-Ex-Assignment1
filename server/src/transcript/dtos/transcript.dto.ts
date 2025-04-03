import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmpty,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateTranscriptDto {
  @IsMongoId({ message: 'Course ID must be a valid ID' })
  @IsEmpty()
  readonly ma_mon_hoc: string;

  @IsMongoId({ message: 'Student ID must be a valid ID' })
  @IsEmpty()
  readonly ma_so_sinh_vien: string;

  @IsNumber()
  @IsEmpty()
  readonly diem: number;

  @IsString()
  @IsEmpty()
  readonly trang_thai: string;
}

export class UpdateTranscriptDto {
  @IsMongoId({ message: 'Course ID must be a valid ID' })
  @IsOptional()
  readonly ma_mon_hoc?: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'Student ID must be a valid ID' })
  @IsOptional()
  readonly ma_so_sinh_vien?: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @IsOptional()
  readonly diem?: number;

  @IsString()
  @IsOptional()
  readonly trang_thai?: string;
}
