import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  Matches,
} from 'class-validator';
import { IsFacultyExists } from '../validators/is-faculty-exists.validator';
import { IsProgramExists } from '../validators/is-program-exists.validator';
import { IsStudentStatusExists } from '../validators/is-student-status-exists.validator';
import mongoose from 'mongoose';

export class CreateStudentDto {
  ma_so_sinh_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;

  @IsFacultyExists({ message: 'Faculty does not exist' })
  khoa: string;

  khoa_hoc: string;

  @IsProgramExists({ message: 'Program does not exist' })
  chuong_trinh: string;

  dia_chi?: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

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
  @IsStudentStatusExists({ message: 'Student status does not exist' })
  readonly tinh_trang?: mongoose.Schema.Types.ObjectId;
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

export class DeleteStudentDto {
  @IsString()
  readonly ma_so_sinh_vien: string;
}