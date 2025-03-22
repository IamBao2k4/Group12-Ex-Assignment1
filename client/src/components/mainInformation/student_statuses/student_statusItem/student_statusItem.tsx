import React from 'react';

import './student_statusItem.css';

import { StudentStatus } from '../models/student_status';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface StudentStatusItemProps {
    studentStatus: StudentStatus;
    DetailHandler: (type: string) => void;
    setChosenStudentStatus: (studentStatus: StudentStatus) => void;
}

const StudentStatusItem: React.FC<StudentStatusItemProps> = ({ studentStatus, DetailHandler, setChosenStudentStatus }) => {

    async function DeleteHandler() {
        console.log("Deleting ...");
        await fetch(`http://localhost:3001/api/v1/student-statuses/${studentStatus._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(() => {
            window.location.reload();
        });
    }

    return (
        <div>
            <div className="student-status-item row">
                <div className="student-status-item-info">
                    <div className="student-status-item-info-name">{studentStatus.tinh_trang}</div>
                    <div className="student-status-item-info-created-date">{studentStatus.created_at?.toString().split("T")[0]}</div>
                    <div className="student-status-item-info-updated-date">{studentStatus.updated_at?.toString().split("T")[0]}</div>
                    <div className="student-status-item-info-action">
                        <button className="student-status-item-info-action-edit" onClick={() => { DetailHandler('edit'); setChosenStudentStatus(studentStatus); }}><EditIcon /></button>
                        <button className="student-status-item-info-action-delete" onClick={DeleteHandler}><DeleteIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentStatusItem;