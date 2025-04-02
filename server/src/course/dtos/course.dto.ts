import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    readonly ma_mon_hoc: string; // Course code

    @IsString()
    @IsNotEmpty()
    readonly ten: string; // Course name

    @IsNumber()
    @IsNotEmpty()
    readonly tin_chi: number; // Credits

    @IsString()
    @IsNotEmpty()
    readonly khoa: string; // Faculty ID

    @IsArray()
    @IsOptional()
    readonly mon_tien_quyet?: string[]; // Prerequisite course IDs
}

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    readonly ma_mon_hoc?: string; // Course code

    @IsString()
    @IsOptional()
    readonly ten?: string; // Course name

    @IsNumber()
    @IsOptional()
    readonly tin_chi?: number; // Credits

    @IsString()
    @IsOptional()
    readonly khoa?: string; // Faculty ID

    @IsArray()
    @IsOptional()
    readonly mon_tien_quyet?: string[]; // Prerequisite course IDs
}