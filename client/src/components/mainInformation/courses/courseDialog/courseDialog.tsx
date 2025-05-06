import React, { useState, useEffect } from 'react';
import './courseDialog.css';
import { Subject } from '../models/course';
import { Faculty } from '../../faculties/models/faculty';
import { useNotification } from '../../../../components/common/NotificationContext';
import { CoursesRoute } from '../route/courses.route';

interface CourseDialogProps {
  type: string;
  subject: Subject;
  onSuccess: () => void;
}

const CourseDialog: React.FC<CourseDialogProps> = ({ type, subject, onSuccess }) => {
  const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
  const { showNotification } = useNotification();
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await CoursesRoute.getAllFaculties();
        setFaculties(response);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    fetchFaculties();
  }, []);

  function setInnerHTML() {
    if (!subject) {
      return <div>Loading...</div>;
    }
    const name = document.getElementById('name') as HTMLInputElement;
    const code = document.getElementById('code') as HTMLInputElement;
    const credits = document.getElementById('credits') as HTMLInputElement;
    const faculty = document.getElementById('faculty') as HTMLSelectElement;

    if (!name || !code || !credits || !faculty) {
      return;
    }

    if (type === 'edit') {
      name.value = subject.ten;
      code.value = subject.ma_mon_hoc;
      credits.value = subject.tin_chi.toString();
      faculty.value = subject.khoa.toString();
    } else {
      name.value = '';
      code.value = '';
      credits.value = '';
      faculty.value = '';
    }
  }

  useEffect(() => {
    setInnerHTML();
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const courseData = {
      ten: data.get('name') as string,
      ma_mon_hoc: data.get('code') as string,
      tin_chi: parseInt(data.get('credits') as string, 10),
      khoa: data.get('faculty') as string,
    };

    try {
      if (type === 'add') {
        await CoursesRoute.createCourse(courseData);
        showNotification('success', 'Course created successfully!');
      } else {
        await CoursesRoute.updateCourse(subject._id.toString(), courseData);
        showNotification('success', 'Course updated successfully!');
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

  if (!faculties || faculties.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dialog-container hidden">
      <div className="dialog">
        <h1>Course Details</h1>
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
            <div className="dialog-content-form-group">
              <label htmlFor="credits">Credits</label>
              <input type="number" id="credits" name="credits" />
            </div>
            <div className="dialog-content-form-group">
              <label htmlFor="faculty">Faculty</label>
              <select id="faculty" name="faculty">
                {faculties.map((faculty) => (
                  <option key={faculty._id.toString()} value={faculty._id.toString()}>
                    {faculty.ten_khoa}
                  </option>
                ))}
              </select>
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

export default CourseDialog;