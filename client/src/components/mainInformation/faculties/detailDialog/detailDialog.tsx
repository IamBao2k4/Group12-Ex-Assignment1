import React, { useEffect } from 'react';
import './detailDialog.css';
import { useTranslation } from 'react-i18next';
import { Faculty } from '../models/faculty';
import { useNotification } from '../../../common/NotificationContext';
import { GoogleTranslateService } from '../../../../middleware/gg-trans';
import { FacultiesRoute } from '../route/faculties.route';

interface DetailDialogProps {
    type: string;
    faculty: Faculty;
    onSuccess: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, faculty, onSuccess }) => {
    const { t, i18n } = useTranslation();
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    const { showNotification } = useNotification();

    function setInnerHTML() {
        if (!faculty) {
            return <div>{t('common.loading')}</div>;
        }
        const name = document.getElementById('name') as HTMLInputElement;
        const code = document.getElementById('code') as HTMLInputElement;

        if (!name || !code) {
            return;
        }

        if (type === 'edit') {
            name.value = i18n.language === 'en' ? faculty.ten_khoa.en : faculty.ten_khoa.vi;
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

        const name = data.get('name') as string;

        const facultyData = {
            ten_khoa: i18n.language === 'en' ? 
                { en: name, vi: (await GoogleTranslateService.translateText(name, 'vi')).translatedText } : 
                { en: (await GoogleTranslateService.translateText(name, 'en')).translatedText, vi: name },
            ma_khoa: data.get('code') as string,
        };

        try {
            if (type === 'add') {
                await FacultiesRoute.createFaculty(facultyData);
                showNotification('success', t('faculty.createSuccess'));
                detailDialog.classList.toggle('hidden');
                onSuccess();
            } else {
                await FacultiesRoute.updateFaculty(faculty._id.toString(), facultyData);
                showNotification('success', t('faculty.updateSuccess'));
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

    function closeDialog() {
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
                            <button className="dialog-action-cancel" type="button" onClick={closeDialog}>
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