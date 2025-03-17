import React, { useEffect, useState } from 'react';
import './students.css';

import StudentItem from './studentItem/studentItem';
import ProfileDialog from './profileDialog/profileDialog';

import { Student } from '../../../../model/student';
import AddIcon from '@mui/icons-material/Add';

interface StudentProps {
    searchString: string
}

const Students: React.FC<StudentProps> = ({ searchString }) => {
    const [students, setStudents] = useState<Student[]>([])
    const [profileType, setProfileType] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [chosenStudent, setChosenStudent] = useState<Student | null>(null)

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/students?searchString=${searchString}&page=${currentPage}`)
                const data = await response.json()
                setStudents(data.data)
                setTotalPages(data.meta.total)
            } catch (error) {
                console.error('Error fetching students:', error)
            }
        }
    
        fetchStudents()
    }, [searchString, currentPage])

    function ProfileHandler(type: string) {
        const profileDialog = document.querySelector('.profile-dialog-container') as HTMLElement
        profileDialog.classList.toggle('hidden')
        setProfileType(type)
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    function handleNextPage() {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="students">
            <ProfileDialog student={chosenStudent ? chosenStudent : students[0]} type={profileType} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Students</h1>
                <button className="add-student" onClick={() => ProfileHandler('add')}><AddIcon /></button>
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
                    <StudentItem key={student._id.toString()} id={student._id.toString()} student={student} ProfileHandler={ProfileHandler} setChosenStudent={setChosenStudent} />
                ))}
            </div>

            <div className="students-pagination">
                <button className='students-pagination-btn prev' onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <button className='students-pagination-btn next' onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    )
}

export default Students