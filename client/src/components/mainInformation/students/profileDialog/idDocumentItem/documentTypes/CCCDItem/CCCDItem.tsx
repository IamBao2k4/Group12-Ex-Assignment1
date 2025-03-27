import React from 'react';
import { CCCDDocument } from '../../../../models/id-document';
import "./CCCDItem.css"

interface CCCDItemProps {
    document: CCCDDocument;
    setDocument: (document: CCCDDocument) => void;
}

const CCCDItem: React.FC<CCCDItemProps> = ({ document, setDocument }) => {
    return (
        <div className="profile-dialog-info-form-cccd">
            <div className="profile-dialog-info-form-group">
                <label htmlFor="cccd">CCCD</label>
                <input
                    type="text"
                    name="cccd"
                    id="cccd"
                    value={document.so}
                    onChange={(e) => setDocument({ ...document, so: e.target.value })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_cap_cccd">Ngày Cấp</label>
                <input
                    type="date"
                    name="ngay_cap_cccd"
                    id="ngay_cap_cccd"
                    value={document.ngay_cap.toString().split('T')[0]}
                    onChange={(e) => setDocument({ ...document, ngay_cap: new Date(e.target.value) })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="noi_cap_cccd">Nơi Cấp</label>
                <input
                    type="text"
                    name="noi_cap_cccd"
                    id="noi_cap_cccd"
                    value={document.noi_cap}
                    onChange={(e) => setDocument({ ...document, noi_cap: e.target.value })}
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_het_han_cccd">Ngày Hết Hạn</label>
                <input
                    type="date"
                    name="ngay_het_han_cccd"
                    id="ngay_het_han_cccd"
                    value={document.ngay_het_han.toString().split('T')[0]}
                    onChange={(e) => setDocument({ ...document, ngay_het_han: new Date(e.target.value) })}
                />
            </div>

            <label style={{ marginTop: "20px" }}>
                CCCD có gắn chip
            </label>
            <div className="profile-dialog-info-form-cccd-bottom">
                <label>
                    <input
                        type="radio"
                        name="co_gan_chip"
                        value="true"
                        checked={document.co_gan_chip === true}
                        onChange={() => setDocument({ ...document, co_gan_chip: true })}
                    />
                    Có
                </label>
                <label>
                    <input
                        type="radio"
                        name="co_gan_chip"
                        value="false"
                        checked={document.co_gan_chip === false}
                        onChange={() => setDocument({ ...document, co_gan_chip: false })}
                    />
                    Không
                </label>
            </div>
        </div>
    );
};

export default CCCDItem;