import mongoose, { Document } from 'mongoose';

interface ProgramName {
    en: string;
    vn: string;
}

export interface Program extends Document {
    _id: mongoose.Types.ObjectId;
    name: ProgramName;
    ma: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}