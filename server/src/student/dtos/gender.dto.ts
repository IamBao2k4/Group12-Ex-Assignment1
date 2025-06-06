import { IsString, IsNotEmpty } from 'class-validator';

export class GenderDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  vn: string;
}