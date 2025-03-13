import { Student } from "../../../../../model/student"
import './profileDialog.css'
import React, { useEffect } from 'react'

interface StudentItemProps {
    type: string
    student: Student
}

const ProfileDialog: React.FC<StudentItemProps> = ({ type, student }) => {
    const profileDialog = document.querySelector('.profile-dialog-container') as HTMLElement

    function setInnerHTML(){
        if (!student) {
            return <div>Loading...</div>
        }
        const name = document.getElementById('name') as HTMLInputElement
        const id = document.getElementById('id') as HTMLInputElement
        const birthday = document.getElementById('birthday') as HTMLInputElement
        const gender = document.getElementById('gender') as HTMLInputElement
        const faculty = document.getElementById('faculty') as HTMLInputElement
        const course = document.getElementById('course') as HTMLInputElement
        const program = document.getElementById('program') as HTMLInputElement
        const address = document.getElementById('address') as HTMLInputElement
        const email = document.getElementById('email') as HTMLInputElement
        const phone = document.getElementById('phone') as HTMLInputElement
        const status = document.getElementById('status') as HTMLInputElement

        if(!name || !id || !birthday || !gender || !faculty || !course || !program || !address || !email || !phone || !status){
            return
        }

        if (type === 'edit') {
            name.value = student.ho_ten
            id.value = student.ma_so_sinh_vien
            birthday.value = student.ngay_sinh
            gender.value = student.gioi_tinh
            faculty.value = student.khoa
            course.value = student.khoa_hoc
            program.value = student.chuong_trinh
            address.value = student.dia_chi || ''
            email.value = student.email || ''
            phone.value = student.so_dien_thoai || ''
            status.value = student.tinh_trang
        }
        else{
            name.value = ''
            id.value = ''
            birthday.value = ''
            gender.value = ''
            faculty.value = ''
            course.value = ''
            program.value = ''
            address.value = ''
            email.value = ''
            phone.value = ''
            status.value = ''
        }
    }

    useEffect(() => {
        setInnerHTML()
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.currentTarget
        const data = new FormData(form)

        const studentData = {
            ho_ten: data.get('name') as string,
            ma_so_sinh_vien: data.get('id') as string,
            ngay_sinh: data.get('birthday') as string,
            gioi_tinh: data.get('gender') as string,
            khoa: data.get('faculty') as string,
            khoa_hoc: data.get('course') as string,
            chuong_trinh: data.get('program') as string,
            dia_chi: data.get('address') as string,
            email: data.get('email') as string,
            so_dien_thoai: data.get('phone') as string,
            tinh_trang: data.get('status') as string
        }

        if (type === 'add') {
            fetch('http://localhost:3001/api/v1/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            })
        } else {
            fetch(`http://localhost:3001/api/v1/students/${student._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            })
        }

        profileDialog.classList.toggle('hidden')
        window.location.reload()
    }

    function CancelHandler() {
        profileDialog.classList.toggle('hidden')
    }


    return (
        <div className="profile-dialog-container hidden">
            <div className="profile-dialog">
                <h1>Profile</h1>
                <div className="profile-dialog-info">
                    <form className="profile-dialog-info-form" onSubmit={handleSubmit}>
                    <div className="profile-dialog-info-form-group">
                            <label htmlFor="name">Họ tên</label>
                            <input type="text" id="name" name="name" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="id">Mã số sinh viên</label>
                            <input type="text" id="id" name="id" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="birthday">Ngày sinh</label>
                            <input type="text" id="birthday" name="birthday" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="gender">Giới tính</label>
                            <input type="text" id="gender" name="gender" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="faculty">Khoa</label>
                            <input type="text" id="faculty" name="faculty" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="course">Khóa</label>
                            <input type="text" id="course" name="course" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="program">Chương trình</label>
                            <input type="text" id="program" name="program" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <input type="text" id="address" name="address" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input type="text" id="phone" name="phone" />
                        </div>
                        <div className="profile-dialog-info-form-group">
                            <label htmlFor="status">Tình trạng</label>
                            <input type="text" id="status" name="status" />
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