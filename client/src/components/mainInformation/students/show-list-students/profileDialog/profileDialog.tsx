import { Student } from "../../../../../model/student"
import './profileDialog.css'
import React from 'react'

interface StudentItemProps {
    type: string
    student: Student
}

const ProfileDialog: React.FC<StudentItemProps> = ({ type, student }) => {
    const profileDialog = document.querySelector('.profile-dialog-container') as HTMLElement

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        profileDialog.classList.toggle('hidden')
    }

    function CancelHandler() {
        profileDialog.classList.toggle('hidden')
    }

    if (!student) {
        return <div>Loading...</div>
    }
    return (
        <div className="profile-dialog-container hidden">
            <div className="profile-dialog">
                <h1>Profile</h1>
                <div className="profile-dialog-info">
                    <form className="profile-dialog-info-form" onSubmit={handleSubmit}>
                    <div className="profile-dialog-info-form-group">
                            <label htmlFor="name">Họ tên</label>
                            <input type="text" id="name" name="name" value={type !== 'add' ? student.ho_ten : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="id">Mã số sinh viên</label>
                            <input type="text" id="id" name="id" value={type !== 'add' ? student.ma_so_sinh_vien : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="birthday">Ngày sinh</label>
                            <input type="text" id="birthday" name="birthday" value={type !== 'add' ? student.ngay_sinh : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="gender">Giới tính</label>
                            <input type="text" id="gender" name="gender" value={type !== 'add' ? student.gioi_tinh : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="faculty">Khoa</label>
                            <input type="text" id="faculty" name="faculty" value={type !== 'add' ? student.khoa : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="course">Khóa</label>
                            <input type="text" id="course" name="course" value={type !== 'add' ? student.khoa_hoc : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="program">Chương trình</label>
                            <input type="text" id="program" name="program" value={type !== 'add' ? student.chuong_trinh : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <input type="text" id="address" name="address" value={type !== 'add' ? student.dia_chi : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" value={type !== 'add' ? student.email : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input type="text" id="phone" name="phone" value={type !== 'add' ? student.so_dien_thoai : ""} />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="status">Tình trạng</label>
                            <input type="text" id="status" name="status" value={type !== 'add' ? student.tinh_trang : ""} />
                        </div>
                        <div className="profile-dialog-action">
                            <button className="profile-dialog-action-save" type="submit">{type !== 'add' ? 'Save' : "Add"}</button>
                            <button className="profile-dialog-action-cancel" type="button" onClick={CancelHandler}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileDialog