import * as mongoose from 'mongoose';

export const GradeSchema = new mongoose.Schema({
  ma_lop: { type: String, required: true },
  ma_khoa_hoc: { type: String, required: true },
  nam_hoc: { type: Int32Array, required: true },
  hoc_ky: { type: Int32Array, required: true },
  giang_vien: { type: String, required: true },
  so_luong_toi_da: { type: Int32Array, required: true },
  lich_hoc: { type: String, required: true },
  phong_hoc: { type: String, required: true },
});
