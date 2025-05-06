import React from 'react';
import './student_statusItem.css';
import { StudentStatus } from '../models/student_status';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';

interface StudentStatusItemProps {
  studentStatus: StudentStatus;
  DetailHandler: (type: string) => void;
  setChosenStudentStatus: (studentStatus: StudentStatus) => void;
  setShowConfirmation: (show: boolean) => void;
}

const StudentStatusItem: React.FC<StudentStatusItemProps> = ({ studentStatus, DetailHandler, setChosenStudentStatus, setShowConfirmation }) => {
  function handleDeleteClick() {
    setChosenStudentStatus(studentStatus);
    setShowConfirmation(true);
  }
  
  return (
    <>
      <tr>
        <td>{studentStatus.tinh_trang}</td>
        <td>{studentStatus.created_at?.toString().split("T")[0]}</td>
        <td>{studentStatus.updated_at?.toString().split("T")[0]}</td>
        <td>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { DetailHandler('edit'); setChosenStudentStatus(studentStatus); }}>
            <EditIcon fontSize="small" />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" />
          </Button>
        </td>
      </tr>
    </>
  );
};

export default StudentStatusItem;