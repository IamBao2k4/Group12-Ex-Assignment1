import mongoose, { Document } from "mongoose";

export interface Grade extends Document {
    ma_lop: string;
    ma_khoa_hoc: string;
    nam_hoc: Int32Array;
    hoc_ky: Int32Array;
    giang_vien: string;
    so_luong_toi_da: Int32Array;
    lich_hoc: string;
    phong_hoc: string;
}
