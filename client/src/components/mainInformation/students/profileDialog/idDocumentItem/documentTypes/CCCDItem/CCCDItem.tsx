import React from "react";
import { CCCDDocument } from "../../../../models/id-document";
import "./CCCDItem.css";
import { useTranslation } from 'react-i18next';

interface CCCDItemProps {
    document: CCCDDocument | null;
    setDocument: (document: CCCDDocument) => void;
}

const defaultCCCD: CCCDDocument = {
    type: "cccd",
    so: "",
    ngay_cap: new Date(),
    noi_cap: "",
    ngay_het_han: new Date(),
    co_gan_chip: false,
};

const CCCDItem: React.FC<CCCDItemProps> = ({ document, setDocument }) => {
    const { t } = useTranslation();
    if (!document) document = defaultCCCD;
    return (
        <div className="profile-dialog-info-form-cccd">
            <div className="profile-dialog-info-form-group">
                <label htmlFor="cccd">{t('idDocument.cccd')}</label>
                <input
                    type="text"
                    name="cccd"
                    id="cccd"
                    value={document?.so || ""}
                    onChange={(e) =>
                        setDocument({ ...document, so: e.target.value })
                    }
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_cap_cccd">{t('idDocument.issueDate')}</label>
                <input
                    type="date"
                    name="ngay_cap_cccd"
                    id="ngay_cap_cccd"
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
                <label htmlFor="noi_cap_cccd">{t('idDocument.issuePlace')}</label>
                <input
                    type="text"
                    name="noi_cap_cccd"
                    id="noi_cap_cccd"
                    value={document?.noi_cap || ""}
                    onChange={(e) =>
                        setDocument({ ...document, noi_cap: e.target.value })
                    }
                />
            </div>

            <div className="profile-dialog-info-form-group">
                <label htmlFor="ngay_het_han_cccd">{t('idDocument.expiryDate')}</label>
                <input
                    type="date"
                    name="ngay_het_han_cccd"
                    id="ngay_het_han_cccd"
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

            <label style={{ marginTop: "20px" }}>{t('idDocument.hasChip')}</label>
            <div className="profile-dialog-info-form-cccd-bottom">
                <label>
                    <input
                        type="radio"
                        name="co_gan_chip"
                        value="true"
                        checked={document.co_gan_chip === true}
                        onChange={() =>
                            setDocument({ ...document, co_gan_chip: true })
                        }
                    />
                    {t('idDocument.yes')}
                </label>
                <label>
                    <input
                        type="radio"
                        name="co_gan_chip"
                        value="false"
                        checked={document.co_gan_chip === false}
                        onChange={() =>
                            setDocument({ ...document, co_gan_chip: false })
                        }
                    />
                    {t('idDocument.no')}
                </label>
            </div>
        </div>
    );
};

export default CCCDItem;
