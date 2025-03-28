import { Student } from "../models/student";
import { Faculty } from "../../faculties/models/faculty";
import { Program } from "../../programs/models/program";
import { StudentStatus } from "../../student_statuses/models/student_status";
import { Address } from "../models/address";
import {
    IDDocument,
    CCCDDocument,
    CMNDDocument,
    PassportDocument,
} from "../models/id-document";
import "./profileDialog.css";
import React, { use, useEffect, useRef, useState } from "react";
import AddressItem from "./addressItem/addressItem";
import IdDocumentItem from "./idDocumentItem/idDocumentItem";

import { SERVER_URL } from "../../../../../global";

interface StudentItemProps {
    type: string;
    student: Student;
}

const validateEmail = (email: string) => {
    const emailError = document.querySelector(
        ".profile-dialog-info-form-error-email"
    ) as HTMLElement | null;

    const allowedDomain = "student.university.edu.vn";
    const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${allowedDomain}$`);

    if (!emailRegex.test(email)) {
        if (emailError) emailError.style.display = "flex";
        return false;
    } else {
        if (emailError) emailError.style.display = "none";
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
    // const [faculties, setFaculties] = useState<Faculty[]>([]);
    // const [programs, setPrograms] = useState<Program[]>([]);
    // const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([]);
    // const defaultAddress: Address = {
    //     chi_tiet: "",
    //     phuong_xa: "",
    //     quan_huyen: "",
    //     tinh_thanh_pho: "",
    //     quoc_gia: "",
    // };
    // const [addresses, setAddresses] = useState<Address[]>([
    //     defaultAddress,
    //     defaultAddress,
    // ]);

    // const defaultDocuments: IDDocument[] = [
    //     {
    //         type: "cccd",
    //         so: "",
    //         ngay_cap: new Date(),
    //         noi_cap: "",
    //         ngay_het_han: new Date(),
    //         co_gan_chip: false,
    //     } as CCCDDocument,
    //     {
    //         type: "cmnd",
    //         so: "",
    //         ngay_cap: new Date(),
    //         noi_cap: "",
    //         ngay_het_han: new Date(),
    //     } as CMNDDocument,
    //     {
    //         type: "passport",
    //         so: "",
    //         ngay_cap: new Date(),
    //         noi_cap: "",
    //         ngay_het_han: new Date(),
    //         quoc_gia_cap: "",
    //         ghi_chu: "",
    //     } as PassportDocument,
    // ];
    // const [documents, setDocuments] = useState<IDDocument[]>(defaultDocuments);

    // const [FormData, setFormData] = useState({
    //     ho_ten: "",
    //     ma_so_sinh_vien: "",
    //     ngay_sinh: "",
    //     gioi_tinh: "",
    //     khoa: "",
    //     khoa_hoc: "",
    //     chuong_trinh: "",
    //     email: "",
    //     so_dien_thoai: "",
    //     tinh_trang: "",
    // });

    // const profileDialog = document.querySelector(
    //     ".profile-dialog-container"
    // ) as HTMLElement;

    // function setInnerHTML() {
    //     if (!student || !faculties || !programs || !studentStatuses) {
    //         return <div>Loading...</div>;
    //     }
    //     const name = document.getElementById("name") as HTMLInputElement;
    //     const id = document.getElementById("id") as HTMLInputElement;
    //     const birthday = document.getElementById(
    //         "birthday"
    //     ) as HTMLInputElement;
    //     const gender = document.getElementById("gender") as HTMLInputElement;
    //     const faculty = document.getElementById("faculty") as HTMLSelectElement;
    //     const course = document.getElementById("course") as HTMLInputElement;
    //     const program = document.getElementById("program") as HTMLInputElement;
    //     const email = document.getElementById("email") as HTMLInputElement;
    //     const phone = document.getElementById("phone") as HTMLInputElement;
    //     const status = document.getElementById("status") as HTMLSelectElement;

    //     if (
    //         !name ||
    //         !id ||
    //         !birthday ||
    //         !gender ||
    //         !faculty ||
    //         !course ||
    //         !program ||
    //         !email ||
    //         !phone ||
    //         !status
    //     ) {
    //         return;
    //     }

    //     if (type === "edit") {
    //         name.value = student.ho_ten;
    //         id.value = student.ma_so_sinh_vien;
    //         birthday.value = student.ngay_sinh;
    //         gender.value = student.gioi_tinh;
    //         faculty.value = student.khoa.toString();
    //         course.value = student.khoa_hoc;
    //         program.value = student.chuong_trinh.toString();
    //         //setAddress(student.dia_chi_thuong_tru || defaultAddress);
    //         email.value = student.email || "";
    //         phone.value = student.so_dien_thoai || "";
    //         status.value = student.tinh_trang.toString();
    //     } else {
    //         name.value = "";
    //         id.value = "";
    //         birthday.value = "";
    //         gender.value = "";
    //         faculty.value = "";
    //         course.value = "";
    //         program.value = "";
    //         //setAddress(defaultAddress);
    //         email.value = "";
    //         phone.value = "";
    //         status.value = "";
    //     }
    // }

    // useEffect(() => {
    //     async function fetchFaculties() {
    //         try {
    //             const response = await fetch(
    //                 SERVER_URL + `/api/v1/faculties/all`
    //             );
    //             const data = await response.json();

    //             setFaculties(data);
    //         } catch (error) {
    //             console.error("Error fetching faculties:", error);
    //         }
    //     }

    //     async function fetchPrograms() {
    //         try {
    //             const response = await fetch(
    //                 SERVER_URL + `/api/v1/programs/all`
    //             );
    //             const data = await response.json();
    //             setPrograms(data);
    //         } catch (error) {
    //             console.error("Error fetching programs:", error);
    //         }
    //     }

    //     async function fetchStudentStatuses() {
    //         try {
    //             const response = await fetch(
    //                 SERVER_URL + `/api/v1/student-statuses/all`
    //             );
    //             const data = await response.json();
    //             setStudentStatuses(data);
    //         } catch (error) {
    //             console.error("Error fetching student statuses:", error);
    //         }
    //     }

    //     fetchFaculties();
    //     fetchPrograms();
    //     fetchStudentStatuses();
    // }, [student]);

    // useEffect(() => {
    //     setInnerHTML();
    // }, [type, student, faculties, programs, studentStatuses]);

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     const form = event.currentTarget;
    //     const emailInput = form.querySelector("#email") as HTMLInputElement;
    //     const phoneInput = form.querySelector("#phone") as HTMLInputElement;

    //     const email = emailInput.value.trim();
    //     const phone = phoneInput.value.trim();

    //     let isValid = true;

    //     if (!validateEmail(email)) isValid = false;
    //     if (!validatePhone(phone)) isValid = false;

    //     if (!isValid) return;

    //     const data = new FormData(form);

    //     const studentData = {
    //         ho_ten: data.get("name") as string,
    //         ma_so_sinh_vien: data.get("id") as string,
    //         ngay_sinh: data.get("birthday") as string,
    //         gioi_tinh: data.get("gender") as string,
    //         khoa: data.get("faculty") as string,
    //         khoa_hoc: data.get("course") as string,
    //         chuong_trinh: data.get("program") as string,
    //         dia_chi: data.get("address") as string,
    //         email: data.get("email") as string,
    //         so_dien_thoai: data.get("phone") as string,
    //         tinh_trang: data.get("status") as string,
    //     };

    //     if (type === "add") {
    //         try {
    //             const response = await fetch(`${SERVER_URL}/api/v1/students`, {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(studentData),
    //             });

    //             const responseData = await response.json();

    //             if (!response.ok) {
    //                 throw new Error(responseData.message || "Có lỗi xảy ra");
    //             }

    //             alert("Tạo sinh viên thành công!");
    //             profileDialog.classList.toggle("hidden");
    //             window.location.reload();
    //             return responseData;
    //         } catch (error) {
    //             if (error instanceof Error) {
    //                 alert(error.message);
    //             } else {
    //                 alert("Lỗi không xác định!");
    //             }
    //         }
    //     } else {
    //         try {
    //             const response = await fetch(
    //                 SERVER_URL + `/api/v1/students/${student._id}`,
    //                 {
    //                     method: "PATCH",
    //                     headers: { "Content-Type": "application/json" },
    //                     body: JSON.stringify(studentData),
    //                 }
    //             );

    //             const responseData = await response.json();

    //             if (!response.ok) {
    //                 throw new Error(responseData.message || "Có lỗi xảy ra");
    //             }

    //             alert("Cập nhật sinh viên thành công!");
    //             profileDialog.classList.toggle("hidden");
    //             window.location.reload();
    //             return responseData;
    //         } catch (error) {
    //             if (error instanceof Error) {
    //                 alert(error.message);
    //             } else {
    //                 alert("Lỗi không xác định!");
    //             }
    //         }
    //     }
    // };

    // function CancelHandler() {
    //     profileDialog.classList.toggle("hidden");
    // }

    const [studentIds, setStudentIds] = useState<string[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([]);

    const defaultAddress: Address = {
        chi_tiet: "",
        phuong_xa: "",
        quan_huyen: "",
        tinh_thanh_pho: "",
        quoc_gia: "",
    };
    const [addresses, setAddresses] = useState<Address[]>([
        defaultAddress,
        defaultAddress,
    ]);

    const defaultDocuments: IDDocument[] = [
        {
            type: "cccd",
            so: "",
            ngay_cap: new Date(),
            noi_cap: "",
            ngay_het_han: new Date(),
            co_gan_chip: false,
        } as CCCDDocument,
        {
            type: "cmnd",
            so: "",
            ngay_cap: new Date(),
            noi_cap: "",
            ngay_het_han: new Date(),
        } as CMNDDocument,
        {
            type: "passport",
            so: "",
            ngay_cap: new Date(),
            noi_cap: "",
            ngay_het_han: new Date(),
            quoc_gia_cap: "",
            ghi_chu: "",
        } as PassportDocument,
    ];
    const [documents, setDocuments] = useState<IDDocument[]>(defaultDocuments);

    const validTransitions: Record<string, string[]> = {
        "Đang học": ["Bảo lưu", "Tốt nghiệp", "Đình chỉ"],
        "Bảo lưu": ["Đang học", "Đình chỉ"],
        "Đình chỉ": ["Đang học"],
        "Tốt nghiệp": [],
    };

    const [formData, setFormData] = useState({
        ho_ten: "",
        ma_so_sinh_vien: "",
        ngay_sinh: "",
        gioi_tinh: "",
        khoa: "",
        khoa_hoc: "",
        chuong_trinh: "",
        email: "",
        so_dien_thoai: "",
        tinh_trang: "",
        dia_chi_thuong_tru: addresses[0],
        dia_chi_tam_tru: addresses[1],
        giay_to_tuy_than: documents,
    });

    const profileDialog = document.querySelector(
        ".profile-dialog-container"
    ) as HTMLElement;

    useEffect(() => {
        const fetchStudentIds = async () => {
            try {
                const response = await fetch(
                    `${SERVER_URL}/api/v1/students/all`
                );
                if (!response.ok)
                    throw new Error("Lỗi khi lấy danh sách sinh viên");
                const data = await response.json();
                const ids = data.map(
                    (student: { ma_so_sinh_vien: string }) =>
                        student.ma_so_sinh_vien
                );
                setStudentIds(ids);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sinh viên:", error);
            }
        };

        fetchStudentIds();
    }, []);

    useEffect(() => {
        const fetchData = async (url: string, setState: Function) => {
            try {
                const response = await fetch(`${SERVER_URL}${url}`);
                if (!response.ok) throw new Error("Error fetching data");
                const data = await response.json();
                setState(data);
            } catch (error) {
                console.error(`Error fetching ${url}:`, error);
            }
        };

        fetchData("/api/v1/faculties/all", setFaculties);
        fetchData("/api/v1/programs/all", setPrograms);
        fetchData("/api/v1/student-statuses/all", setStudentStatuses);
    }, []);

    useEffect(() => {
        if (type === "edit" && student) {
            setFormData({
                ho_ten: student.ho_ten || "",
                ma_so_sinh_vien: student.ma_so_sinh_vien || "",
                ngay_sinh: student.ngay_sinh || "",
                gioi_tinh: student.gioi_tinh || "",
                khoa: student.khoa?.toString() || "",
                khoa_hoc: student.khoa_hoc || "",
                chuong_trinh: student.chuong_trinh?.toString() || "",
                email: student.email || "",
                so_dien_thoai: student.so_dien_thoai || "",
                tinh_trang: student.tinh_trang?.toString() || "",
                dia_chi_thuong_tru: student.dia_chi_thuong_tru || addresses[0],
                dia_chi_tam_tru: student.dia_chi_tam_tru || addresses[1],
                giay_to_tuy_than: student.giay_to_tuy_than || documents,
            });
        } else {
            setFormData({
                ho_ten: "",
                ma_so_sinh_vien: "",
                ngay_sinh: "",
                gioi_tinh: "",
                khoa: "",
                khoa_hoc: "",
                chuong_trinh: "",
                email: "",
                so_dien_thoai: "",
                tinh_trang: "",
                dia_chi_thuong_tru: addresses[0],
                dia_chi_tam_tru: addresses[1],
                giay_to_tuy_than: documents,
            });
        }
    }, [type, student]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "ma_so_sinh_vien") {
            if (studentIds.includes(value)) {
                alert("Mã số sinh viên đã tồn tại, vui lòng nhập mã khác!");
                return;
            }
        } else if (name === "tinh_trang") {
            const currentStatusObj = studentStatuses.find(
                (status) => status._id.toString() === formData.tinh_trang
            );

            const newStatusObj = studentStatuses.find(
                (status) => status._id.toString() === value
            );

            if (!currentStatusObj || !newStatusObj) {
                alert("Không tìm thấy trạng thái!");
                return;
            }

            const currentStatus = currentStatusObj.tinh_trang;
            const newStatus = newStatusObj.tinh_trang;

            if (!validTransitions[currentStatus]?.includes(newStatus)) {
                alert(
                    `Không thể chuyển từ "${currentStatus}" sang "${newStatus}"!`
                );
                return;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(formData);

        if (
            !validateEmail(formData.email) ||
            !validatePhone(formData.so_dien_thoai)
        )
            return;

        try {
            const method = type === "add" ? "POST" : "PATCH";
            const url =
                type === "add"
                    ? "/api/v1/students"
                    : `/api/v1/students/${student?._id}`;
            const cleanedData = {
                ...formData,
                giay_to_tuy_than: formData.giay_to_tuy_than.map(
                    ({ _id, ...rest }) => rest
                ),
                dia_chi_thuong_tru: Array.isArray(formData.dia_chi_thuong_tru)
                    ? formData.dia_chi_thuong_tru.map(
                          ({ _id, ...rest }) => rest
                      )
                    : formData.dia_chi_thuong_tru &&
                      typeof formData.dia_chi_thuong_tru === "object"
                    ? (({ _id, ...rest }) => rest)(formData.dia_chi_thuong_tru)
                    : null,
                dia_chi_tam_tru: Array.isArray(formData.dia_chi_tam_tru)
                    ? formData.dia_chi_tam_tru.map(({ _id, ...rest }) => rest)
                    : formData.dia_chi_tam_tru &&
                      typeof formData.dia_chi_tam_tru === "object"
                    ? (({ _id, ...rest }) => rest)(formData.dia_chi_tam_tru)
                    : null,
            };

            console.log(cleanedData);
            const response = await fetch(`${SERVER_URL}${url}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanedData),
            });

            const responseData = await response.json();
            if (!response.ok)
                throw new Error(responseData.message || "Có lỗi xảy ra");

            alert(
                type === "add"
                    ? "Tạo sinh viên thành công!"
                    : "Cập nhật sinh viên thành công!"
            );
            profileDialog.classList.toggle("hidden");
            window.location.reload();
        } catch (error) {
            alert(
                error instanceof Error ? error.message : "Lỗi không xác định!"
            );
        }
    };

    const handleCancel = () => {
        profileDialog.classList.toggle("hidden");
    };

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
                                <label htmlFor="ho_ten">Họ tên</label>
                                <input
                                    type="text"
                                    id="ho_ten"
                                    name="ho_ten"
                                    value={formData.ho_ten}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="ma_so_sinh_vien">
                                    Mã số sinh viên
                                </label>
                                <input
                                    type="text"
                                    id="ma_so_sinh_vien"
                                    name="ma_so_sinh_vien"
                                    value={formData.ma_so_sinh_vien}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="ngay_sinh">Ngày sinh</label>
                                <input
                                    type="date"
                                    id="ngay_sinh"
                                    name="ngay_sinh"
                                    value={formData.ngay_sinh}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="gioi_tinh">Giới tính</label>
                                <input
                                    type="text"
                                    id="gioi_tinh"
                                    name="gioi_tinh"
                                    value={formData.gioi_tinh}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="khoa">Khoa</label>
                                <div className="profile-dialog-info-form-select">
                                    <select
                                        name="khoa"
                                        id="khoa"
                                        value={formData.khoa}
                                        onChange={handleChange}
                                    >
                                        {faculties.map((faculty, index) => (
                                            <option
                                                value={faculty._id.toString()}
                                                defaultChecked={index === 0}
                                            >
                                                {faculty.ten_khoa}
                                            </option>
                                        ))}
                                    </select>

                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="khoa_hoc">Khóa</label>
                                <input
                                    type="text"
                                    id="khoa_hoc"
                                    name="khoa_hoc"
                                    value={formData.khoa_hoc}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="chuong_trinh">
                                    Chương trình
                                </label>
                                <div className="profile-dialog-info-form-select">
                                    <select
                                        name="chuong_trinh"
                                        id="chuong_trinh"
                                        value={formData.chuong_trinh}
                                        onChange={handleChange}
                                    >
                                        {programs.map((program) => (
                                            <option
                                                value={program._id.toString()}
                                            >
                                                {program.name}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="so_dien_thoai">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    id="so_dien_thoai"
                                    name="so_dien_thoai"
                                    onInput={(e) =>
                                        validatePhone(e.currentTarget.value)
                                    }
                                    value={formData.so_dien_thoai}
                                    onChange={handleChange}
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
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <div className="profile-dialog-info-form-error profile-dialog-info-form-error-email">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span>Email không hợp lệ</span>
                                </div>
                            </div>
                            <div
                                className="profile-dialog-info-form-group"
                                style={{ marginTop: "20px" }}
                            >
                                <label htmlFor="tinh_trang">Tình trạng</label>
                                {/* <input type="text" id="status" name="status" /> */}
                                <div className="profile-dialog-info-form-select">
                                    <select
                                        name="tinh_trang"
                                        id="tinh_trang"
                                        value={formData.tinh_trang}
                                        onChange={handleChange}
                                    >
                                        {studentStatuses.map(
                                            (studentStatus) => (
                                                <option
                                                    value={studentStatus._id.toString()}
                                                >
                                                    {studentStatus.tinh_trang}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>

                            <AddressItem
                                student={student}
                                setAddresses={setAddresses}
                                type={type}
                            />

                            <IdDocumentItem
                                student={student}
                                setDocuments={setDocuments}
                                type={type}
                            />

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
                                    onClick={handleCancel}
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
