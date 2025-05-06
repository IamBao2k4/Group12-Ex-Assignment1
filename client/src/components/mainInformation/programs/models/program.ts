import mongoose, { Document } from 'mongoose';

export interface Program extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    ma: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}