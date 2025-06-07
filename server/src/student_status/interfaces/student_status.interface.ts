import { Document } from 'mongoose';

interface Status{
  en: string;
  vi: string;
}

export interface StudentStatus extends Document {
  tinh_trang: Status;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}