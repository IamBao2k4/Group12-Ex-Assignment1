import React, { useState, useEffect } from 'react'
import './studentItem.css'
import { Student } from '../models/student'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface StudentItemProps {
    id: string
    student: Student
    ProfileHandler: (type: string) => void
    setChosenStudent: (student: Student) => void
}

const StudentItem: React.FC<StudentItemProps> = ({ id, student, ProfileHandler, setChosenStudent }) => {
    const [status, setStatus] = useState('')


    function EditBtnHandler() {
        ProfileHandler('edit')
        setChosenStudent(student)
    }

    useEffect(() => {
        fetch(`http://localhost:3001/api/v1/student-statuses/${student.tinh_trang}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            setStatus(data.tinh_trang)
        })
    }, [status])

    async function DeleteStudentHandler() {
        await fetch(`http://localhost:3001/api/v1/students/${student._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(() => {
            window.location.reload()
        })
    }

    return (
        <div className="student-item row" key={id}>
            <div className="student-item-info">
                <div className="student-item-info-name">{student.ho_ten}</div>
                <div className="student-item-info-id">{student.ma_so_sinh_vien}</div>
                <div className="student-item-info-birthday">{student.ngay_sinh}</div>
                <div className="student-item-info-status">{status}</div>
                <div className="student-item-action">
                    <button className="student-item-action-edit" onClick={EditBtnHandler}><EditIcon /></button>
                    <button className="student-item-action-delete" onClick={DeleteStudentHandler}><DeleteIcon /></button>
                </div>
            </div>
        </div>
    )
}

export default StudentItem