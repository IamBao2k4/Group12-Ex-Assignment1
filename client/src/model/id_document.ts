export interface IDDocument extends Document {
    type: "cmnd" | "cccd" | "passport";
    so: string;
    ngay_cap: Date;
    noi_cap: string;
    ngay_het_han: Date;
}

export interface CMNDDocument extends IDDocument {
    type: "cmnd";
}

export interface CCCDDocument extends IDDocument {
    type: "cccd";
    co_gan_chip: boolean;
}

export interface PassportDocument extends IDDocument {
    type: "passport";
    quoc_gia_cap: string;
    ghi_chu?: string;
}
