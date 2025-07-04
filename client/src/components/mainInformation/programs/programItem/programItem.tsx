import React, { useState } from 'react';
import { Program } from '../models/program';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';
import { SERVER_URL } from "../../../../../global";

interface ProgramItemProps {
    program: Program;
    DetailHandler: (type: string) => void;
    setChosenProgram: (program: Program) => void;
    onDeleteSuccess: () => void;
}

const ProgramItem: React.FC<ProgramItemProps> = ({ program, DetailHandler, setChosenProgram, onDeleteSuccess }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();
    const { t, i18n } = useTranslation();

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
                showNotification('success', t('program.deleteSuccess', { name: program.name }));
                setShowConfirmation(false);
                onDeleteSuccess();
            } else {
                showNotification('error', data.message || t('program.deleteError'));
            }
        } catch (error) {
            showNotification('error', t('program.deleteError'));
            console.error('Error deleting program:', error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title={t('program.deleteConfirmTitle')}
                message={t('program.deleteConfirmMessage', { name: i18n.language === "en"? program.name.en : program.name.vi })}
                onConfirm={DeleteHandler}
                onCancel={() => setShowConfirmation(false)}
            />
            <tr>
                <td>{i18n.language === "en"? program.name.en : program.name.vi}</td>
                <td>{program.created_at?.toString().split("T")[0]}</td>
                <td>{program.updated_at?.toString().split("T")[0]}</td>
                <td>
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2" 
                        onClick={() => { DetailHandler('edit'); setChosenProgram(program); }}
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

export default ProgramItem;