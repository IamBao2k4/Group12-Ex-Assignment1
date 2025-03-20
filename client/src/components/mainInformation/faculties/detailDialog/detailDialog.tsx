import React, { useEffect } from 'react';
import './detailDialog.css';

import { Faculty } from '../../../../model/faculty';

interface DetailDialogProps {
    type: string;
    faculty: Faculty;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ type, faculty }) => {
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;

    function setInnerHTML() {
        if (!faculty) {
            return <div>Loading...</div>;
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
                const response = await fetch('http://localhost:3001/api/v1/faculties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(facultyData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Có lỗi xảy ra');
                }

                alert('Tạo khoa thành công!');
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
                const response = await fetch(`http://localhost:3001/api/v1/faculties/${faculty._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(facultyData),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Có lỗi xảy ra');
                }

                alert('Cập nhật khoa thành công!');
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