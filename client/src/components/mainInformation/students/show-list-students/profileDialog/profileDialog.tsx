import { Student } from "../../../../../model/student";
import { Faculty } from "../../../../../model/faculty";
import { Program } from "../../../../../model/program";
import { StudentStatus } from "../../../../../model/student_status";
import "./profileDialog.css";
import React, { useEffect, useState } from "react";

interface StudentItemProps {
    type: string;
    student: Student;
}

interface Address {
    chi_tiet: string;
    phuong_xa: string;
    quan_huyen: string;
    tinh_thanh_pho: string;
    quoc_gia: string;
}

interface Province {
    name: string;
    code: number;
    districts: District[];
}

interface District {
    name: string;
    code: number;
    wards: Ward[];
}

interface Ward {
    name: string;
    code: number;
}

interface LocationSelectProps {
    label: string;
    onAddressChange: (address: Address) => void;
    initialAddress?: Address | null;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
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
            setDetail(initialAddress.chi_tiet);
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
        provinces,
        districts,
        wards,
        onAddressChange,
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
};

interface AddressFormProps {
    student: Student;
}

const AddressForm: React.FC<AddressFormProps> = ({ student }) => {
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
};

const ProfileForm = () => {
    const [selected, setSelected] = useState("");

    return (
        <div className="profile-dialog-info-form-group">
            <label style={{ marginTop: "20px" }}>
                Giấy tờ chứng minh nhân thân của sinh viên
            </label>
            <div className="profile-dialog-info-form-radio">
                <label>
                    <input
                        type="radio"
                        name="giayto"
                        value="CMND"
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    CMND
                </label>

                <label>
                    <input
                        type="radio"
                        name="giayto"
                        value="CCCD"
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    CCCD
                </label>

                <label>
                    <input
                        type="radio"
                        name="giayto"
                        value="HC"
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    Hộ chiếu
                </label>
            </div>

            {selected === "CMND" && (
                <div className="profile-dialog-info-form-cmnd">
                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="cmnd">CMND</label>
                        <input type="text" name="cmnd" id="cmnd" />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="ngay_cap_cmnd">Ngày Cấp</label>
                        <input
                            type="date"
                            name="ngay_cap_cmnd"
                            id="ngay_cap_cmnd"
                        />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="noi_cap_cmnd">Nơi Cấp</label>
                        <input
                            type="text"
                            name="noi_cap_cmnd"
                            id="noi_cap_cmnd"
                        />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="ngay_het_han_cmnd">Ngày Hết Hạn</label>
                        <input
                            type="date"
                            name="ngay_het_han_cmnd"
                            id="ngay_het_han_cmnd"
                        />
                    </div>
                </div>
            )}

            {selected === "CCCD" && (
                <div className="profile-dialog-info-form-cccd">
                    <div className="profile-dialog-info-form-cccd-top">
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="cccd">CCCD</label>
                            <input type="text" name="cccd" id="cccd" />
                        </div>

                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="ngay_cap_cccd">Ngày Cấp</label>
                            <input
                                type="date"
                                name="ngay_cap_cccd"
                                id="ngay_cap_cccd"
                            />
                        </div>

                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="noi_cap_cccd">Nơi Cấp</label>
                            <input
                                type="text"
                                name="noi_cap_cccd"
                                id="noi_cap_cccd"
                            />
                        </div>

                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="ngay_het_han_cccd">
                                Ngày Hết Hạn
                            </label>
                            <input
                                type="date"
                                name="ngay_het_han_cccd"
                                id="ngay_het_han_cccd"
                            />
                        </div>
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
                            />
                            Có
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="co_gan_chip"
                                value="false"
                            />
                            Không
                        </label>
                    </div>
                </div>
            )}

            {selected === "HC" && (
                <div className="profile-dialog-info-form-hc">
                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="hc">Hộ chiếu</label>
                        <input type="text" name="hc" id="hc" />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="ngay_cap_hc">Ngày Cấp</label>
                        <input type="date" name="gay_cap_hc" id="gay_cap_hc" />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="noi_cap_hc">Nơi Cấp</label>
                        <input type="text" name="noi_cap_hc" id="noi_cap_hc" />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="ngay_het_han_hc">Ngày Hết Hạn</label>
                        <input
                            type="date"
                            name="ngay_het_han_hc"
                            id="ngay_het_han_hc"
                        />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="quoc_gia_cap_hc">Quốc Gia Cấp</label>
                        <input
                            type="text"
                            name="quoc_gia_cap_hc"
                            id="quoc_gia_cap_hc"
                        />
                    </div>

                    <div className="profile-dialog-info-form-group">
                        <label htmlFor="ghi_chu_hc">Ghi Chú</label>
                        <input type="text" name="ghi_chu_hc" id="ghi_chu_hc" />
                    </div>
                </div>
            )}
        </div>
    );
};

