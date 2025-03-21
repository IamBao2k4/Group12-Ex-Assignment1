import React, { useEffect } from 'react';
import './detailDialog.css';

import { StudentStatus } from '../../../../model/student_status';

interface DetailDialogProps {
    type: string;
    studentStatus: StudentStatus;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, studentStatus }) => {
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;

    function setInnerHTML() {
        if (!studentStatus) {
            return <div>Loading...</div>;
        }
        const name = document.getElementById('name') as HTMLInputElement;

        if (!name ) {
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

        if (type === 'add') {
            try {
                const response = await fetch('http://localhost:3001/api/v1/student-statuses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentStatusData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Có lỗi xảy ra');
                }

                alert('Tạo trạng thái sinh viên thành công!');
                detailDialog.classList.toggle('hidden');
                window.location.reload();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert('Lỗi không xác định!');
                }
            }
        } else {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/student-statuses/${studentStatus._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentStatusData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Có lỗi xảy ra');
                }

                alert('Cập nhật trạng thái sinh viên thành công!');
                detailDialog.classList.toggle('hidden');
                window.location.reload();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert('Lỗi không xác định!');
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