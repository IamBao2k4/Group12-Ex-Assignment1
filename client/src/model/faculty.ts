import mongoose, { Document } from 'mongoose';


export interface Faculty extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    ma_khoa: string;
    ten_khoa: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}