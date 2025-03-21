import { IsString, IsDate, IsEnum, IsBoolean, IsOptional, ValidateIf, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class IDDocumentDto {
    @IsNotEmpty({ message: 'Loại giấy tờ không được để trống' })
    @IsEnum(['cmnd', 'cccd', 'passport'], {
        message: 'Loại giấy tờ phải là một trong các loại: CMND, CCCD, Hộ chiếu'
    })
    readonly type: 'cmnd' | 'cccd' | 'passport';

    @IsNotEmpty({ message: 'Số giấy tờ không được để trống' })
    @IsString({ message: 'Số giấy tờ phải là chuỗi' })
    readonly so: string;

    @IsNotEmpty({ message: 'Ngày cấp không được để trống' })
    @Type(() => Date)
    readonly ngay_cap: Date;

    @IsNotEmpty({ message: 'Nơi cấp không được để trống' })
    @IsString({ message: 'Nơi cấp phải là chuỗi' })
    readonly noi_cap: string;

    @IsNotEmpty({ message: 'Ngày hết hạn không được để trống' })
    @Type(() => Date)
    readonly ngay_het_han: Date;

    @ValidateIf(o => o.type === 'cccd')
    @IsNotEmpty({ message: 'Trường có gắn chip không được để trống cho CCCD' })
    @IsBoolean({ message: 'Trường có gắn chip phải là boolean' })
    readonly co_gan_chip?: boolean;

    @ValidateIf(o => o.type === 'passport')
    @IsNotEmpty({ message: 'Quốc gia cấp không được để trống cho Hộ chiếu' })
    @IsString({ message: 'Quốc gia cấp phải là chuỗi' })
    readonly quoc_gia_cap?: string;

    @IsOptional()
    @IsString({ message: 'Ghi chú phải là chuỗi' })
    readonly ghi_chu?: string;
} 