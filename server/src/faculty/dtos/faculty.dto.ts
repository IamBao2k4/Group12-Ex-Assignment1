import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FacultyDto {
    @IsString()
    @IsNotEmpty()
    readonly ma_khoa: string;

    @IsString()
    @IsNotEmpty()
    readonly ten_khoa: string;

    @IsDate()
    @IsOptional()
    readonly deleted_at: Date;
}

export class UpdateFacultyDto {
    @IsString()
    @IsOptional()
    readonly ma_khoa?: string;

    @IsString()
    @IsOptional()
    readonly ten_khoa?: string;
}

export class CreateFacultyDto {
    @IsString()
    @IsNotEmpty()
    readonly ma_khoa: string;

    @IsString()
    @IsNotEmpty()
    readonly ten_khoa: string;
}
