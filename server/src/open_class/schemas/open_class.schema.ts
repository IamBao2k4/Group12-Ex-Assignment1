import * as mongoose from 'mongoose';
export const OpenClassSchema = new mongoose.Schema({
  ma_lop: { type: String, required: true },
  ma_mon_hoc: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  si_so: { type: Number, required: true, default: 0 }, // Sĩ số lớp học phần
  nam_hoc: { type: Number, required: true },
  hoc_ky: { type: Number, required: true },
  giang_vien: { type: String, required: true },
  so_luong_toi_da: { type: Number, required: true },
  lich_hoc: { type: String, required: true },
  phong_hoc: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});
