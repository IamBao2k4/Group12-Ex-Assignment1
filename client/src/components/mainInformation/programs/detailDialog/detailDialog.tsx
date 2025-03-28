import React, { useEffect } from 'react';
import './detailDialog.css';

import { SERVER_URL } from '../../../../../global';
import { useNotification } from '../../../../components/common/NotificationContext';

import { Program } from '../models/program';

interface DetailDialogProps {
    type: string;
    program: Program;
    onSuccess: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, program, onSuccess }) => {
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    const { showNotification } = useNotification();

    function setInnerHTML() {
        if (!program) {
            return <div>Loading...</div>;
        }
        const name = document.getElementById('name') as HTMLInputElement;

        if (!name) {
            return;
        }

        if (type === 'edit') {
            name.value = program.name;
        } else {
            name.value = '';
        }
    }

    useEffect(() => {
        setInnerHTML();
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData(form);

        const programData = {
            name: data.get('name') as string,
        };

        if (type === 'add') {
            try {
                const response = await fetch(SERVER_URL + `/api/v1/programs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(programData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Có lỗi xảy ra');
                }

                showNotification('success', 'Program created successfully!');
                detailDialog.classList.toggle('hidden');
                onSuccess();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    showNotification('error', error.message);
                } else {
                    showNotification('error', 'Unknown error occurred!');
                }
            }
        } else {
            try {
                const response = await fetch(SERVER_URL + `/api/v1/programs/${program._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(programData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Có lỗi xảy ra');
                }

                showNotification('success', 'Program updated successfully!');
                detailDialog.classList.toggle('hidden');
                onSuccess();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    showNotification('error', error.message);
                } else {
                    showNotification('error', 'Unknown error occurred!');
                }
            }
        }
    };

    function CancelHandler() {
        detailDialog.classList.toggle('hidden');
    }

    return (
        <div className="dialog-container hidden">
            <div className="dialog">
                <h1>Program Details</h1>
                <div className="dialog-content">
                    <form className="dialog-content-form" onSubmit={handleSubmit}>
                        <div className="dialog-content-form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" />
                        </div>
                        <div className="dialog-action">
                            <button className="dialog-action-save" type="submit">
                                {type !== 'add' ? 'Save' : 'Add'}
                            </button>
                            <button className="dialog-action-cancel" type="button" onClick={CancelHandler}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DetailDialog;