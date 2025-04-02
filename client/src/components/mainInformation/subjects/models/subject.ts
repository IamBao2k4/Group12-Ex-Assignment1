import mongoose, { Document } from "mongoose";

export interface Subject extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    ma_mon_hoc: string; // Subject code
    ten: string; // Subject name
    tin_chi: number; // Credits
    khoa: mongoose.Types.ObjectId; // Reference to Faculty
    mon_tien_quyet: mongoose.Types.ObjectId[]; // Prerequisite subjects
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date; // Optional for soft delete
}