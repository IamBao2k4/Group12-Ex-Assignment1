import React, { useState } from 'react';

import './programItem.css';

import { Program } from '../models/program';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';

import { SERVER_URL } from '../../../../../global';

interface ProgramItemProps {
    program: Program;
    DetailHandler: (type: string) => void;
    setChosenProgram: (program: Program) => void;
    onDeleteSuccess: () => void;
}

const ProgramItem: React.FC<ProgramItemProps> = ({ program, DetailHandler, setChosenProgram, onDeleteSuccess }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();

    function deleteConfirmHandler() {
        setShowConfirmation(true);
    }

    async function DeleteHandler() {
        try {
            const response = await fetch(SERVER_URL + `/api/v1/programs/${program._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('success', `Program "${program.name}" deleted successfully`);
                setShowConfirmation(false);
                onDeleteSuccess(); // Call the refresh function instead of reloading page
            } else {
                showNotification('error', data.message || 'Failed to delete program');
            }
        } catch (error) {
            showNotification('error', 'Error occurred while deleting program');
            console.error('Error deleting program:', error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title="Delete Confirmation"
                message={`Are you sure you want to delete the program "${program.name}"?`}
                onConfirm={DeleteHandler}
                onCancel={() => setShowConfirmation(false)}
            />
            <div className="program-item row">
                <div className="program-item-info">
                    <div className="program-item-info-name">{program.name}</div>
                    <div className="program-item-info-created-date">{program.created_at?.toString().split("T")[0]}</div>
                    <div className="program-item-info-updated-date">{program.updated_at?.toString().split("T")[0]}</div>
                    <div className="program-item-info-action">
                        <button className="program-item-info-action-edit" onClick={() => { DetailHandler('edit'); setChosenProgram(program); }}><EditIcon /></button>
                        <button className="program-item-info-action-delete" onClick={deleteConfirmHandler}><DeleteIcon /></button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProgramItem;