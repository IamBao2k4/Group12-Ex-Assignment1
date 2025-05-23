import React, { useEffect } from 'react';
import './detailDialog.css';

import { Faculty } from '../models/faculty';
import { useNotification } from '../../../../components/common/NotificationContext';
import { FacultiesRoute } from '../route/faculties.route';

interface DetailDialogProps {
  type: string;
  faculty: Faculty;
  onSuccess: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, faculty, onSuccess }) => {
  const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
  const { showNotification } = useNotification();

  function setInnerHTML() {
    if (!faculty) {
      return <div>Loading...</div>;
    }
    const name = document.getElementById('name') as HTMLInputElement;
    const code = document.getElementById('code') as HTMLInputElement;

    if (!name || !code) {
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

    try {
      if (type === 'add') {
        await FacultiesRoute.createFaculty(facultyData);
        showNotification('success', 'Faculty created successfully!');
      } else {
        await FacultiesRoute.updateFaculty(faculty._id.toString(), facultyData);
        showNotification('success', 'Faculty updated successfully!');
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
        <h1>Faculty Details</h1>
        <div className="dialog-content">
          <form className="dialog-content-form" onSubmit={handleSubmit}>
            <div className="dialog-content-form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" />
            </div>
            <div className="dialog-content-form-group">
              <label htmlFor="code">Code</label>
              <input type="text" id="code" name="code" />
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