import { IsString, IsNotEmpty } from 'class-validator';

export class CourseNameDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  vi: string;
}