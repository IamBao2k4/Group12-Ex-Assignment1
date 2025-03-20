import { IsString, IsOptional } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  readonly name: string;
}

export class UpdateProgramDto {
  @IsString()
  @IsOptional()
  readonly name?: string;
}