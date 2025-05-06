import React from 'react';
import { Program } from '../models/program';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';

interface ProgramItemProps {
  program: Program;
  DetailHandler: (type: string) => void;
  setChosenProgram: (program: Program) => void;
  setShowConfirmation: (show: boolean) => void;
}

const ProgramItem: React.FC<ProgramItemProps> = ({ program, DetailHandler, setChosenProgram, setShowConfirmation }) => {
  function handleDeleteClick() {
    setChosenProgram(program);
    setShowConfirmation(true);
  }

  return (
    <>
      <tr>
        <td>{program.name}</td>
        <td>{program.created_at?.toString().split("T")[0]}</td>
        <td>{program.updated_at?.toString().split("T")[0]}</td>
        <td>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { DetailHandler('edit'); setChosenProgram(program); }}>
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

export default ProgramItem;