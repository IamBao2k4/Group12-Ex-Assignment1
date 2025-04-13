import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchOptions {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    ma_mon_hoc?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    ma_lop?: string;
    
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    giang_vien?: string;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nam_hoc?: number;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    hoc_ky?: number;

    @IsOptional()
    @IsString()
    keyword?: string;
}