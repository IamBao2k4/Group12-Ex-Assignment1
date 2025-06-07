import * as mongoose from 'mongoose';

const ProgramNameSchema = new mongoose.Schema({
  en: { type: String, required: true },
  vi: { type: String, required: true }
});

export const ProgramSchema = new mongoose.Schema({
  name: { type: ProgramNameSchema, required: true },
  ma: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});
