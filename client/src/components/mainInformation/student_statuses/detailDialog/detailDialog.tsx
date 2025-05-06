import React, { useEffect } from 'react';
import './detailDialog.css';

import { useNotification } from '../../../../components/common/NotificationContext';
import { StudentStatusesRoute } from '../route/student_statuses.route';
import { StudentStatus } from '../models/student_status';

interface DetailDialogProps {
  type: string;
  studentStatus: StudentStatus;
  onSuccess: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, studentStatus, onSuccess }) => {
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
      name.value = studentStatus.tinh_trang;
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

    const studentStatusData = {
      tinh_trang: data.get('name') as string,
    };

    try {
      if (type === 'add') {
        await StudentStatusesRoute.createStudentStatus(studentStatusData);
        showNotification('success', 'Student status created successfully!');
      } else {
        await StudentStatusesRoute.updateStudentStatus(studentStatus._id.toString(), studentStatusData);
        showNotification('success', 'Student status updated successfully!');
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
        <h1>Student Status Details</h1>
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