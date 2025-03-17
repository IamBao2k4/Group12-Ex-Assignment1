import { Document } from 'mongoose';

export interface Program extends Document {
  name: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}