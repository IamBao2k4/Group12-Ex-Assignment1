import { IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';

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
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  readonly tinh_trang?: string;
}