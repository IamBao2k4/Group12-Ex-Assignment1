import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateOpenClassDto {
  @IsString()
  @IsNotEmpty()
  readonly ma_lop: string;

  @IsString()
  @IsNotEmpty()
  readonly ma_mon_hoc: string;

  @IsInt()
  @IsOptional()
  readonly si_so = 0;

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
  @Min(1, { message: 'Maximum student count must be at least 1' })
  readonly so_luong_toi_da: number;

  @IsString()
  @IsNotEmpty()
  readonly lich_hoc: string;

  @IsString()
  @IsNotEmpty()
  readonly phong_hoc: string;
}

export class UpdateOpenClassDto {
  @IsString()
  @IsOptional()
  readonly ma_lop?: string;

  @IsString()
  @IsOptional()
  readonly ma_mon_hoc?: string;

  @IsInt()
  @IsOptional()
  readonly si_so?: number;

  @IsInt()
  @IsOptional()
  readonly nam_hoc?: number;

  @IsInt()
  @IsOptional()
  readonly hoc_ky?: number;

  @IsString()
  @IsOptional()
  readonly giang_vien?: string;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Maximum student count must be at least 1' })
  readonly so_luong_toi_da?: number;

  @IsString()
  @IsOptional()
  readonly lich_hoc?: string;

  @IsString()
  @IsOptional()
  readonly phong_hoc?: string;
}
