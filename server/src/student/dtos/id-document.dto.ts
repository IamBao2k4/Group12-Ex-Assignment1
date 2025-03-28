import { IsString, IsDate, IsEnum, IsBoolean, IsOptional, ValidateIf, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class IDDocumentDto {
    @IsNotEmpty({ message: 'Document type is required' })
    @IsEnum(['cmnd', 'cccd', 'passport'], {
        message: 'Document type must be one of: CMND, CCCD, Passport'
    })
    readonly type: 'cmnd' | 'cccd' | 'passport';

    @IsNotEmpty({ message: 'Document number is required' })
    @IsString({ message: 'Document number must be a string' })
    readonly so: string;

    @IsNotEmpty({ message: 'Issuance date is required' })
    @Type(() => Date)
    readonly ngay_cap: Date;

    @IsNotEmpty({ message: 'Place of issuance is required' })
    @IsString({ message: 'Place of issuance must be a string' })
    readonly noi_cap: string;

    @IsNotEmpty({ message: 'Expiration date is required' })
    @Type(() => Date)
    readonly ngay_het_han: Date;

    @ValidateIf(o => o.type === 'cccd')
    @IsNotEmpty({ message: 'Field with chip is required for CCCD' })
    @IsBoolean({ message: 'Field with chip must be a boolean' })
    readonly co_gan_chip?: boolean;

    @ValidateIf(o => o.type === 'passport')
    @IsNotEmpty({ message: 'Country of issuance is required for passport' })
    @IsString({ message: 'Country of issuance must be a string' })
    readonly quoc_gia_cap?: string;

    @IsOptional()
    @IsString({ message: 'Note must be a string' })
    readonly ghi_chu?: string;
} 