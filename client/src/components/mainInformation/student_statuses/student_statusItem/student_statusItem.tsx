import React, { useState } from 'react';
import './student_statusItem.css';
import { StudentStatus } from '../models/student_status';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';
import { SERVER_URL } from "../../../../../global";

interface StudentStatusItemProps {
    studentStatus: StudentStatus;
    DetailHandler: (type: string) => void;
    setChosenStudentStatus: (studentStatus: StudentStatus) => void;
    onDeleteSuccess: () => void;
}

const StudentStatusItem: React.FC<StudentStatusItemProps> = ({ studentStatus, DetailHandler, setChosenStudentStatus, onDeleteSuccess }) => {
    const { i18n } = useTranslation();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();
    const { t } = useTranslation();

    function deleteConfirmHandler() {
        setShowConfirmation(true);
    }

    async function DeleteHandler() {
        try {
            const response = await fetch(SERVER_URL + `/api/v1/student-statuses/${studentStatus._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('success', t('studentStatus.deleteSuccess', { name: studentStatus.tinh_trang }));
                setShowConfirmation(false);
                onDeleteSuccess();
            } else {
                showNotification('error', data.message || t('studentStatus.deleteError'));
            }
        } catch (error) {
            showNotification('error', t('studentStatus.deleteError'));
            console.error('Error deleting student status:', error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title={t('studentStatus.deleteConfirmTitle')}
                message={t('studentStatus.deleteConfirmMessage', { name: studentStatus.tinh_trang })}
                onConfirm={DeleteHandler}
                onCancel={() => setShowConfirmation(false)}
            />
            <tr>
                <td>{i18n.language === "en" ? studentStatus.tinh_trang.en : studentStatus.tinh_trang.vi}</td>
                <td>{studentStatus.created_at?.toString().split("T")[0]}</td>
                <td>{studentStatus.updated_at?.toString().split("T")[0]}</td>
                <td>
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2" 
                        onClick={() => { DetailHandler('edit'); setChosenStudentStatus(studentStatus); }}
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

export default StudentStatusItem;