import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FacultyDto {
    @ApiProperty({ description: 'Faculty code', example: 'CNTT' })
    @IsString()
    @IsNotEmpty()
    readonly ma_khoa: string;

    @ApiProperty({ description: 'Faculty name', example: 'Công Nghệ Thông Tin' })
    @IsString()
    @IsNotEmpty()
    readonly ten_khoa: string;

    @ApiPropertyOptional({ description: 'Deletion date', example: '2023-01-01T00:00:00.000Z' })
    @IsDate()
    @IsOptional()
    readonly deleted_at: Date;
}

export class UpdateFacultyDto {
    @ApiPropertyOptional({ description: 'Faculty code', example: 'CNTT' })
    @IsString()
    @IsOptional()
    readonly ma_khoa?: string;

    @ApiPropertyOptional({ description: 'Faculty name', example: 'Công Nghệ Thông Tin' })
    @IsString()
    @IsOptional()
    readonly ten_khoa?: string;
}

export class CreateFacultyDto {
    @ApiProperty({ description: 'Faculty code', example: 'CNTT' })
    @IsString()
    @IsNotEmpty()
    readonly ma_khoa: string;

    @ApiProperty({ description: 'Faculty name', example: 'Công Nghệ Thông Tin' })
    @IsString()
    @IsNotEmpty()
    readonly ten_khoa: string;
}
