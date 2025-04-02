import { Document } from "mongoose";

export interface Course extends Document {
    ma_mon_hoc: string; // Course code
    ten: string; // Course name
    tin_chi: number; // Credits
    khoa: string; // Faculty ID (reference to Faculty collection)
    mon_tien_quyet: string[]; // Array of prerequisite course IDs
    created_at?: Date; // Creation timestamp
    updated_at?: Date; // Update timestamp
    deleted_at?: Date; // Soft delete timestamp
}