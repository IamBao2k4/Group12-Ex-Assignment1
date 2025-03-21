import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly ma: string;
}

export class UpdateProgramDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly ma?: string;
}