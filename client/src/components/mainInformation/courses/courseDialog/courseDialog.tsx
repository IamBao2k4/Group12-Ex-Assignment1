import React, { useState, useEffect } from "react";
import "./courseDialog.css";
import { SERVER_URL } from "../../../../../global";
import { useTranslation } from 'react-i18next';
import { Subject } from "../models/course";
import { Faculty } from "../../faculties/models/faculty";
import { useNotification } from '../../../common/NotificationContext';
import mongoose from "mongoose";

interface CourseDialogProps {
    type: string;
    subject: Subject;
    onSuccess: () => void;
}

const CourseDialog: React.FC<CourseDialogProps> = ({ subject, type, onSuccess }) => {
    const { t } = useTranslation();
    const [maMonHoc, setMaMonHoc] = useState(subject?.ma_mon_hoc || "");
    const [ten, setTen] = useState(subject?.ten || "");
    const [tinChi, setTinChi] = useState(subject?.tin_chi || 0);
    const [faculty, setFaculty] = useState<string>(subject?.khoa?.toString() || "");
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const { showNotification } = useNotification();
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch(SERVER_URL + '/api/v1/faculties');
                const data = await response.json();
                setFaculties(data);
            } catch (error) {
                console.error('Error fetching faculties:', error);
            }
        };

        fetchFaculties();
    }, []);

    useEffect(() => {
        if (type === 'edit' && subject) {
            setMaMonHoc(subject.ma_mon_hoc);
            setTen(subject.ten);
            setTinChi(subject.tin_chi);
            setFaculty(subject.khoa?.toString() || "");
        } else {
            setMaMonHoc("");
            setTen("");
            setTinChi(0);
            setFaculty("");
        }
    }, [type, subject]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const courseData = {
            ma_mon_hoc: maMonHoc,
            ten: ten,
            tin_chi: tinChi,
            khoa: faculty ? new mongoose.Types.ObjectId(faculty) : undefined
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

                showNotification('success', t('course.createSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
            } else {
                const response = await fetch(SERVER_URL + `/api/v1/courses/${subject._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || t('messages.error'));
                }

                showNotification('success', t('course.updateSuccess'));
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
                                value={ten}
                                onChange={(e) => setTen(e.target.value)}
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
                            >
                                <option value="">{t('common.select')}</option>
                                {faculties.map((faculty) => (
                                    <option key={faculty._id.toString()} value={faculty._id.toString()}>
                                        {faculty.ten_khoa}
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