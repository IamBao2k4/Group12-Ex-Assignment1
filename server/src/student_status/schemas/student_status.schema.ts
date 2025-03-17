import * as mongoose from 'mongoose';

export const StudentStatusSchema = new mongoose.Schema({
  tinh_trang: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});
