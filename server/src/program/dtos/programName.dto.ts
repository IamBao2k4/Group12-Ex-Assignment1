import { IsString, IsNotEmpty } from 'class-validator';

export class ProgramNameDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  vi: string;
}