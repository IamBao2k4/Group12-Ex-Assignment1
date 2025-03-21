import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  Matches,
  ValidateNested,
  IsObject,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { IsFacultyExists } from '../validators/is-faculty-exists.validator';
import { IsProgramExists } from '../validators/is-program-exists.validator';
import { IsStudentStatusExists } from '../validators/is-student-status-exists.validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { IDDocumentDto } from './id-document.dto';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Mã số sinh viên không được để trống' })
  @IsString()
  ma_so_sinh_vien: string;

  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  ho_ten: string;

  @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
  @IsDateString()
  ngay_sinh: string;

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  @IsString()
  gioi_tinh: string;

  @IsFacultyExists({ message: 'Faculty does not exist' })
  khoa: string;

  @IsNotEmpty({ message: 'Khóa học không được để trống' })
  @IsString()
  khoa_hoc: string;

  @IsProgramExists({ message: 'Program does not exist' })
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

  @IsNotEmpty({ message: 'Giấy tờ tùy thân không được để trống' })
  @IsArray({ message: 'Giấy tờ tùy thân phải là một mảng' })
  @ArrayMinSize(1, { message: 'Phải có ít nhất một giấy tờ tùy thân' })
  @ValidateNested({ each: true })
  @Type(() => IDDocumentDto)
  giay_to_tuy_than: IDDocumentDto[];

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  so_dien_thoai?: string;

  @IsStudentStatusExists({ message: 'Student status does not exist' })
  tinh_trang: string;
}

export class UpdateStudentDto {
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
  @IsFacultyExists({ message: 'Faculty does not exist' })
  readonly khoa?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString()
  readonly khoa_hoc?: string;

  @IsOptional()
  @IsProgramExists({ message: 'Program does not exist' })
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
  @IsStudentStatusExists({ message: 'Student status does not exist' })
  readonly tinh_trang?: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Giấy tờ tùy thân không được để trống' })
  @IsArray({ message: 'Giấy tờ tùy thân phải là một mảng' })
  @ArrayMinSize(1, { message: 'Phải có ít nhất một giấy tờ tùy thân' })
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
  @IsEmail({}, { message: 'Email không hợp lệ' })
  readonly email?: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  readonly so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  readonly tinh_trang?: string;
}

// export class FindStudentDto {
//   @IsOptional()
//   @IsString()
//   readonly ma_so_sinh_vien?: string;

//   @IsOptional()
//   @IsString()
//   readonly ho_ten?: string;

//   @IsOptional()
//   @IsDateString()
//   readonly ngay_sinh?: string;

//   @IsOptional()
//   @IsString()
//   readonly gioi_tinh?: string;

//   @IsOptional()
//   @IsString()
//   readonly khoa?: string;

//   @IsOptional()
//   @IsString()
//   readonly khoa_hoc?: string;

//   @IsOptional()
//   @IsString()
//   readonly chuong_trinh?: string;

//   @IsOptional()
//   @IsObject()
//   @ValidateNested()
//   @Type(() => AddressDto)
//   readonly dia_chi_thuong_tru?: AddressDto;

//   @IsOptional()
//   @IsObject()
//   @ValidateNested()
//   @Type(() => AddressDto)
//   readonly dia_chi_tam_tru?: AddressDto;

//   @IsOptional()
//   @IsObject()
//   @ValidateNested()
//   @Type(() => AddressDto)
//   readonly dia_chi_nhan_thu?: AddressDto;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => IDDocumentDto)
//   readonly giay_to_tuy_than?: IDDocumentDto[];

//   @IsOptional()
//   @IsEmail({}, { message: 'Email không hợp lệ' })
//   readonly email?: string;

//   @IsOptional()
//   @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
//     message: 'Số điện thoại không hợp lệ',
//   })
//   readonly so_dien_thoai?: string;

//   @IsOptional()
//   @IsString()
//   readonly tinh_trang?: string;
// }

export class DeleteStudentDto {
  @IsString()
  readonly ma_so_sinh_vien: string;
}