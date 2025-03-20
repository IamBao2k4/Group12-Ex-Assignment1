import React from 'react';

import './programItem.css';

import { Program } from '../../../../model/program';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProgramItemProps {
    program: Program;
    DetailHandler: (type: string) => void;
    setChosenProgram: (program: Program) => void;
}

const ProgramItem: React.FC<ProgramItemProps> = ({ program, DetailHandler, setChosenProgram }) => {

    async function DeleteHandler() {
        console.log("Deleting ...");
        await fetch(`http://localhost:3001/api/v1/programs/${program._id}`, {
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
            <div className="program-item row">
                <div className="program-item-info">
                    <div className="program-item-info-name">{program.name}</div>
                    <div className="program-item-info-created-date">{program.created_at?.toString().split("T")[0]}</div>
                    <div className="program-item-info-updated-date">{program.updated_at?.toString().split("T")[0]}</div>
                    <div className="program-item-info-action">
                        <button className="program-item-info-action-edit" onClick={() => { DetailHandler('edit'); setChosenProgram(program); }}><EditIcon /></button>
                        <button className="program-item-info-action-delete" onClick={DeleteHandler}><DeleteIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramItem;