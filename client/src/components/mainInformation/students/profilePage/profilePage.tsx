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
import "./profilePage.css";
import React, { useEffect, useState } from "react";
import AddressItem from "../profileDialog/addressItem/addressItem";
import IdDocumentItem from "../profileDialog/idDocumentItem/idDocumentItem";
import RegisCourse from "./regisCourese/regisCourse";
import { useNotification } from "../../../../components/common/NotificationContext";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { StudentRoute } from "../route/student.route";

const validateEmail = (email: string) => {
    const emailError = document.querySelector(
        ".profile-page-info-form-error-email"
    ) as HTMLElement | null;

    const allowedDomain = "student.university.edu.vi";
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
        ".profile-page-info-form-error-phone"
    ) as HTMLElement;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
        phoneError.style.display = "flex";
        return false;
    }
    phoneError.style.display = "none";
    return true;
};

const ProfilePage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([]);
    const { showNotification } = useNotification();
    const type = "edit";
    const id = useParams<{ id: string }>().id;
    const [student, setStudent] = useState<Student | null>(null);
    const [editedStudent, setEditedStudent] = useState<Student | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await StudentRoute.getStudentById(id!);
                setStudent(data);
                setEditedStudent(data);
            } catch (error) {
                console.error("Error fetching student:", error);
                showNotification('error', t('messages.error'));
            }
        };

        if (type === "edit" && id) {
            fetchStudent();
        }
    }, [id, type, t, showNotification]);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultiesData, programsData, studentStatusesData] = await Promise.all([
                    StudentRoute.getAllFaculties(),
                    StudentRoute.getAllPrograms(),
                    StudentRoute.getAllStudentStatuses()
                ]);
                setFaculties(facultiesData);
                setPrograms(programsData);
                setStudentStatuses(studentStatusesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('error', t('messages.error'));
            }
        };

        fetchData();
    }, [t, showNotification]);

    useEffect(() => {
        if (type === "edit" && student) {
            setFormData({
                ho_ten: student.ho_ten || "",
                ma_so_sinh_vien: student.ma_so_sinh_vien || "",
                ngay_sinh: student.ngay_sinh || "",
                gioi_tinh: i18n.language === "en"? student.gioi_tinh.en : student.gioi_tinh.vi || "",
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
            const cleanedData = {
                ...formData,
                giay_to_tuy_than: documents ? documents.map(
                    ({ _id, ...rest }) => rest
                )
                    : [],
                dia_chi_thuong_tru: addresses ? addresses[0] : null,
                dia_chi_tam_tru: addresses ? addresses[1] : null,
            };

            await StudentRoute.updateStudent(student?._id.toString() || '', cleanedData);
            showNotification('success', "Student updated successfully!");
            window.location.reload();
        } catch (error) {
            if (error instanceof Error) {
                showNotification('error', error.message);
            } else {
                showNotification('error', 'Unknown error occurred!');
            }
        }
    };

    const handleSave = async () => {
        if (!editedStudent) return;

        if (!validatePhone(editedStudent.so_dien_thoai || '')) {
            showNotification('error', t('profile.invalidPhone'));
            return;
        }

        if (!validateEmail(editedStudent.email || '')) {
            showNotification('error', t('profile.invalidEmail'));
            return;
        }

        try {
            await StudentRoute.updateStudent(student?._id.toString() || '', editedStudent);
            showNotification('success', t('profile.updateSuccess'));
            setIsEditing(false);
        } catch (error) {
            showNotification('error', t('profile.updateError'));
        }
    };

    const handleCancel = () => {
        if (student) {
            setEditedStudent(student);
        }
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate('/students');
    };

    if (!student) {
        return (
            <div className="profile-page-container hidden">
                <div className="profile-page">
                    <h1>{t('profile.loading')}</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <div className="profile-page">
                <div className="profile-page-header">
                    <button
                        className="profile-page-header-back"
                        onClick={handleBack}
                    >
                        <ArrowLeftIcon fontSize="large"/>
                    </button>
                    <h1>{t('profile.title')}</h1>
                    <div className="profile-page-actions">
                        {isEditing ? (
                            <>
                                <button className="profile-page-save-btn" onClick={handleSave}>
                                    {t('common.save')}
                                </button>
                                <button className="profile-page-cancel-btn" onClick={handleCancel}>
                                    {t('common.cancel')}
                                </button>
                            </>
                        ) : (
                            <button className="profile-page-edit-btn" onClick={() => setIsEditing(true)}>
                                {t('common.edit')}
                            </button>
                        )}
                    </div>
                </div>
                <div className="profile-page-info">
                    <form
                        className="profile-page-info-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="profile-page-info-form-top">
                            <div className="profile-page-info-form-group">
                                <label htmlFor="ho_ten">{t('profile.fullName')}</label>
                                <input
                                    type="text"
                                    id="ho_ten"
                                    name="ho_ten"
                                    value={formData.ho_ten}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="profile-page-info-form-group">
                                <label htmlFor="ma_so_sinh_vien">{t('profile.studentId')}</label>
                                <input
                                    type="text"
                                    id="ma_so_sinh_vien"
                                    name="ma_so_sinh_vien"
                                    value={formData.ma_so_sinh_vien}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="profile-page-info-form-group">
                                <label htmlFor="ngay_sinh">{t('profile.birthDate')}</label>
                                <input
                                    type="date"
                                    id="ngay_sinh"
                                    name="ngay_sinh"
                                    value={formData.ngay_sinh}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="profile-page-info-form-group">
                                <label htmlFor="gioi_tinh">{t('profile.gender')}</label>
                                <input
                                    type="text"
                                    id="gioi_tinh"
                                    name="gioi_tinh"
                                    value={formData.gioi_tinh}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="profile-page-info-form-group">
                                <label htmlFor="khoa">{t('profile.faculty')}</label>
                                <div className="profile-page-info-form-select">
                                    <select
                                        name="khoa"
                                        id="khoa"
                                        value={formData.khoa}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    >
                                        {faculties.map((faculty, index) => (
                                            <option
                                                key={faculty._id.toString()}
                                                value={faculty._id.toString()}
                                                defaultChecked={index === 0}
                                            >
                                                {i18n.language === 'en' ? faculty.ten_khoa.en : faculty.ten_khoa.vi}
                                            </option>
                                        ))}
                                    </select>

                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-page-info-form-group">
                                <label htmlFor="khoa_hoc">{t('profile.course')}</label>
                                <input
                                    type="text"
                                    id="khoa_hoc"
                                    name="khoa_hoc"
                                    value={formData.khoa_hoc}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="profile-page-info-form-group">
                                <label htmlFor="chuong_trinh">{t('profile.program')}</label>
                                <div className="profile-page-info-form-select">
                                    <select
                                        name="chuong_trinh"
                                        id="chuong_trinh"
                                        value={formData.chuong_trinh}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    >
                                        {programs.map((program) => (
                                            <option
                                                key={program._id.toString()}
                                                value={program._id.toString()}
                                            >
                                                {i18n.language === 'en' ? program.name.en : program.name.vi}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-page-info-form-group">
                                <label htmlFor="so_dien_thoai">{t('profile.phone')}</label>
                                <input
                                    type="text"
                                    id="so_dien_thoai"
                                    name="so_dien_thoai"
                                    onInput={(e) =>
                                        validatePhone(e.currentTarget.value)
                                    }
                                    value={formData.so_dien_thoai}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                <div className="profile-page-info-form-error profile-page-info-form-error-phone">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span>{t('profile.invalidPhone')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-page-info-form-bottom">
                            <div className="profile-page-info-form-group">
                                <label htmlFor="email">{t('profile.email')}</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    onInput={(e) =>
                                        validateEmail(e.currentTarget.value)
                                    }
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                <div className="profile-page-info-form-error profile-page-info-form-error-email">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span>{t('profile.invalidEmail')}</span>
                                </div>
                            </div>
                            <div
                                className="profile-page-info-form-group"
                                style={{ marginTop: "20px" }}
                            >
                                <label htmlFor="tinh_trang">{t('profile.status')}</label>
                                <div className="profile-page-info-form-select">
                                    <select
                                        name="tinh_trang"
                                        id="tinh_trang"
                                        value={formData.tinh_trang}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    >
                                        {studentStatuses.map(
                                            (studentStatus) => (
                                                <option
                                                    key={studentStatus._id.toString()}
                                                    value={studentStatus._id.toString()}
                                                >
                                                    {i18n.language === 'en' ? studentStatus.tinh_trang.en : studentStatus.tinh_trang.vi}
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

                            <div className="profile-page-action">
                                <button
                                    className="profile-page-action-save"
                                    type="submit"
                                >
                                    {t('profile.save')}
                                </button>
                                <button
                                    className="profile-page-action-cancel"
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    {t('profile.cancel')}
                                </button>
                            </div>
                        </div>
                    </form>
                    <RegisCourse student={student}/>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
