import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgramNameDto } from './programName.dto';

export class CreateProgramDto {
  @ApiProperty({ description: 'Program name', example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  readonly name: ProgramNameDto;

  @ApiProperty({ description: 'Program code', example: 'CS' })
  @IsString()
  @IsNotEmpty()
  readonly ma: string;
}

export class UpdateProgramDto {
  @ApiPropertyOptional({ description: 'Program name', example: 'Computer Science' })
  @IsString()
  @IsOptional()
  readonly name?: ProgramNameDto;

  @ApiPropertyOptional({ description: 'Program code', example: 'CS' })
  @IsString()
  @IsOptional()
  readonly ma?: string;
}