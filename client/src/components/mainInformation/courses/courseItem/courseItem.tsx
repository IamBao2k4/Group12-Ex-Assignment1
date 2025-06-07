import React, { useState, useEffect } from "react";
import { Course } from "../models/course";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';
import { useTranslation } from 'react-i18next';
import { SERVER_URL } from "../../../../../global";

interface CourseItemProps {
    course: Course;
    DialogHandler: (type: string) => void;
    setChosenSubject: (course: Course) => void;
    onDeleteSuccess: () => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
    course,
    DialogHandler,
    setChosenSubject,
    onDeleteSuccess
}) => {
    const { t, i18n } = useTranslation();
    const [faculty, setFaculty] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchFaculty = async () => {
            if (!course.khoa) {
                setFaculty(t('common.notAssigned', 'Chưa phân công'));
                return;
            }

            try {
                const response = await fetch(SERVER_URL + `/api/v1/faculties/${course.khoa}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                
                if (!text) {
                    console.warn('Empty response from faculty API');
                    setFaculty(t('common.unknown', 'Không xác định'));
                    return;
                }

                const data = JSON.parse(text);
                
                if (data && data.ten_khoa) {
                    setFaculty(i18n.language === "en" ? data.ten_khoa.en : data.ten_khoa.vi);
                } else {
                    console.warn('Faculty data missing ten_khoa field:', data);
                    setFaculty(t('common.unknown', 'Không xác định'));
                }
            } catch (error) {
                console.error("Error fetching faculty:", error);
                setFaculty(t('common.error', 'Lỗi'));
            }
        };

        fetchFaculty();
    }, [course.khoa, t]);

    const handleEdit = () => {
        setChosenSubject(course);
        DialogHandler("edit");
    };

    function deleteConfirmHandler() {
        setShowConfirmation(true);
    }

    async function handleDelete() {
        try {
            const response = await fetch(SERVER_URL + `/api/v1/courses/${course._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('success', t('course.deleteSuccess', { name: course.ten.en }));
                setShowConfirmation(false);
                onDeleteSuccess();
            } else {
                showNotification('error', data.message || t('course.deleteError'));
            }
        } catch (error) {
            showNotification('error', t('course.deleteError'));
            console.error("Error deleting course:", error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title={t('course.deleteConfirmTitle')}
                message={t('course.deleteConfirmMessage', { name: course.ten.en })}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirmation(false)}
            />
            <tr>
                <td>{i18n.language === "en"? course.ten.en : course.ten.vi}</td>
                <td>{course.ma_mon_hoc}</td>
                <td>{course.tin_chi}</td>
                <td>{faculty}</td>
                <td>
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2" 
                        onClick={handleEdit}
                        title={t('common.edit')}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={deleteConfirmHandler}
                        title={t('common.delete')}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </td>
            </tr>
        </>
    );
};

export default CourseItem;