import React, { useEffect } from 'react';
import './detailDialog.css';
import { useTranslation } from 'react-i18next';
import { Program } from '../models/program';
import { useNotification } from '../../../../components/common/NotificationContext';
import { SERVER_URL } from "../../../../../global";

interface DetailDialogProps {
    type: string;
    program: Program;
    onSuccess: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, program, onSuccess }) => {
    const { t } = useTranslation();
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    const { showNotification } = useNotification();

    function setInnerHTML() {
        if (!program) {
            return <div>{t('common.loading')}</div>;
        }
        const name = document.getElementById('name') as HTMLInputElement;
        const code = document.getElementById('code') as HTMLInputElement;

        if (!name || !code) {
            return;
        }

        if (type === 'edit') {
            name.value = program.name;
            code.value = program.ma;
        } else {
            name.value = '';
            code.value = '';
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
            ma: data.get('code') as string,
        };

        try {
        if (type === 'add') {
                const response = await fetch(SERVER_URL + `/api/v1/programs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(programData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || t('messages.error'));
                }

                showNotification('success', t('program.createSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
        } else {
                const response = await fetch(SERVER_URL + `/api/v1/programs/${program._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(programData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || t('messages.error'));
                }

                showNotification('success', t('program.updateSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
            }
            } catch (error) {
                if (error instanceof Error) {
                    showNotification('error', error.message);
                } else {
                showNotification('error', t('messages.unknownError'));
            }
        }
    };

    function CancelHandler() {
        detailDialog.classList.toggle('hidden');
    }

    return (
        <div className="dialog-container hidden">
            <div className="dialog">
                <h1>{t('program.details')}</h1>
                <div className="dialog-content">
                    <form className="dialog-content-form" onSubmit={handleSubmit}>
                        <div className="dialog-content-form-group">
                            <label htmlFor="name">{t('program.programName')}</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="dialog-content-form-group">
                            <label htmlFor="code">{t('program.programCode')}</label>
                            <input type="text" id="code" name="code" required />
                        </div>
                        <div className="dialog-action">
                            <button className="dialog-action-save" type="submit">
                                {type !== 'add' ? t('common.save') : t('common.add')}
                            </button>
                            <button className="dialog-action-cancel" type="button" onClick={CancelHandler}>
                                {t('common.cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DetailDialog;