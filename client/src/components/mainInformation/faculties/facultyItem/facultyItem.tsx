import React, { useState } from 'react';
import './facultyItem.css';
import { Faculty } from '../models/faculty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SERVER_URL } from '../../../../../global';

interface FacultyItemProps {
    faculty: Faculty;
    DetailHandler: (type: string) => void;
    setChosenFaculty: (faculty: Faculty) => void;
    onDeleteSuccess: () => void;
}

const FacultyItem: React.FC<FacultyItemProps> = ({ faculty, DetailHandler, setChosenFaculty, onDeleteSuccess }) => {
    const { t, i18n } = useTranslation();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();

    function deleteConfirmHandler() {
        setShowConfirmation(true);
    }

    async function DeleteHandler() {
        try {
            const response = await fetch(SERVER_URL + `/api/v1/faculties/${faculty._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('success', t('faculty.deleteSuccess', { name: faculty.ten_khoa }));
                setShowConfirmation(false);
                onDeleteSuccess();
            } else {
                showNotification('error', data.message || t('faculty.deleteError'));
            }
        } catch (error) {
            showNotification('error', t('faculty.deleteError'));
            console.error('Error deleting faculty:', error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title={t('faculty.deleteConfirmTitle')}
                message={t('faculty.deleteConfirmMessage', { name: faculty.ten_khoa })}
                onConfirm={DeleteHandler}
                onCancel={() => setShowConfirmation(false)}
            />
            <tr>
                <td>{faculty.ma_khoa}</td>
                <td>{ i18n.language === "en"? faculty.ten_khoa.en : faculty.ten_khoa.vi }</td>
                <td>{faculty.created_at?.toString().split("T")[0]}</td>
                <td>{faculty.updated_at?.toString().split("T")[0]}</td>
                <td>
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2" 
                        onClick={() => { DetailHandler('edit'); setChosenFaculty(faculty); }}
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

export default FacultyItem;