import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
  ma_so_sinh_vien: { type: String, required: true },
  ho_ten: { type: String, required: true },
  ngay_sinh: { type: String, required: true },
  gioi_tinh: { type: String, required: true },
  khoa: { type: String, required: true },
  khoa_hoc: { type: String, required: true },
  chuong_trinh: { type: String, required: true },
  dia_chi: { type: String, required: false },
  email: { type: String, required: false },
  so_dien_thoai: { type: String, required: false },
  tinh_trang: { type: String, required: true }
});
