import React, { useState } from "react";
import { Address } from "../../models/address";
import { Student } from "../../models/student";
import LocationSelect from "./locationSelect/locationSelect";

interface AddressItemProps {
    student: Student;
}

const AddressItem: React.FC<AddressItemProps> = ({student}) => {

    const [permanentAddress, setPermanentAddress] = useState<Address | null>(
        null
    );
    const [temporaryAddress, setTemporaryAddress] = useState<Address | null>(
        null
    );
    return (
        <div>
            <LocationSelect
                label="Địa chỉ thường trú"
                onAddressChange={(addr: Address) => setPermanentAddress(addr)}
                initialAddress={student?.dia_chi_thuong_tru}
            />

            <label style={{ marginTop: "20px" }}>Địa chỉ thường trú</label>

            <input
                type="text"
                id="permanent-address"
                readOnly
                placeholder="Địa chỉ thường trú"
                value-detail={permanentAddress}
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
                value-detail={temporaryAddress}
                value={
                    temporaryAddress
                        ? `${temporaryAddress.chi_tiet}, ${temporaryAddress.phuong_xa}, ${temporaryAddress.quan_huyen}, ${temporaryAddress.tinh_thanh_pho}`
                        : ""
                }
            />
        </div>
    );
}

export default AddressItem
