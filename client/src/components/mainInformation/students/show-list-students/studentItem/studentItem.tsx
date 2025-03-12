import React from 'react'
import './studentItem.css'
import { Student } from '../../../../../model/student'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import mongoose from 'mongoose'

interface StudentItemProps {
    key: string
    student: Student
    ProfileHandler: (type: string) => void
}

const StudentItem: React.FC<StudentItemProps> = ({ key, student, ProfileHandler }) => {

    function EditBtnHandler() {
        ProfileHandler('edit')
    }

    return (
        <div className="student-item row" key={key}>
            <div className="student-item-info">
                <div className="student-item-info-name">{student.ho_ten}</div>
                <div className="student-item-info-id">{student.ma_so_sinh_vien}</div>
                <div className="student-item-info-birthday">{student.ngay_sinh}</div>
                <div className="student-item-info-status">{student.tinh_trang}</div>
                <div className="student-item-action">
                    <button className="student-item-action-edit" onClick={EditBtnHandler}><EditIcon /></button>
                    <button className="student-item-action-delete"><DeleteIcon /></button>
                </div>
            </div>
        </div>
    )
}

export default StudentItem