import { Document } from "mongodb";

interface FacultyName {
    en: string;
    vi: string;
}

export interface Faculty extends Document {
    ma_khoa: string;
    ten_khoa: FacultyName;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}