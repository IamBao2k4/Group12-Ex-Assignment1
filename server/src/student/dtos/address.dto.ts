import { IsOptional, IsString } from 'class-validator';

export class AddressDto {
    @IsOptional()
    @IsString()
    readonly chi_tiet?: string;

    @IsOptional()
    @IsString()
    readonly phuong_xa?: string;

    @IsOptional()
    @IsString()
    readonly quan_huyen?: string;

    @IsOptional()
    @IsString()
    readonly tinh_thanh_pho?: string;

    @IsOptional()
    @IsString()
    readonly quoc_gia?: string;
} 