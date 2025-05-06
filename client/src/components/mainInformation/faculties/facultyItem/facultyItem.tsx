import React from 'react';
import './facultyItem.css';
import { Faculty } from '../models/faculty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';

interface FacultyItemProps {
  faculty: Faculty;
  DetailHandler: (type: string) => void;
  setChosenFaculty: (faculty: Faculty) => void;
  setShowConfirmation: (show: boolean) => void;
}

const FacultyItem: React.FC<FacultyItemProps> = ({ faculty, DetailHandler, setChosenFaculty, setShowConfirmation }) => {
  function handleDeleteClick() {
    setChosenFaculty(faculty);
    setShowConfirmation(true);
  }

  return (
    <>
      <tr>
        <td>{faculty.ma_khoa}</td>
        <td>{faculty.ten_khoa}</td>
        <td>{faculty.created_at?.toString().split("T")[0]}</td>
        <td>{faculty.updated_at?.toString().split("T")[0]}</td>
        <td>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { DetailHandler('edit'); setChosenFaculty(faculty); }}>
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

export default FacultyItem;