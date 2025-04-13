import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
} from 'class-validator';
import { isInt32Array } from 'util/types';

export class CreateGradeDto {
  @IsString()
  @IsNotEmpty()
  readonly ma_lop: string;

  @IsString()
  @IsNotEmpty()
  readonly ma_khoa_hoc: string;

  @IsInt()
  @IsNotEmpty()
  readonly nam_hoc: number;

  @IsInt()
  @IsNotEmpty()
  readonly hoc_ky: number;

  @IsString()
  @IsNotEmpty()
  readonly giang_vien: string;

  @IsInt()
  @IsNotEmpty()
  readonly so_luong_toi_da: number;

  @IsString()
  @IsNotEmpty()
  readonly lich_hoc: string;

  @IsString()
  @IsNotEmpty()
  readonly phong_hoc: string;
}

export class UpdateGradeDto {
  @IsString()
  @IsOptional()
  readonly ma_lop?: string;

  @IsString()
  @IsOptional()
  readonly ma_khoa_hoc?: string;

  @IsNumber()
  @IsOptional()
  readonly nam_hoc?: number;

  @IsNumber()
  @IsOptional()
  readonly hoc_ky?: number;

  @IsString()
  @IsOptional()
  readonly giang_vien?: string;

  @IsNumber()
  @IsOptional()
  readonly so_luong_toi_da?: number;

  @IsString()
  @IsOptional()
  readonly lich_hoc?: string;

  @IsString()
  @IsOptional()
  readonly phong_hoc?: string;
}
