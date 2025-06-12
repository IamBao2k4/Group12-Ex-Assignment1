import React, { useEffect } from 'react';
import './detailDialog.css';

import { useNotification } from '../../../../components/common/NotificationContext';
import { StudentStatusesRoute } from '../route/student_statuses.route';
import { StudentStatus } from '../models/student_status';
import { useTranslation } from 'react-i18next';
import { GoogleTranslateService } from '../../../../middleware/gg-trans';

interface DetailDialogProps {
  type: string;
  studentStatus: StudentStatus;
  onSuccess: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, studentStatus, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
  const { showNotification } = useNotification();

  function setInnerHTML() {
    if (!studentStatus) {
      return <div>Loading...</div>;
    }
    const name = document.getElementById('name') as HTMLInputElement;

    if (!name) {
      return;
    }

    if (type === 'edit') {
      name.value = i18n.language === 'en' ? studentStatus.tinh_trang.en : studentStatus.tinh_trang.vi;
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

    const status = i18n.language === 'en'
      ? { en: data.get('name') as string, vi: (await GoogleTranslateService.translateText(data.get('name') as string, 'vi')).translatedText }
      : { en: (await GoogleTranslateService.translateText(data.get('name') as string, 'en')).translatedText, vi: data.get('name') as string };

    const studentStatusData = {
      tinh_trang: status,
    };

    try {
      if (type === 'add') {
        await StudentStatusesRoute.createStudentStatus(studentStatusData);
        showNotification('success', t('studentStatus.dialog.createSuccess'));
      } else {
        await StudentStatusesRoute.updateStudentStatus(studentStatus._id.toString(), studentStatusData);
        showNotification('success', t('studentStatus.dialog.updateSuccess'));
      }

      detailDialog.classList.toggle('hidden');
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        showNotification('error', error.message);
      } else {
        showNotification('error', 'Unknown error occurred!');
      }
    }
  };

  function CancelHandler() {
    detailDialog.classList.toggle('hidden');
  }

  return (
    <div className="dialog-container hidden">
      <div className="dialog">
        <h1>{t('studentStatus.dialog.title')}</h1>
        <div className="dialog-content">
          <form className="dialog-content-form" onSubmit={handleSubmit}>
            <div className="dialog-content-form-group">
              <label htmlFor="name">{t('studentStatus.dialog.name')}</label>
              <input type="text" id="name" name="name" />
            </div>
            <div className="dialog-action">
              <button className="dialog-action-save" type="submit">
                {type !== 'add' ? t('studentStatus.dialog.save') : t('studentStatus.dialog.add')}
              </button>
              <button className="dialog-action-cancel" type="button" onClick={CancelHandler}>
                {t('studentStatus.dialog.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetailDialog;