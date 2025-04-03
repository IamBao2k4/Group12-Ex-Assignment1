import * as mongoose from 'mongoose';

export const EnrollmentSchema = new mongoose.Schema({
  ma_sv: { type: String, required: true },
  ma_mon: { type: String, required: true },
  ma_lop: { type: String, required: true },
  thoi_gian_dang_ky: { type: Date, default: Date.now },
  thoi_gian_huy: { type: Date, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});

// Create a compound index for upsert operations
EnrollmentSchema.index({ ma_sv: 1, ma_mon: 1, ma_lop: 1 }, { unique: true }); 