const validateEmail = (email: string) => {
    const emailError = document.querySelector(
        ".profile-dialog-info-form-error-email"
    ) as HTMLElement;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        emailError.style.display = "flex";
        return false;
    } else {
        emailError.style.display = "none";
        return true;
    }
};

const validatePhone = (phone: string) => {
    const phoneError = document.querySelector(
        ".profile-dialog-info-form-error-phone"
    ) as HTMLElement;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
        phoneError.style.display = "flex";
        return false;
    }
    phoneError.style.display = "none";
    return true;
};

const ProfileDialog: React.FC<StudentItemProps> = ({ type, student }) => {
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [programs, setPrograms] = useState<Program[]>([])
    const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([])

    const profileDialog = document.querySelector(
        ".profile-dialog-container"
    ) as HTMLElement;

    function setInnerHTML() {
        if (!student || !faculties || !programs || !studentStatuses) {
            return <div>Loading...</div>;
        }
        const name = document.getElementById("name") as HTMLInputElement;
        const id = document.getElementById("id") as HTMLInputElement;
        const birthday = document.getElementById(
            "birthday"
        ) as HTMLInputElement;
        const gender = document.getElementById("gender") as HTMLInputElement;
        const faculty = document.getElementById("faculty") as HTMLSelectElement;
        const course = document.getElementById("course") as HTMLInputElement;
        const program = document.getElementById("program") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const phone = document.getElementById("phone") as HTMLInputElement;
        const status = document.getElementById("status") as HTMLSelectElement;
        const permanent_address = document.getElementById(
            "permanent-address"
        ) as HTMLInputElement;
        const permanent_address_value =
            permanent_address.getAttribute("value-detail");
        const temporary_address = document.getElementById(
            "temporary-address"
        ) as HTMLInputElement;
        const temporary_address_value =
            temporary_address.getAttribute("value-detail");
        const cmnd = document.getElementById("cmnd") as HTMLInputElement;
        const issue_date_cmnd = document.getElementById(
            "ngay_cap_cmnd"
        ) as HTMLInputElement;
        const issue_place_cmnd = document.getElementById(
            "noi_cap_cmnd"
        ) as HTMLInputElement;
        const expire_date_cmnd = document.getElementById(
            "ngay_het_han_cmnd"
        ) as HTMLInputElement;
        const cccd = document.getElementById("cccd") as HTMLInputElement;
        const issue_date_cccd = document.getElementById(
            "ngay_cap_cccd"
        ) as HTMLInputElement;
        const issue_place_cccd = document.getElementById(
            "noi_cap_cccd"
        ) as HTMLInputElement;
        const expire_date_cccd = document.getElementById(
            "ngay_het_han_cccd"
        ) as HTMLInputElement;
        const chip = document.getElementById("chip") as HTMLInputElement;
        const hc = document.getElementById("hc") as HTMLInputElement;
        const issue_date_hc = document.getElementById(
            "ngay_cap_hc"
        ) as HTMLInputElement;
        const issue_place_hc = document.getElementById(
            "noi_cap_hc"
        ) as HTMLInputElement;
        const expire_date_hc = document.getElementById(
            "ngay_het_han_hc"
        ) as HTMLInputElement;
        const country_hc = document.getElementById(
            "quoc_gia_cap_hc"
        ) as HTMLInputElement;
        const note_hc = document.getElementById(
            "ghi_chu_hc"
        ) as HTMLInputElement;

        if (
            !name ||
            !id ||
            !birthday ||
            !gender ||
            !faculty ||
            !course ||
            !program ||
            !email ||
            !phone ||
            !status ||
            !cmnd ||
            !issue_date_cmnd ||
            !issue_place_cmnd ||
            !expire_date_cmnd ||
            !cccd ||
            !issue_date_cccd ||
            !issue_place_cccd ||
            !expire_date_cccd ||
            !chip ||
            !hc ||
            !issue_date_hc ||
            !issue_place_hc ||
            !expire_date_hc ||
            !country_hc ||
            !note_hc
        ) {
            return;
        }

        if (type === "edit") {
            name.value = student.ho_ten;
            id.value = student.ma_so_sinh_vien;
            birthday.value = student.ngay_sinh;
            gender.value = student.gioi_tinh;
            faculty.value = student.khoa;
            course.value = student.khoa_hoc;
            program.value = student.chuong_trinh;
            cmnd.value = student.giay_to_tuy_than[0].so;
            issue_date_cmnd.value = student.giay_to_tuy_than[0].ngay_cap;
            issue_place_cmnd.value = student.giay_to_tuy_than[0].noi_cap;
            expire_date_cmnd.value = student.giay_to_tuy_than[0].ngay_het_han;
            cccd.value = student.giay_to_tuy_than[1].so;
            issue_date_cccd.value = student.giay_to_tuy_than[1].ngay_cap;
            issue_place_cccd.value = student.giay_to_tuy_than[1].noi_cap;
            expire_date_cccd.value = student.giay_to_tuy_than[1].ngay_het_han;
            chip.value = student.giay_to_tuy_than[1].co_gan_chip ? "true" : "false";
            hc.value = student.giay_to_tuy_than[2].so;
            issue_date_hc.value = student.giay_to_tuy_than[2].ngay_cap;
            issue_place_hc.value = student.giay_to_tuy_than[2].noi_cap;
            expire_date_hc.value = student.giay_to_tuy_than[2].ngay_het_han;
            country_hc.value = student.giay_to_tuy_than[2].quoc_gia_cap;
            note_hc.value = student.giay_to_tuy_than[2].ghi_chu;
            email.value = student.email || "";
            phone.value = student.so_dien_thoai || "";
            status.value = student.tinh_trang;
        } else {
            name.value = "";
            id.value = "";
            birthday.value = "";
            gender.value = "";
            faculty.value = "";
            course.value = "";
            program.value = "";
            email.value = "";
            phone.value = "";
            status.value = "";
            cmnd.value = "";
            issue_date_cmnd.value = "";
            issue_place_cmnd.value = "";
            expire_date_cmnd.value = "";
            cccd.value = "";
            issue_date_cccd.value = "";
            issue_place_cccd.value = "";
            expire_date_cccd.value = "";
            chip.value = "";
            hc.value = "";
            issue_date_hc.value = "";
            issue_place_hc.value = "";
            expire_date_hc.value = "";
            country_hc.value = "";
            note_hc.value = "";
        }
    }

    useEffect(() => {

        async function fetchFaculties() {
            try {
                const response = await fetch('http://localhost:3001/api/v1/faculties/all')
                const data = await response.json()

                setFaculties(data)
            } catch (error) {
                console.error('Error fetching faculties:', error)
            }
        }

        async function fetchPrograms() {
            try {
                const response = await fetch('http://localhost:3001/api/v1/programs/all')
                const data = await response.json()
                setPrograms(data)
            } catch (error) {
                console.error('Error fetching programs:', error)
            }
        }

        async function fetchStudentStatuses() {
            try {
                const response = await fetch('http://localhost:3001/api/v1/student-statuses/all')
                const data = await response.json()
                setStudentStatuses(data)
            } catch (error) {
                console.error('Error fetching student statuses:', error)
            }
        }

        fetchFaculties()
        fetchPrograms()
        fetchStudentStatuses()

    }, []);

    useEffect(() => {
        setInnerHTML();
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const emailInput = form.querySelector("#email") as HTMLInputElement;
        const phoneInput = form.querySelector("#phone") as HTMLInputElement;

        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        let isValid = true;

        if (!validateEmail(email)) isValid = false;
        if (!validatePhone(phone)) isValid = false;

        if (!isValid) return;

        const data = new FormData(form);

        const studentData = {
            ho_ten: data.get("name") as string,
            ma_so_sinh_vien: data.get("id") as string,
            ngay_sinh: data.get("birthday") as string,
            gioi_tinh: data.get("gender") as string,
            khoa: data.get("faculty") as string,
            khoa_hoc: data.get("course") as string,
            chuong_trinh: data.get("program") as string,
            dia_chi_thuong_tru: data.get("permanent_address_value") as object,
            dia_chi_tam_tru: data.get("temporary_address_value") as object,
            giay_to_tuy_than: [
                {
                    type: "cmnd",
                    so: data.get("cmnd") as string,
                    ngay_cap: data.get("issue_date_cmnd") as string,
                    noi_cap: data.get("issue_place_cmnd") as string,
                    ngay_het_han: data.get("expire_date_cmnd") as string,
                },
                {
                    type: "cccd",
                    so: data.get("cccd") as string,
                    ngay_cap: data.get("issue_date_cccd") as string,
                    noi_cap: data.get("issue_place_cccd") as string,
                    ngay_het_han: data.get("expire_date_cccd") as string,
                    co_gan_chip: data.get("co_gan_chip") === "true",
                },
                {
                    type: "passport",
                    so: data.get("hc") as string,
                    ngay_cap: data.get("issue_date_hc") as string,
                    noi_cap: data.get("issue_place_hc") as string,
                    ngay_het_han: data.get("expire_date_hc") as string,
                    quoc_gia_cap: data.get("quoc_gia_cap_hc") as string,
                    ghi_chu: data.get("ghi_chu_hc") as string,
                },
            ],
            email: data.get("email") as string,
            so_dien_thoai: data.get("phone") as string,
            tinh_trang: data.get("status") as string,
        };

        console.log(JSON.stringify(studentData));

        if (type === "add") {
            try {
                const response = await fetch(
                    "http://localhost:3001/api/v1/students",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(studentData),
                    }
                );

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || "Có lỗi xảy ra");
                }

                alert("Tạo sinh viên thành công!");
                profileDialog.classList.toggle("hidden");
                window.location.reload();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("Lỗi không xác định!");
                }
            }
        } else {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/v1/students/${student._id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(studentData),
                    }
                );

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || "Có lỗi xảy ra");
                }

                alert("Cập nhật sinh viên thành công!");
                profileDialog.classList.toggle("hidden");
                window.location.reload();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("Lỗi không xác định!");
                }
            }
        }
    };

    function CancelHandler() {
        profileDialog.classList.toggle("hidden");
    }

    return (
        <div className="profile-dialog-container hidden">
            <div className="profile-dialog">
                <h1>Profile</h1>
                <div className="profile-dialog-info">
                    <form
                        className="profile-dialog-info-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="profile-dialog-info-form-top">
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="name">Họ tên</label>
                                <input type="text" id="name" name="name" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="id">Mã số sinh viên</label>
                                <input type="text" id="id" name="id" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="birthday">Ngày sinh</label>
                                <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="gender">Giới tính</label>
                                <input type="text" id="gender" name="gender" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="faculty">Khoa</label>
                                <div className="profile-dialog-info-form-select">
                                    <select name="faculty" id="faculty">
                                        {faculties.map((faculty, index) => (
                                            <option value={faculty._id.toString()} defaultChecked={index === 0}>{faculty.ten_khoa}</option>
                                        ))}
                                    </select>

                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="course">Khóa</label>
                                <input type="text" id="course" name="course" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="program">Chương trình</label>
                                <div className="profile-dialog-info-form-select">
                                    <select name="program" id="program">
                                        {programs.map((program) => (
                                            <option value={program._id.toString()}>{program.name}</option>
                                        ))}
                                    </select>
                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    onInput={(e) =>
                                        validatePhone(e.currentTarget.value)
                                    }
                                />
                                <div className="profile-dialog-info-form-error profile-dialog-info-form-error-phone">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span>Số điện thoại không hợp lệ</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-dialog-info-form-bottom">
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    onInput={(e) =>
                                        validateEmail(e.currentTarget.value)
                                    }
                                />
                                <div className="profile-dialog-info-form-error profile-dialog-info-form-error-email">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span>Email không hợp lệ</span>
                                </div>
                            </div>

                            <ProfileForm />

                            <div className="profile-dialog-info-form-group">
                                <div className="profile-dialog-info-form-address">
                                    <AddressForm student={student}/>
                                </div>
                            </div>
                            <div
                                className="profile-dialog-info-form-group"
                                style={{ marginTop: "20px" }}
                            >
                                <label htmlFor="status">Tình trạng</label>
                                {/* <input type="text" id="status" name="status" /> */}
                                <div className="profile-dialog-info-form-select">
                                    <select name="status" id="status">
                                        {studentStatuses.map((studentStatus) => (
                                            <option value={studentStatus._id.toString()}>{studentStatus.tinh_trang}</option>
                                        ))}
                                    </select>

                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-dialog-action">
                                <button
                                    className="profile-dialog-action-save"
                                    type="submit"
                                >
                                    {type !== "add" ? "Save" : "Add"}
                                </button>
                                <button
                                    className="profile-dialog-action-cancel"
                                    type="button"
                                    onClick={CancelHandler}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileDialog;
