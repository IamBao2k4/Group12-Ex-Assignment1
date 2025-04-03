import * as mongoose from 'mongoose';
import { timestamp } from 'rxjs';

export const TranscriptSchema = new mongoose.Schema(
  {
    ma_mon_hoc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    }, // Course code
    ma_so_sinh_vien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    }, // Student ID
    diem: { type: Number, required: true }, // Grade
    trang_thai: { type: String, required: true }, // Status (e.g., Passed, Failed)
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable automatic timestamps
  },
);
