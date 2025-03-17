import { Document } from 'mongoose';

export interface StudentStatus extends Document {
  tinh_trang: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}