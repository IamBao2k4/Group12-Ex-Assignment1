import { IsString, IsNotEmpty } from 'class-validator';

export class FacultyNameDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  vi: string;
}