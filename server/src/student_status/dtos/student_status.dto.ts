import { IsString, IsOptional } from 'class-validator';

export class CreateStudentStatusDto {
  @IsString()
  readonly tinh_trang: string;
}

export class UpdateStudentStatusDto {
  @IsString()
  @IsOptional()
  readonly tinh_trang?: string;
}