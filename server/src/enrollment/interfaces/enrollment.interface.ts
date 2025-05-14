import { Document, ObjectId } from 'mongoose';

export interface Enrollment extends Document {
  ma_sv: ObjectId;
  ma_mon: ObjectId;
  ma_lop: ObjectId;
  ma_lop_mo: string;
  thoi_gian_dang_ky: Date;
  thoi_gian_huy: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
} 