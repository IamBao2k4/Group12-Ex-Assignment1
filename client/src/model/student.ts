import mongoose, { Document } from 'mongoose';


export interface Student extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  ma_so_sinh_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  khoa: string;
  khoa_hoc: string;
  chuong_trinh: string;
  dia_chi?: string;
  email?: string;
  so_dien_thoai?: string;
  tinh_trang: string;
}