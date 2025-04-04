import mongoose, { Document } from 'mongoose';

export interface Transcript extends Document {
  ma_mon_hoc: mongoose.Schema.Types.ObjectId; // Course ID (reference to Course collection)
  ma_so_sinh_vien: mongoose.Schema.Types.ObjectId; // Student ID (reference to Student collection)
  diem: number; // Grade
  trang_thai: string; // Status (e.g., "passed", "failed")
  created_at?: Date; // Creation timestamp
  updated_at?: Date; // Update timestamp
  deleted_at?: Date; // Soft delete timestamp
}
