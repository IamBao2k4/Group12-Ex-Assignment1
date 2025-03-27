import React from 'react';
import { PassportDocument } from '../../../../models/id-document';
import "./passportItem.css"

interface PassportItemProps {
    document: PassportDocument | null;
    setDocument: (document: PassportDocument) => void;
}

const defaultPassport: PassportDocument = {
    type: 'passport',
    so: "",
    ngay_cap: new Date(),
    noi_cap: "",
    ngay_het_han: new Date(),
    quoc_gia_cap: "",
    ghi_chu: "",
};

const PassportItem: React.FC<PassportItemProps> = ({ document, setDocument }) => {
    if (!document) document = defaultPassport;
    return (
        <div className="profile-dialog-info-form-hc">
            <div className="profile-dialog-info-form-group">
                <label htmlFor="hc">Hộ chiếu</label>
                <input
                    type="text"
                    name="hc"
                    id="hc"
                    value={document.so}
                    onChange={(e) => setDocument({ ...document, so: e.target.value })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_cap_hc">Ngày Cấp</label>
                <input
                    type="date"
                    name="ngay_cap_hc"
                    id="ngay_cap_hc"
                    value={document.ngay_cap.toString().split('T')[0]}
                    onChange={(e) => setDocument({ ...document, ngay_cap: new Date(e.target.value) })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="noi_cap_hc">Nơi Cấp</label>
                <input
                    type="text"
                    name="noi_cap_hc"
                    id="noi_cap_hc"
                    value={document.noi_cap}
                    onChange={(e) => setDocument({ ...document, noi_cap: e.target.value })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_het_han_hc">Ngày Hết Hạn</label>
                <input
                    type="date"
                    name="ngay_het_han_hc"
                    id="ngay_het_han_hc"
                    value={document.ngay_het_han.toString().split('T')[0]}
                    onChange={(e) => setDocument({ ...document, ngay_het_han: new Date(e.target.value) })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="quoc_gia_cap_hc">Quốc Gia Cấp</label>
                <input
                    type="text"
                    name="quoc_gia_cap_hc"
                    id="quoc_gia_cap_hc"
                    value={document.quoc_gia_cap}
                    onChange={(e) => setDocument({ ...document, quoc_gia_cap: e.target.value })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ghi_chu_hc">Ghi Chú</label>
                <input
                    type="text"
                    name="ghi_chu_hc"
                    id="ghi_chu_hc"
                    value={document.ghi_chu || ""}
                    onChange={(e) => setDocument({ ...document, ghi_chu: e.target.value })}
                />
            </div>
        </div>
    );
};

export default PassportItem;