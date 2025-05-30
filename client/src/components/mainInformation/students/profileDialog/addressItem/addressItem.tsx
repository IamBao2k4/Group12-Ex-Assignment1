import React, { useState, useEffect } from "react";
import { Address } from "../../models/address";
import { Student } from "../../models/student";
import LocationSelect from "./locationSelect/locationSelect";
import "./addressItem.css"
import { useTranslation } from 'react-i18next';

interface AddressItemProps {
    student: Student;
    setAddresses: (addresses: Address[]) => void;
    type: string;
}

const defaultAddress: Address = {
    chi_tiet: "",
    phuong_xa: "",
    quan_huyen: "",
    tinh_thanh_pho: "",
    quoc_gia: "",
};

const AddressItem: React.FC<AddressItemProps> = ({ student, setAddresses, type }) => {
    const { t } = useTranslation();
    const [permanentAddress, setPermanentAddress] = useState<Address>(defaultAddress);
    const [temporaryAddress, setTemporaryAddress] = useState<Address>(defaultAddress);

    useEffect(() => {
        setAddresses([permanentAddress, temporaryAddress]);
    }, [permanentAddress, temporaryAddress, setAddresses]); 

    return (
        <div>
            <LocationSelect
                label={t('student.permanentAddress')}
                onAddressChange={(addr: Address) => {setPermanentAddress(addr)}}
                initialAddress={student?.dia_chi_thuong_tru}
                type={type}
            />

            <label style={{ marginBottom: "10px", fontWeight: "700" }}>{t('student.permanentAddress')}</label>

            <input
                type="text"
                id="permanent-address"
                readOnly
                placeholder={t('student.permanentAddress')}
                className="address-item-input"
                value={ type === "edit"?
                    (permanentAddress
                        ? `${permanentAddress.chi_tiet}, ${permanentAddress.phuong_xa}, ${permanentAddress.quan_huyen}, ${permanentAddress.tinh_thanh_pho}`
                        : "")
                        : ""
                }
            />

            <div className="location-select-divider"></div>

            <LocationSelect
                label={t('student.temporaryAddress')}
                onAddressChange={(addr: Address) => setTemporaryAddress(addr)}
                initialAddress={student?.dia_chi_tam_tru}
                type={type}
            />

            <label style={{ marginBottom: "10px", fontWeight: "700" }}>{t('student.temporaryAddress')}</label>

            <input
                type="text"
                id="temporary-address"
                readOnly
                placeholder={t('student.temporaryAddress')}
                className="address-item-input"
                value={ type === "edit"?
                    (temporaryAddress
                        ? `${temporaryAddress.chi_tiet}, ${temporaryAddress.phuong_xa}, ${temporaryAddress.quan_huyen}, ${temporaryAddress.tinh_thanh_pho}`
                        : "")
                        : ""
                }
            />
        </div>
    );
};

export default AddressItem;