import React, { useEffect, useState } from 'react'
import { Address } from '../../../models/address';
import { District } from '../../../models/district';
import { Province } from '../../../models/province';
import { Ward } from '../../../models/ward';

interface LocationSelectProps {
    label: string;
    onAddressChange: (address: Address) => void;
    initialAddress?: Address | null;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
    label,
    onAddressChange,
    initialAddress,
}) => {

    const [provinces, setProvinces] = React.useState<Province[]>([]);
    const [selectedProvince, setSelectedProvinceCode] = useState<number | null>(
        null
    );

    const [districts, setDistricts] = React.useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrictCode] = useState<number | null>(
        null
    );

    const [wards, setWards] = React.useState<Ward[]>([]);
    const [selectedWard, setSelectedWardCode] = useState<number | null>(null);

    const [detail, setDetail] = React.useState<string>("");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(
                    "https://provinces.open-api.vn/api/?depth=3"
                );

                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error("Error fetching provinces: ", error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (initialAddress && provinces.length > 0) {
            const province = provinces.find(
                (p) => p.name === initialAddress.tinh_thanh_pho
            );
            if (province) {
                setSelectedProvinceCode(province.code);
                setDistricts(province.districts);

                const district = province.districts.find(
                    (d) => d.name === initialAddress.quan_huyen
                );
                if (district) {
                    setSelectedDistrictCode(district.code);
                    setWards(district.wards);

                    const ward = district.wards.find(
                        (w) => w.name === initialAddress.phuong_xa
                    );
                    if (ward) {
                        setSelectedWardCode(ward.code);
                    }
                }
            }
            setDetail(initialAddress.chi_tiet || "");
        }
    }, [initialAddress, provinces]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = parseInt(e.target.value);
        setSelectedProvinceCode(code);

        const selectedProvince = provinces.find((p) => p.code === code);
        if (selectedProvince) {
            setDistricts(selectedProvince.districts);
        } else {
            setDistricts([]);
        }
        setSelectedDistrictCode(null);
        setSelectedWardCode(null);
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = parseInt(e.target.value);
        setSelectedDistrictCode(code);

        const selectedDistrict = districts.find((d) => d.code === code);
        if (selectedDistrict) {
            setWards(selectedDistrict.wards);
        } else {
            setWards([]);
        }
        setSelectedWardCode(null);
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = parseInt(e.target.value);
        setSelectedWardCode(code);
    };

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetail(e.target.value);
    };

    useEffect(() => {
        const province =
            provinces.find((p) => p.code === selectedProvince)?.name || "";
        const district =
            districts.find((d) => d.code === selectedDistrict)?.name || "";
        const ward = wards.find((w) => w.code === selectedWard)?.name || "";
        if (province && district && ward && detail) {
            onAddressChange({
                chi_tiet: detail,
                phuong_xa: ward,
                quan_huyen: district,
                tinh_thanh_pho: province,
                quoc_gia: "Việt Nam",
            });
        } else {
            onAddressChange({
                chi_tiet: "",
                phuong_xa: "",
                quan_huyen: "",
                tinh_thanh_pho: "",
                quoc_gia: "Việt Nam",
            });
        }
    }, [
        selectedProvince,
        selectedDistrict,
        selectedWard,
        detail,
    ]);

    return (
        <div className="location-select">
            <label htmlFor="">Tỉnh, huyện</label>

            <div className="location-select-group">
                <select
                    name="province"
                    id="province"
                    onChange={handleProvinceChange}
                    value={selectedProvince || ""}
                >
                    <option value="">-- Chọn tỉnh --</option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </select>
                <select
                    name="district"
                    id="district"
                    onChange={handleDistrictChange}
                    value={selectedDistrict || ""}
                >
                    <option value="">-- Chọn quận --</option>
                    {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                            {district.name}
                        </option>
                    ))}
                </select>
            </div>

            <label htmlFor="">Phường/Xã, Số Nhà, Đường</label>

            <div className="location-select-group">
                <select
                    name="ward"
                    id="ward"
                    onChange={handleWardChange}
                    value={selectedWard || ""}
                >
                    <option value="">-- Chọn phường --</option>
                    {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                            {ward.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    id="detail"
                    name="detail"
                    placeholder="Số nhà, đường..."
                    onChange={handleDetailChange}
                    value={detail}
                />
            </div>
        </div>
    );
}

export default LocationSelect
