import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  ValidateNested,
  IsObject,
  IsArray,
  ArrayMinSize,
  IsMongoId,
} from 'class-validator';
import { IsValidEmailDomain } from '../validators/is-valid-email-domain.validator';
import { IsValidPhoneNumber } from '../validators/is-valid-phone-number.validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { IDDocumentDto } from './id-document.dto';
import { GenderDto } from './gender.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'Student ID', example: '20010789' })
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsString()
  ma_so_sinh_vien: string;

  @ApiProperty({ description: 'Full name of the student', example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  ho_ten: string;

  @ApiProperty({ description: 'Date of birth', example: '2000-01-01' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString()
  ngay_sinh: string;

  @ApiProperty({ description: 'Gender', example: 'Nam', enum: ['Nam', 'Nữ', 'Khác'] })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsObject()
  gioi_tinh: GenderDto;

  @ApiProperty({ description: 'Faculty ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf5' })
  @IsMongoId({ message: 'Faculty ID must be a valid ID' })
  khoa: string;

  @ApiProperty({ description: 'Academic year', example: '2020-2024' })
  @IsNotEmpty({ message: 'Academic year is required' })
  @IsString()
  khoa_hoc: string;

  @ApiProperty({ description: 'Program ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf7' })
  @IsMongoId({ message: 'Program ID must be a valid ID' })
  chuong_trinh: string;

  @ApiPropertyOptional({ description: 'Permanent address', type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  dia_chi_thuong_tru?: AddressDto;

  @ApiPropertyOptional({ description: 'Temporary address', type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  dia_chi_tam_tru?: AddressDto;

  @ApiPropertyOptional({ description: 'Mailing address', type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  dia_chi_nhan_thu?: AddressDto;

  @ApiProperty({ 
    description: 'Identity documents',
    type: [IDDocumentDto],
    example: [{ type: 'cmnd', so: '123456789', ngay_cap: '2020-01-01', noi_cap: 'CA TP.HCM' }]
  })
  @IsNotEmpty({ message: 'Identity documents are required' })
  @IsArray({ message: 'Identity documents must be an array' })
  @ArrayMinSize(1, { message: 'At least one identity document is required' })
  @ValidateNested({ each: true })
  @Type(() => IDDocumentDto)
  giay_to_tuy_than: IDDocumentDto[];

  @ApiProperty({ description: 'Email address (must be from an accepted domain)', example: 'student@university.edu.vn' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsValidEmailDomain({ message: 'Email must belong to an accepted domain' })
  email?: string;

  @ApiProperty({ description: 'Phone number (Vietnamese format)', example: '0912345678' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsValidPhoneNumber({ message: 'Invalid phone number' })
  so_dien_thoai?: string;

  @ApiPropertyOptional({ description: 'Student status ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf9' })
  @IsOptional()
  @IsMongoId({ message: 'Student status ID must be a valid ID' })
  tinh_trang: string;
}

export class UpdateStudentDto {
  @ApiPropertyOptional({ description: 'Student ID', example: '20010789' })
  @IsOptional()
  @IsString()
  ma_so_sinh_vien?: string;

  @ApiPropertyOptional({ description: 'MongoDB ID', example: '60d6ec9d1c9d440000d7dcf3' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Full name of the student', example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  readonly ho_ten?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '2000-01-01' })
  @IsOptional()
  @IsDateString()
  readonly ngay_sinh?: string;

  @ApiPropertyOptional({ description: 'Gender', example: 'Nam', enum: ['Nam', 'Nữ', 'Khác'] })
  @IsOptional()
  @IsObject()
  readonly gioi_tinh?: GenderDto;

  @ApiPropertyOptional({ description: 'Faculty ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf5' })
  @IsOptional()
  @IsMongoId({ message: 'Faculty ID must be a valid ID' })
  readonly khoa?: mongoose.Schema.Types.ObjectId;

  @ApiPropertyOptional({ description: 'Academic year', example: '2020-2024' })
  @IsOptional()
  @IsString()
  readonly khoa_hoc?: string;

  @ApiPropertyOptional({ description: 'Program ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf7' })
  @IsOptional()
  @IsMongoId({ message: 'Program ID must be a valid ID' })
  readonly chuong_trinh?: mongoose.Schema.Types.ObjectId;

  @ApiPropertyOptional({ description: 'Permanent address', type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly dia_chi_thuong_tru?: AddressDto;

  @ApiPropertyOptional({ description: 'Temporary address', type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly dia_chi_tam_tru?: AddressDto;

  @ApiPropertyOptional({ description: 'Mailing address', type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly dia_chi_nhan_thu?: AddressDto;

  @ApiPropertyOptional({ description: 'Student status ID (MongoDB ObjectId)', example: '60d6ec9d1c9d440000d7dcf9' })
  @IsOptional()
  @IsMongoId({ message: 'Student status ID must be a valid ID' })
  readonly tinh_trang?: mongoose.Schema.Types.ObjectId;

  @ApiPropertyOptional({ description: 'Email address (must be from an accepted domain)', example: 'student@university.edu.vn' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  @IsValidEmailDomain({ message: 'Email must belong to an accepted domain' })
  readonly email?: string;

  @ApiPropertyOptional({ description: 'Phone number (Vietnamese format)', example: '0912345678' })
  @IsOptional()
  @IsValidPhoneNumber({ message: 'Invalid phone number' })
  readonly so_dien_thoai?: string;

  @ApiProperty({ 
    description: 'Identity documents',
    type: [IDDocumentDto],
    example: [{ type: 'cmnd', so: '123456789', ngay_cap: '2020-01-01', noi_cap: 'CA TP.HCM' }]
  })
  @IsNotEmpty({ message: 'Identity documents are required' })
  @IsArray({ message: 'Identity documents must be an array' })
  @ArrayMinSize(1, { message: 'At least one identity document is required' })
  @ValidateNested({ each: true })
  @Type(() => IDDocumentDto)
  giay_to_tuy_than: IDDocumentDto[];
}

export class FindStudentDto {
  @ApiPropertyOptional({ description: 'Student ID', example: '20010789' })
  @IsOptional()
  @IsString()
  readonly ma_so_sinh_vien?: string;

  @ApiPropertyOptional({ description: 'Full name of the student', example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  readonly ho_ten?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '2000-01-01' })
  @IsOptional()
  @IsDateString()
  readonly ngay_sinh?: string;

  @ApiPropertyOptional({ description: 'Gender', example: 'Nam', enum: ['Nam', 'Nữ', 'Khác'] })
  @IsOptional()
  @IsObject()
  readonly gioi_tinh?: GenderDto;

  @ApiPropertyOptional({ description: 'Faculty ID', example: '60d6ec9d1c9d440000d7dcf5' })
  @IsOptional()
  @IsString()
  readonly khoa?: string;

  @ApiPropertyOptional({ description: 'Academic year', example: '2020-2024' })
  @IsOptional()
  @IsString()
  readonly khoa_hoc?: string;

  @ApiPropertyOptional({ description: 'Program ID', example: '60d6ec9d1c9d440000d7dcf7' })
  @IsOptional()
  @IsString()
  readonly chuong_trinh?: string;

  @ApiPropertyOptional({ description: 'Address (any part of address)', example: 'Quận 1' })
  @IsOptional()
  @IsString()
  readonly dia_chi?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'student@university.edu.vn' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '0912345678' })
  @IsOptional()
  @IsValidPhoneNumber({ message: 'Invalid phone number' })
  readonly so_dien_thoai?: string;

  @ApiPropertyOptional({ description: 'Student status ID', example: '60d6ec9d1c9d440000d7dcf9' })
  @IsOptional()
  @IsString()
  readonly tinh_trang?: string;
}

export class DeleteStudentDto {
  @ApiProperty({ description: 'Student ID', example: '20010789' })
  @IsString()
  readonly ma_so_sinh_vien: string;
}