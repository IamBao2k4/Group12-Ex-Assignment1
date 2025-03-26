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

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsString()
  ma_so_sinh_vien: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  ho_ten: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString()
  ngay_sinh: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsString()
  gioi_tinh: string;

  @IsMongoId({ message: 'Faculty ID must be a valid ID' })
  khoa: string;

  @IsNotEmpty({ message: 'Academic year is required' })
  @IsString()
  khoa_hoc: string;

  @IsMongoId({ message: 'Program ID must be a valid ID' })
  chuong_trinh: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  dia_chi_thuong_tru?: AddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  dia_chi_tam_tru?: AddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  dia_chi_nhan_thu?: AddressDto;

  @IsNotEmpty({ message: 'Identity documents are required' })
  @IsArray({ message: 'Identity documents must be an array' })
  @ArrayMinSize(1, { message: 'At least one identity document is required' })
  @ValidateNested({ each: true })
  @Type(() => IDDocumentDto)
  giay_to_tuy_than: IDDocumentDto[];

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsValidEmailDomain({ message: 'Email must belong to an accepted domain' })
  email?: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsValidPhoneNumber({ message: 'Invalid phone number' })
  so_dien_thoai?: string;

  @IsOptional()
  @IsMongoId({ message: 'Student status ID must be a valid ID' })
  tinh_trang: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  ma_so_sinh_vien?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  readonly ho_ten?: string;

  @IsOptional()
  @IsDateString()
  readonly ngay_sinh?: string;

  @IsOptional()
  @IsString()
  readonly gioi_tinh?: string;

  @IsOptional()
  @IsMongoId({ message: 'Faculty ID must be a valid ID' })
  readonly khoa?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString()
  readonly khoa_hoc?: string;

  @IsOptional()
  @IsMongoId({ message: 'Program ID must be a valid ID' })
  readonly chuong_trinh?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly dia_chi_thuong_tru?: AddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly dia_chi_tam_tru?: AddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly dia_chi_nhan_thu?: AddressDto;

  @IsOptional()
  @IsMongoId({ message: 'Student status ID must be a valid ID' })
  readonly tinh_trang?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  @IsValidEmailDomain({ message: 'Email must belong to an accepted domain' })
  readonly email?: string;

  @IsOptional()
  @IsValidPhoneNumber({ message: 'Invalid phone number' })
  readonly so_dien_thoai?: string;

  @IsNotEmpty({ message: 'Identity documents are required' })
  @IsArray({ message: 'Identity documents must be an array' })
  @ArrayMinSize(1, { message: 'At least one identity document is required' })
  @ValidateNested({ each: true })
  @Type(() => IDDocumentDto)
  giay_to_tuy_than: IDDocumentDto[];
}

export class FindStudentDto {
  @IsOptional()
  @IsString()
  readonly ma_so_sinh_vien?: string;

  @IsOptional()
  @IsString()
  readonly ho_ten?: string;

  @IsOptional()
  @IsDateString()
  readonly ngay_sinh?: string;

  @IsOptional()
  @IsString()
  readonly gioi_tinh?: string;

  @IsOptional()
  @IsString()
  readonly khoa?: string;

  @IsOptional()
  @IsString()
  readonly khoa_hoc?: string;

  @IsOptional()
  @IsString()
  readonly chuong_trinh?: string;

  @IsOptional()
  @IsString()
  readonly dia_chi?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email?: string;

  @IsOptional()
  @IsValidPhoneNumber({ message: 'Invalid phone number' })
  readonly so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  readonly tinh_trang?: string;
}

export class DeleteStudentDto {
  @IsString()
  readonly ma_so_sinh_vien: string;
}