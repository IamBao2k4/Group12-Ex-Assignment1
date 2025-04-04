import mongoose, { Document } from "mongoose";

export interface Transcript extends Document {
    ma_mon_hoc: mongoose.Schema.Types.ObjectId; // Subject code
    ma_so_sinh_vien: mongoose.Schema.Types.ObjectId; // Student ID
    diem: number; // Grade
    trang_thai: string; // Status (e.g., "passed", "failed")
}
