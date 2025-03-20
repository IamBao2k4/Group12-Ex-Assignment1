import mongoose, { Document } from 'mongoose';

export interface Student extends Document {
  ma_so_sinh_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  khoa: mongoose.Schema.Types.ObjectId;
  khoa_hoc: string;
  chuong_trinh: mongoose.Schema.Types.ObjectId;
  dia_chi?: string;
  email?: string;
  so_dien_thoai?: string;
  tinh_trang: mongoose.Schema.Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}