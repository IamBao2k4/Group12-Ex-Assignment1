import React from "react";
import { CMNDDocument } from "../../../../models/id-document";
import "./CMNDItem.css";

interface CMNDItemProps {
    document: CMNDDocument | null;
    setDocument: (document: CMNDDocument) => void;
}

const defaultCMND: CMNDDocument = {
    type: "cmnd",
    so: "",
    ngay_cap: new Date(),
    noi_cap: "",
    ngay_het_han: new Date(),
};

const CMNDItem: React.FC<CMNDItemProps> = ({ document, setDocument }) => {
    if (!document) document = defaultCMND;
    return (
        <div className="profile-dialog-info-form-cmnd">
            <div className="profile-dialog-info-form-group">
                <label htmlFor="cmnd">CMND</label>
                <input
                    type="text"
                    name="cmnd"
                    id="cmnd"
                    value={document.so}
                    onChange={(e) =>
                        setDocument({ ...document, so: e.target.value })
                    }
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_cap_cmnd">Ngày Cấp</label>
                <input
                    type="date"
                    name="ngay_cap_cmnd"
                    id="ngay_cap_cmnd"
                    value={
                        document?.ngay_cap
                            ? new Date(document.ngay_cap)
                                  .toISOString()
                                  .split("T")[0]
                            : ""
                    }
                    onChange={(e) =>
                        setDocument({
                            ...document,
                            ngay_cap: new Date(e.target.value),
                        })
                    }
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="noi_cap_cmnd">Nơi Cấp</label>
                <input
                    type="text"
                    name="noi_cap_cmnd"
                    id="noi_cap_cmnd"
                    value={document.noi_cap}
                    onChange={(e) =>
                        setDocument({ ...document, noi_cap: e.target.value })
                    }
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_het_han_cmnd">Ngày Hết Hạn</label>
                <input
                    type="date"
                    name="ngay_het_han_cmnd"
                    id="ngay_het_han_cmnd"
                    value={
                        document?.ngay_het_han
                            ? new Date(document.ngay_het_han)
                                  .toISOString()
                                  .split("T")[0]
                            : ""
                    }
                    onChange={(e) =>
                        setDocument({
                            ...document,
                            ngay_het_han: new Date(e.target.value),
                        })
                    }
                />
            </div>
        </div>
    );
};

export default CMNDItem;
