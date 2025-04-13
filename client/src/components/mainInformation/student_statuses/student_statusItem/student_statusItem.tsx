import React, { useState } from 'react';
import './student_statusItem.css';
import { StudentStatus } from '../models/student_status';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';
import { Button } from 'react-bootstrap';

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
            <tr>
                <td>{studentStatus.tinh_trang}</td>
                <td>{studentStatus.created_at?.toString().split("T")[0]}</td>
                <td>{studentStatus.updated_at?.toString().split("T")[0]}</td>
                <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { DetailHandler('edit'); setChosenStudentStatus(studentStatus); }}>
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={deleteConfirmHandler}>
                        <DeleteIcon fontSize="small" />
                    </Button>
                </td>
            </tr>
        </>
    );
};

export default StudentStatusItem;