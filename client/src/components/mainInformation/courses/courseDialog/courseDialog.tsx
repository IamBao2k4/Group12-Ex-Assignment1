import React, { useState, useEffect } from "react";
import "./courseDialog.css";
import { SERVER_URL } from "../../../../../global";
import { useTranslation } from 'react-i18next';
import { Course } from "../models/course";
import { Faculty } from "../../faculties/models/faculty";
import { useNotification } from '../../../common/NotificationContext';
import { CourseName } from "../models/course";
import { GoogleTranslateService } from '../../../../middleware/gg-trans'

interface CourseDialogProps {
    type: string;
    course: Course;
    onSuccess: () => void;
}

const CourseDialog: React.FC<CourseDialogProps> = ({ course, type, onSuccess }) => {
    const { t, i18n } = useTranslation();
    const [maMonHoc, setMaMonHoc] = useState(course?.ma_mon_hoc || "");
    const [ten, setTen] = useState<CourseName>(course?.ten || { vi: "", en: "" });
    const [tinChi, setTinChi] = useState(course?.tin_chi || 0);
    const [faculty, setFaculty] = useState<string>(course?.khoa?.toString() || "");
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                setLoading(true);
                const response = await fetch(SERVER_URL + '/api/v1/faculties/all');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const text = await response.text();
                
                if (!text) {
                    console.warn('Empty response from faculties API');
                    setFaculties([]);
                    return;
                }
                
                const data = JSON.parse(text);
                
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setFaculties(data);
                } else if (data && Array.isArray(data.data)) {
                    setFaculties(data.data);
                } else {
                    console.warn('Unexpected faculties data structure:', data);
                    setFaculties([]);
                }
            } catch (error) {
                console.error('Error fetching faculties:', error);
                setFaculties([]);
                showNotification('error', t('messages.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchFaculties();
    }, [t, showNotification]);

    useEffect(() => {
        if (type === 'edit' && course) {
            setMaMonHoc(course.ma_mon_hoc);
            setTen(course.ten);
            setTinChi(course.tin_chi);
            setFaculty(course.khoa?.toString() || "");
        } else {
            setMaMonHoc("");
            setTen({ vi: "", en: "" });
            setTinChi(0);
            setFaculty("");
        }
    }, [type, course]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nameData = i18n.language === "en" ? 
        { en: ten.en, vi: (await GoogleTranslateService.translateText(ten.en, 'vi')).translatedText } 
        : { en: (await GoogleTranslateService.translateText(ten.vi, 'en')).translatedText, vi: ten.vi };

        const courseData = {
            ma_mon_hoc: maMonHoc,
            ten: nameData,
            tin_chi: tinChi,
            khoa: faculty || undefined
        };

        try {
            if (type === 'add') {
                const response = await fetch(SERVER_URL + '/api/v1/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || t('messages.error'));
                }

                showNotification('success', t('messages.saveSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
            } else {
                const response = await fetch(SERVER_URL + `/api/v1/courses/${course._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || t('messages.error'));
                }

                showNotification('success', t('messages.saveSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
            }
        } catch (error) {
            if (error instanceof Error) {
                showNotification('error', error.message);
            } else {
                showNotification('error', t('messages.unknownError'));
            }
        }
    };

    function closeDialog() {
        detailDialog.classList.toggle('hidden');
    }

    return (
        <div className="dialog-container hidden">
            <div className="dialog">
                <h1>{type === "edit" ? t('common.edit') : t('common.add')} {t('course.title')}</h1>
                <div className="dialog-content">
                    <form className="dialog-content-form" onSubmit={handleSubmit}>
                        <div className="dialog-content-form-group">
                            <label htmlFor="maMonHoc">{t('course.courseCode')}</label>
                            <input
                                type="text"
                                id="maMonHoc"
                                value={maMonHoc}
                                onChange={(e) => setMaMonHoc(e.target.value)}
                                required
                            />
                        </div>
                        <div className="dialog-content-form-group">
                            <label htmlFor="ten">{t('course.courseName')}</label>
                            <input
                                type="text"
                                id="ten"
                                value={i18n.language === "en" ? ten.en : ten.vi}
                                onChange={(e) => setTen(i18n.language === "en" ? { ...ten, en: e.target.value } : { ...ten, vi: e.target.value })}
                                required
                            />
                        </div>
                        <div className="dialog-content-form-group">
                            <label htmlFor="tinChi">{t('course.credits')}</label>
                            <input
                                type="number"
                                id="tinChi"
                                value={tinChi}
                                onChange={(e) => setTinChi(Number(e.target.value))}
                                min="1"
                                max="10"
                                required
                            />
                        </div>
                        <div className="dialog-content-form-group">
                            <label htmlFor="faculty">{t('faculty.title')}</label>
                            <select
                                id="faculty"
                                value={faculty}
                                onChange={(e) => setFaculty(e.target.value)}
                                required
                                disabled={loading}
                            >
                                <option value="">{loading ? t('common.loading') : t('common.select')}</option>
                                {Array.isArray(faculties) && faculties.map((faculty) => (
                                    <option key={faculty._id.toString()} value={faculty._id.toString()}>
                                        {i18n.language === "en" ? faculty.ten_khoa.en : faculty.ten_khoa.vi}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="dialog-action">
                            <button className="dialog-action-save" type="submit">
                                {type !== 'add' ? t('common.save') : t('common.add')}
                            </button>
                            <button className="dialog-action-cancel" type="button" onClick={closeDialog}>
                                {t('common.cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseDialog;