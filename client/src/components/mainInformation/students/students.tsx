import React, { useEffect, useState, useCallback } from 'react';
import './students.css';

import StudentItem from './studentItem/studentItem';
import ProfileDialog from './profileDialog/profileDialog';

import { Student } from './models/student';
import { Faculty } from '../faculties/models/faculty';
import AddIcon from '@mui/icons-material/Add';

import { SERVER_URL } from '../../../../global';

interface StudentProps {
    searchString: string
}

const Students: React.FC<StudentProps> = ({ searchString }) => {
    const [students, setStudents] = useState<Student[]>([])
    const [profileType, setProfileType] = useState('add')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [chosenStudent, setChosenStudent] = useState<Student | null>(null)
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [faculty, setFaculty] = useState('')

    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/students?searchString=${searchString}&faculty=${faculty}&page=${currentPage}`)
            const data = await response.json()
            setStudents(data.data)
            setTotalPages(data.meta.total)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }, [searchString, faculty, currentPage]);

    const fetchFaculty = useCallback(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/faculties/all`)
            const data = await response.json()
            setFaculties(data)
        } catch (error) {
            console.error('Error fetching faculty:', error)
        }
    }, []);

    useEffect(() => {
        fetchFaculty()
        fetchStudents()
    }, [fetchFaculty, fetchStudents])

    function Filter(event: React.ChangeEvent<HTMLSelectElement>) {
        setFaculty(event.target.value)
    }

    function ProfileHandler(type: string) {
        setProfileType(type);
        const profileDialog = document.querySelector('.profile-dialog-container') as HTMLElement
        profileDialog.classList.toggle('hidden')
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

    if(!students) {
        return <div>Loading...</div>
    }

    return (
        <div className="students">
            <ProfileDialog 
                student={chosenStudent ?? students[0]} 
                type={profileType} 
                onSuccess={fetchStudents}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Students</h1>
                <button className="add-student" onClick={() => ProfileHandler('add')}><AddIcon /></button>
            </div>

            <select className="students-faculty" name="faculty" id="faculty" onChange={Filter}>
                <option value="" defaultChecked>All</option>
                {faculties.map((faculty) => (
                    <option key={faculty._id.toString()} value={faculty._id.toString()}>{faculty.ten_khoa}</option>
                ))}
            </select>

            <div className="students-list">
                <div className="students-list-header row">
                    <div className="students-list-header-name">Họ tên</div>
                    <div className="students-list-header-id">Mã số sinh viên</div>
                    <div className="students-list-header-birthday">Ngày sinh</div>
                    <div className="students-list-header-status">Tình trạng</div>
                    <div className="students-list-header-action"></div>
                </div>

                <div className="list-students">
                    {students.map((student) => (
                        <StudentItem 
                            key={student._id.toString()} 
                            id={student._id.toString()} 
                            student={student} 
                            ProfileHandler={ProfileHandler} 
                            setChosenStudent={setChosenStudent}
                            onDeleteSuccess={fetchStudents}
                        />
                    ))}
                </div>
            </div>

            <div className="students-pagination">
                <button className='students-pagination-btn prev' onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <button className='students-pagination-btn next' onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    )
}

export default Students;