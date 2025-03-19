import { Document } from 'mongoose';
import { Address } from './address.interface';
import { IDDocument } from './id-document.interface';

export interface Student extends Document {
  ma_so_sinh_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  khoa: string;
  khoa_hoc: string;
  chuong_trinh: string;
  dia_chi_thuong_tru?: Address;
  dia_chi_tam_tru?: Address;
  dia_chi_nhan_thu?: Address;
  giay_to_tuy_than: IDDocument[];
  email?: string;
  so_dien_thoai?: string;
  tinh_trang: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
