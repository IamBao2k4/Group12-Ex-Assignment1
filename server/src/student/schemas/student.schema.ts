import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
  ma_so_sinh_vien: { type: String, required: true },
  ho_ten: { type: String, required: true },
  ngay_sinh: { type: String, required: true },
  gioi_tinh: { type: String, required: true },
  khoa: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  khoa_hoc: { type: String, required: true },
  chuong_trinh: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  dia_chi: { type: String, required: false },
  email: { type: String, required: false },
  so_dien_thoai: { type: String, required: false },
  tinh_trang: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentStatus', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});