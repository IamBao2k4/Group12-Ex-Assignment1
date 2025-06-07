import mongoose, { Document } from "mongoose";

export interface CourseName {
    en: string; // English name
    vi: string; // Vietnamese name
}

export interface Course extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    ma_mon_hoc: string; // Subject code
    ten: CourseName; // Subject name
    tin_chi: number; // Credits
    khoa: mongoose.Types.ObjectId; // Reference to Faculty
    mon_tien_quyet: mongoose.Types.ObjectId[]; // Prerequisite subjects
    vo_hieu_hoa: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date; // Optional for soft delete
}