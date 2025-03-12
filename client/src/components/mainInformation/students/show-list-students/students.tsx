import React, { useEffect, useState } from 'react';
import './students.css';

import StudentItem from './studentItem/studentItem';
import ProfileDialog from './profileDialog/profileDialog';

import { Student } from '../../../../model/student';
import AddIcon from '@mui/icons-material/Add';

const Students: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([])
    const [profileType, setProfileType] = useState('')

    useEffect(() => {
        async function fetchStudents() {
            const response = await fetch('http://localhost:3001/api/v1/students')
            const data = await response.json()
            setStudents(data.data)
        }

        fetchStudents()
    }, [])

    function ProfileHandler(type: string) {
        const profileDialog = document.querySelector('.profile-dialog-container') as HTMLElement
        profileDialog.classList.toggle('hidden')
        setProfileType(type)
    }

    return (
        <div className="students">
            <ProfileDialog  student={students[0]} type={profileType}/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h1>Students</h1>
                <button className="add-student" onClick={() => ProfileHandler('add')}><AddIcon/></button>
            </div>
            
            <div className="students-list">
            <div className="students-list-header row"> 
                <div className="students-list-header-name">Họ tên</div>
                <div className="students-list-header-id">Mã số sinh viên</div>
                <div className="students-list-header-birthday">Ngày sinh</div>
                <div className="students-list-header-status">Tình trạng</div>
                <div className="students-list-header-action"></div>
            </div>
                {students.map((student) => (
                    <StudentItem key={student.ma_so_sinh_vien} student={student} ProfileHandler={ProfileHandler}/>
                ))}
            </div>
        </div>
    )
}

export default Students