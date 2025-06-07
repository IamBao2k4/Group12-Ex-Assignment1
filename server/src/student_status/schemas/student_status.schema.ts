import * as mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  en: { type: String, required: true },
  vi: { type: String, required: true }
});

export const StudentStatusSchema = new mongoose.Schema({
  tinh_trang: { type: statusSchema, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});
