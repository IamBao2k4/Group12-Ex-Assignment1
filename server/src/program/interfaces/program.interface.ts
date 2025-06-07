import { Document } from 'mongoose';

interface ProgramName {
  en: string;
  vi: string;
}

export interface Program extends Document {
  name: ProgramName;
  ma: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}