import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentStatusDto {
  @ApiProperty({ description: 'Student status name', example: 'Đang học' })
  @IsString()
  readonly tinh_trang: string;
}

export class UpdateStudentStatusDto {
  @ApiPropertyOptional({ description: 'Student status name', example: 'Bảo lưu' })
  @IsString()
  @IsOptional()
  readonly tinh_trang?: string;
}