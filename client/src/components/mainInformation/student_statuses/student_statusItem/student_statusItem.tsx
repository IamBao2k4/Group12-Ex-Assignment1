import React, { useState } from 'react';

import './student_statusItem.css';

import { StudentStatus } from '../models/student_status';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';

import { SERVER_URL } from '../../../../../global';

interface StudentStatusItemProps {
    studentStatus: StudentStatus;
    DetailHandler: (type: string) => void;
    setChosenStudentStatus: (studentStatus: StudentStatus) => void;
    onDeleteSuccess: () => void;
}

const StudentStatusItem: React.FC<StudentStatusItemProps> = ({ studentStatus, DetailHandler, setChosenStudentStatus, onDeleteSuccess }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();

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
                showNotification('success', `Student status "${studentStatus.tinh_trang}" deleted successfully`);
                setShowConfirmation(false);
                onDeleteSuccess(); // Call the refresh function instead of reloading page
            } else {
                showNotification('error', data.message || 'Failed to delete student status');
            }
        } catch (error) {
            showNotification('error', 'Error occurred while deleting student status');
            console.error('Error deleting student status:', error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title="Delete Confirmation"
                message={`Are you sure you want to delete the student status "${studentStatus.tinh_trang}"?`}
                onConfirm={DeleteHandler}
                onCancel={() => setShowConfirmation(false)}
            />
            <div className="student-status-item row">
                <div className="student-status-item-info">
                    <div className="student-status-item-info-name">{studentStatus.tinh_trang}</div>
                    <div className="student-status-item-info-created-date">{studentStatus.created_at?.toString().split("T")[0]}</div>
                    <div className="student-status-item-info-updated-date">{studentStatus.updated_at?.toString().split("T")[0]}</div>
                    <div className="student-status-item-info-action">
                        <button className="student-status-item-info-action-edit" onClick={() => { DetailHandler('edit'); setChosenStudentStatus(studentStatus); }}><EditIcon /></button>
                        <button className="student-status-item-info-action-delete" onClick={deleteConfirmHandler}><DeleteIcon /></button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentStatusItem;