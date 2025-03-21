import mongoose, { Document } from "mongoose";
import { Address } from "./address";
import { IDDocument } from "./id_document";

export interface Student extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    ma_so_sinh_vien: string;
    ho_ten: string;
    ngay_sinh: string;
    gioi_tinh: string;
    khoa: mongoose.Schema.Types.ObjectId;
    khoa_hoc: string;
    chuong_trinh: mongoose.Schema.Types.ObjectId;
    dia_chi_thuong_tru?: Address;
    dia_chi_tam_tru?: Address;
    dia_chi_nhan_thu?: Address;
    giay_to_tuy_than: IDDocument[];
    email?: string;
    so_dien_thoai?: string;
    tinh_trang: mongoose.Schema.Types.ObjectId;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
