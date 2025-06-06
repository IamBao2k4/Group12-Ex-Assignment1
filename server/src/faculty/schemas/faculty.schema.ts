import * as mongoose from 'mongoose';

const tenKhoaSchema = new mongoose.Schema({
  en: { type: String, required: true },
  vn: { type: String, required: true }
});

export const FacultySchema = new mongoose.Schema({
  ma_khoa: { type: String, required: true },
  ten_khoa: { type: tenKhoaSchema, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});