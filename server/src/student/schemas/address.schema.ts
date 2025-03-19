import * as mongoose from 'mongoose';

export const AddressSchema = new mongoose.Schema({
    chi_tiet: { type: String, required: false }, // so nha, ten duong, mo ta
    phuong_xa: { type: String, required: false },
    quan_huyen: { type: String, required: false },
    tinh_thanh_pho: { type: String, required: false },
    quoc_gia: { type: String, required: false, default: 'Việt Nam' }
}); 