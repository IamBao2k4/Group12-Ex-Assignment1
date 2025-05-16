import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEnrollmentDto {
  @IsString()
  ma_sv: string;

  @IsString()
  ma_lop: string;

  @IsString()
  ma_mon: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  thoi_gian_dang_ky?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  thoi_gian_huy?: Date;
}

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsString()
  ma_sv?: string;

  @IsOptional()
  @IsString()
  ma_lop_mo?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  thoi_gian_dang_ky?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  thoi_gian_huy?: Date;
}

export class FindEnrollmentDto {
  @IsOptional()
  @IsString()
  ma_sv?: string;

  @IsOptional()
  @IsString()
  ma_lop_mo?: string;

  @IsOptional()
  @IsString()
  ma_lop?: string;
} 