import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateStudentDto {
  ma_so_sinh_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  khoa: string;
  khoa_hoc: string;
  chuong_trinh: string;
  dia_chi?: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  so_dien_thoai?: string;
  tinh_trang: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  readonly ma_so_sinh_vien?: string;

  @IsOptional()
  @IsString()
  readonly ho_ten?: string;

  @IsOptional()
  @IsDateString()
  readonly ngay_sinh?: string;

  @IsOptional()
  @IsString()
  readonly gioi_tinh?: string;

  @IsOptional()
  @IsString()
  readonly khoa?: string;

  @IsOptional()
  @IsString()
  readonly khoa_hoc?: string;

  @IsOptional()
  @IsString()
  readonly chuong_trinh?: string;

  @IsOptional()
  @IsString()
  readonly dia_chi?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  readonly email?: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  readonly so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  readonly tinh_trang?: string;
}

export class FindStudentDto {
  @IsOptional()
  @IsString()
  readonly ma_so_sinh_vien?: string;

  @IsOptional()
  @IsString()
  readonly ho_ten?: string;

  @IsOptional()
  @IsDateString()
  readonly ngay_sinh?: string;

  @IsOptional()
  @IsString()
  readonly gioi_tinh?: string;

  @IsOptional()
  @IsString()
  readonly khoa?: string;

  @IsOptional()
  @IsString()
  readonly khoa_hoc?: string;

  @IsOptional()
  @IsString()
  readonly chuong_trinh?: string;

  @IsOptional()
  @IsString()
  readonly dia_chi?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  readonly email?: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  readonly so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  readonly tinh_trang?: string;
}

export class DeleteStudentDto {
  @IsString()
  readonly ma_so_sinh_vien: string;
}
