export interface BaseIDDocument {
    type: 'cmnd' | 'cccd' | 'passport';
    so: string;
    ngay_cap: Date;
    noi_cap: string;
    ngay_het_han: Date;
}

export interface CMNDDocument extends BaseIDDocument {
    type: 'cmnd';
}

export interface CCCDDocument extends BaseIDDocument {
    type: 'cccd';
    co_gan_chip: boolean;
}

export interface PassportDocument extends BaseIDDocument {
    type: 'passport';
    quoc_gia_cap: string;
    ghi_chu?: string;
}

export type IDDocument = CMNDDocument | CCCDDocument | PassportDocument; 