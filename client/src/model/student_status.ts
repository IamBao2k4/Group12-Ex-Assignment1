import mongoose, { Document } from 'mongoose';

export interface StudentStatus extends Document {
    _id: mongoose.Types.ObjectId;
    tinh_trang: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}