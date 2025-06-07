import mongoose, { Document } from 'mongoose';

export interface ProgramName {
    en: string;
    vi: string;
}

export interface Program extends Document {
    _id: mongoose.Types.ObjectId;
    name: ProgramName;
    ma: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}