import { Document, ObjectId } from "mongoose";

export interface CourseName {
    en: string; // English name
    vn: string; // Vietnamese name
}

export interface Course extends Document {
    ma_mon_hoc: string; // Course code
    ten: CourseName; // Course name
    tin_chi: number; // Credits
    khoa: string; // Faculty ID (reference to Faculty collection)
    mon_tien_quyet: ObjectId[]; // Array of prerequisite course IDs
    vo_hieu_hoa: boolean; // Soft delete flag
    created_at?: Date; // Creation timestamp
    updated_at?: Date; // Update timestamp
    deleted_at?: Date; // Soft delete timestamp
}