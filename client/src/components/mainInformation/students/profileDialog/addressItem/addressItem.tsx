import React, { useState, useEffect } from "react";
import { Address } from "../../models/address";
import { Student } from "../../models/student";
import LocationSelect from "./locationSelect/locationSelect";

interface AddressItemProps {
    student: Student;
    setAddresses: (addresses: Address[]) => void;
}

const defaultAddress: Address = {
    chi_tiet: "",
    phuong_xa: "",
    quan_huyen: "",
    tinh_thanh_pho: "",
    quoc_gia: "",
};

const AddressItem: React.FC<AddressItemProps> = ({ student, setAddresses }) => {
    const [permanentAddress, setPermanentAddress] = useState<Address>(defaultAddress);
    const [temporaryAddress, setTemporaryAddress] = useState<Address>(defaultAddress);

    useEffect(() => {
        setAddresses([permanentAddress, temporaryAddress]);
    }, [permanentAddress, temporaryAddress, setAddresses]); 

    return (
        <div>
            <LocationSelect
                label="Địa chỉ thường trú"
                onAddressChange={(addr: Address) => {setPermanentAddress(addr)}}
                initialAddress={student?.dia_chi_thuong_tru}
            />

            <label style={{ marginTop: "20px" }}>Địa chỉ thường trú</label>

            <input
                type="text"
                id="permanent-address"
                readOnly
                placeholder="Địa chỉ thường trú"
                value={
                    permanentAddress
                        ? `${permanentAddress.chi_tiet}, ${permanentAddress.phuong_xa}, ${permanentAddress.quan_huyen}, ${permanentAddress.tinh_thanh_pho}`
                        : ""
                }
            />

            <div className="location-select-divider"></div>

            <LocationSelect
                label="Địa chỉ tạm trú"
                onAddressChange={(addr: Address) => setTemporaryAddress(addr)}
                initialAddress={student?.dia_chi_tam_tru}
            />

            <label style={{ marginTop: "20px" }}>Địa chỉ tạm trú</label>

            <input
                type="text"
                id="temporary-address"
                readOnly
                placeholder="Địa chỉ tạm trú"
                value={
                    temporaryAddress
                        ? `${temporaryAddress.chi_tiet}, ${temporaryAddress.phuong_xa}, ${temporaryAddress.quan_huyen}, ${temporaryAddress.tinh_thanh_pho}`
                        : ""
                }
            />
        </div>
    );
};

export default AddressItem;