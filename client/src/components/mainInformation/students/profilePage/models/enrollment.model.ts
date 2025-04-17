import { Document, ObjectId } from 'mongoose';

export interface Enrollment extends Document {
    _id: ObjectId;
    ma_sv: string;
    ma_mon: string;
    ma_lop: string;
    thoi_gian_dang_ky: Date;
    thoi_gian_huy: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
} 