import * as mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema(
  {
    ma_mon_hoc: { type: String, required: true, unique: true }, // Course code
    ten: { type: String, required: true }, // Course name
    tin_chi: { type: Number, required: true }, // Credits
    khoa: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }, // Reference to Faculty
    mon_tien_quyet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Prerequisite courses
    created_at: { type: Date, default: Date.now }, // Creation timestamp
    updated_at: { type: Date, default: Date.now }, // Update timestamp
    deleted_at: { type: Date, default: null }, // Soft delete timestamp
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } // Enable automatic timestamps
);