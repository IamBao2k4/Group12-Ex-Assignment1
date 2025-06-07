import mongoose, { Document } from 'mongoose';

export interface Status {
    en: string;
    vi: string;
}

export interface StudentStatus extends Document {
    _id: mongoose.Types.ObjectId;
    tinh_trang: Status;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}