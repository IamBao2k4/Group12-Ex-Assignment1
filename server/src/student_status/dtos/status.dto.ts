import { IsString, IsNotEmpty } from 'class-validator';

export class StatusDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  vi: string;
}