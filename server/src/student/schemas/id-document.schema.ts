import * as mongoose from 'mongoose';

export const IDDocumentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['cmnd', 'cccd', 'passport']
    },
    so: {
        type: String,
        required: true
    },
    ngay_cap: {
        type: Date,
        required: true
    },
    noi_cap: {
        type: String,
        required: true
    },
    ngay_het_han: {
        type: Date,
        required: true
    },
    co_gan_chip: {
        type: Boolean,
        required: function () {
            return this.type === 'cccd';
        }
    },
    quoc_gia_cap: {
        type: String,
        required: function () {
            return this.type === 'passport';
        }
    },
    ghi_chu: {
        type: String,
        required: false
    }
}); 