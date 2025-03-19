import * as mongoose from 'mongoose';
import { AddressSchema } from './address.schema';
import { IDDocumentSchema } from './id-document.schema';

export const StudentSchema = new mongoose.Schema({
  ma_so_sinh_vien: { type: String, required: true },
  ho_ten: { type: String, required: true },
  ngay_sinh: { type: String, required: true },
  gioi_tinh: { type: String, required: true },
  khoa: { type: String, required: true },
  khoa_hoc: { type: String, required: true },
  chuong_trinh: { type: String, required: true },
  dia_chi_thuong_tru: { type: AddressSchema, required: true },
  dia_chi_tam_tru: { type: AddressSchema, required: false },
  dia_chi_nhan_thu: { type: AddressSchema, required: false },
  giay_to_tuy_than: [{ type: IDDocumentSchema, required: false }],
  email: { type: String, required: false },
  so_dien_thoai: { type: String, required: false },
  tinh_trang: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, required: false }
});
