import React, { useEffect } from 'react';
import './detailDialog.css';
import { useTranslation } from 'react-i18next';
import { Faculty } from '../models/faculty';
import { useNotification } from '../../../../components/common/NotificationContext';
import { SERVER_URL } from '../../../../../global';

interface DetailDialogProps {
    type: string;
    faculty: Faculty;
    onSuccess: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, faculty, onSuccess }) => {
    const { t } = useTranslation();
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    const { showNotification } = useNotification();

    function setInnerHTML() {
        if (!faculty) {
            return <div>{t('common.loading')}</div>;
        }
        const name = document.getElementById('name') as HTMLInputElement;
        const code = document.getElementById('code') as HTMLInputElement;

        if (!name || !code ) {
            return;
        }

        if (type === 'edit') {
            name.value = faculty.ten_khoa;
            code.value = faculty.ma_khoa;
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

        const facultyData = {
            ten_khoa: data.get('name') as string,
            ma_khoa: data.get('code') as string,
        };

        if (type === 'add') {
            try {
                const response = await fetch(SERVER_URL + `/api/v1/faculties`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(facultyData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || t('messages.error'));
                }

                showNotification('success', t('faculty.createSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    showNotification('error', error.message);
                } else {
                    showNotification('error', t('messages.unknownError'));
                }
            }
        } else {
            try {
                const response = await fetch(SERVER_URL + `/api/v1/faculties/${faculty._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(facultyData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || t('messages.error'));
                }

                showNotification('success', t('faculty.updateSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    showNotification('error', error.message);
                } else {
                    showNotification('error', t('messages.unknownError'));
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
                <h1>{t('faculty.title')}</h1>
                <div className="dialog-content">
                    <form className="dialog-content-form" onSubmit={handleSubmit}>
                        <div className="dialog-content-form-group">
                            <label htmlFor="name">{t('faculty.facultyName')}</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="dialog-content-form-group">
                            <label htmlFor="code">{t('faculty.facultyCode')}</label>
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