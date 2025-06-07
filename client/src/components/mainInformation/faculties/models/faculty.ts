import mongoose, { Document } from 'mongoose';

interface FacultyName {
    en: string;
    vi: string;
}

export interface Faculty extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    ma_khoa: string;
    ten_khoa: FacultyName;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}