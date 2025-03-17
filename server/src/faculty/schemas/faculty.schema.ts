import * as mongoose from 'mongoose';

export const FacultySchema = new mongoose.Schema({
  ma_khoa: { type: String, required: true },
  ten_khoa: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});