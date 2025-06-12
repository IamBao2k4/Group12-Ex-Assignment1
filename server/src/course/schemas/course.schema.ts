import * as mongoose from 'mongoose';

export const CourseNameSchema = new mongoose.Schema({
  en: { type: String, required: true }, // English name
  vi: { type: String, required: true }  // Vietnamese name
});

export const CourseSchema = new mongoose.Schema(
  {
    ma_mon_hoc: { type: String, required: true, unique: true }, // Course code
    ten: { type: CourseNameSchema, required: true }, // Course name
    tin_chi: { type: Number, required: true }, // Credits
    khoa: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }, // Reference to Faculty
    mon_tien_quyet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Prerequisite courses
    vo_hieu_hoa: { type: Boolean, default: false }, // Soft delete flag
    created_at: { type: Date, default: Date.now }, // Creation timestamp
    updated_at: { type: Date, default: Date.now }, // Update timestamp
    deleted_at: { type: Date, default: null }, // Soft delete timestamp
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } // Enable automatic timestamps
);