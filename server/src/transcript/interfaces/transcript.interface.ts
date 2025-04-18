import mongoose, { Document } from 'mongoose';

// điểm
export interface Transcript extends Document {
  ma_mon_hoc: mongoose.Schema.Types.ObjectId; // Course ID (reference to Course collection)
  ma_so_sinh_vien: mongoose.Schema.Types.ObjectId; // Student ID (reference to Student collection)
  diem: number; // Grade
  hoc_ky: string; // Semester (e.g., "2023-1")
  nam_hoc: string; // Academic year (e.g., "2023-2024")
  trang_thai: string; // Status (e.g., "passed", "failed")
  created_at?: Date; // Creation timestamp
  updated_at?: Date; // Update timestamp
  deleted_at?: Date; // Soft delete timestamp
}
