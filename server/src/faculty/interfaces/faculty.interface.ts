import { Document } from "mongodb";

export interface Faculty extends Document {
    ma_khoa: string;
    ten_khoa: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}