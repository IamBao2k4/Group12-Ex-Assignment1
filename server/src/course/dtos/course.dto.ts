import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsBoolean } from "class-validator";
import { ObjectId } from "mongoose";

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
    readonly mon_tien_quyet?: ObjectId[]; // Prerequisite course IDs

    @IsBoolean()
    @IsOptional()
    readonly vo_hieu_hoa?: boolean; // Soft delete flag
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
    readonly mon_tien_quyet?: ObjectId[]; // Prerequisite course IDs

    @IsBoolean()
    @IsOptional()
    readonly vo_hieu_hoa?: boolean;
}