import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusDto } from './status.dto';

export class CreateStudentStatusDto {
  @ApiProperty({ description: 'Student status name', example: 'Đang học' })
  readonly tinh_trang: StatusDto;
}

export class UpdateStudentStatusDto {
  @ApiPropertyOptional({ description: 'Student status name', example: 'Bảo lưu' })
  @IsOptional()
  readonly tinh_trang?: StatusDto;
}