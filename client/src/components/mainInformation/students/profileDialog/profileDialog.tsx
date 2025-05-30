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
import React, { useEffect, useState } from "react";
import AddressItem from "./addressItem/addressItem";
import IdDocumentItem from "./idDocumentItem/idDocumentItem";
import { useNotification } from "../../../../components/common/NotificationContext";
import { useTranslation } from 'react-i18next';

import { SERVER_URL } from "../../../../../global";

interface StudentItemProps {
    type: string;
    student: Student;
    onSuccess: () => void;
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

const ProfileDialog: React.FC<StudentItemProps> = ({ type, student, onSuccess }) => {
    const { t } = useTranslation();
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([]);
    const { showNotification } = useNotification();

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
            if (name === "tinh_trang") {
            const currentStatusObj = studentStatuses.find(
                (status) => status._id.toString() === formData.tinh_trang
            );

            const newStatusObj = studentStatuses.find(
                (status) => status._id.toString() === value
            );

            if (!currentStatusObj || !newStatusObj) {
                showNotification('error', "Status not found!");
                return;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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
                giay_to_tuy_than: documents ? documents.map(
                    ({ _id, ...rest }) => rest
                )
                : [],
                dia_chi_thuong_tru: addresses ? addresses[0] : null, 
                dia_chi_tam_tru: addresses ? addresses[1] : null,
            };

            const response = await fetch(`${SERVER_URL}${url}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanedData),
            });

            const responseData = await response.json();
            if (!response.ok)
                throw new Error(responseData.message || t('messages.error'));

            showNotification('success', 
                type === "add"
                    ? t('messages.createSuccess')
                    : t('messages.updateSuccess')
            );
            profileDialog.classList.toggle("hidden");
            onSuccess();
        } catch (error) {
            if (error instanceof Error) {
                showNotification('error', error.message);
            } else {
                showNotification('error', t('messages.unknownError'));
            }
        }
    };

    const handleCancel = () => {
        profileDialog.classList.toggle("hidden");
    };

    return (
        <div className="profile-dialog-container hidden">
            <div className="profile-dialog">
                <h1>{t('student.profile')}</h1>
                <div className="profile-dialog-info">
                    <form
                        className="profile-dialog-info-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="profile-dialog-info-form-top">
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="ho_ten">{t('student.fullName')}</label>
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
                                    {t('student.studentId')}
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
                                <label htmlFor="ngay_sinh">{t('student.birthDate')}</label>
                                <input
                                    type="date"
                                    id="ngay_sinh"
                                    name="ngay_sinh"
                                    value={formData.ngay_sinh}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="gioi_tinh">{t('student.gender')}</label>
                                <input
                                    type="text"
                                    id="gioi_tinh"
                                    name="gioi_tinh"
                                    value={formData.gioi_tinh}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="khoa">{t('nav.faculty')}</label>
                                <div className="profile-dialog-info-form-select">
                                    <select
                                        name="khoa"
                                        id="khoa"
                                        value={formData.khoa}
                                        onChange={handleChange}
                                    >
                                        {faculties.map((faculty, index) => (
                                            <option
                                                key={faculty._id.toString()}
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
                                <label htmlFor="khoa_hoc">{t('student.course')}</label>
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
                                    {t('nav.programs')}
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
                                                key={program._id.toString()}
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
                                    {t('student.phone')}
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
                                    <span>{t('messages.invalidPhone')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-dialog-info-form-bottom">
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="email">{t('student.email')}</label>
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
                                    <span>{t('messages.invalidEmail')}</span>
                                </div>
                            </div>
                            <div
                                className="profile-dialog-info-form-group"
                                style={{ marginTop: "20px" }}
                            >
                                <label htmlFor="tinh_trang">{t('student.status')}</label>
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
                                                    key={studentStatus._id.toString()}
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
                                    {type !== "add" ? t('common.save') : t('common.add')}
                                </button>
                                <button
                                    className="profile-dialog-action-cancel"
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    {t('common.cancel')}
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
