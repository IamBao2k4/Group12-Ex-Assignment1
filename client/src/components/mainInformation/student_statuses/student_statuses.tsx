import { useEffect, useState, useCallback } from "react";

import { StudentStatus } from "./models/student_status";
import Header from "../header/header";
import './student_statuses.css';

import StudentStatusItem from "./student_statusItem/student_statusItem";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';

import { SERVER_URL } from '../../../../global';

const StudentStatuses = () => {
    const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [type, setType] = useState('');
    const [chosenStudentStatus, setChosenStudentStatus] = useState<StudentStatus | null>(null);
    const [search, setSearch] = useState('');

    const fetchStudentStatuses = useCallback(async () => {
        try {
            const response = await fetch(SERVER_URL + `/api/v1/student-statuses?page=${currentPage}&searchString=${search}`,);
            const data = await response.json();
            setStudentStatuses(data.data);
            setTotalPages(data.meta.total);
        } catch (error) {
            console.error('Error fetching student statuses:', error);
        }
    }, [search, currentPage]);

    useEffect(() => {
        fetchStudentStatuses();
    }, [fetchStudentStatuses]);

    function DetailHandler(type: string) {
        const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
        setType(type);
        detailDialog.classList.toggle('hidden');
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    function handleNextPage() {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <div className="student-statuses">
            <DetailDialog 
                type={type} 
                studentStatus={chosenStudentStatus ?? studentStatuses[0]} 
                onSuccess={fetchStudentStatuses}
            />
            <Header searchHandler={setSearch} />
            <div className="student-statuses-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h1>Student Statuses</h1>
                    <button className="add-student-status" onClick={() => DetailHandler('add')}><AddIcon /></button>
                </div>

                <div className="student-statuses-list">
                    <div className="student-statuses-list-header row">
                        <div className="student-statuses-list-header-id">Tình trạng</div>
                        <div className="student-statuses-list-header-birthday">Ngày thêm</div>
                        <div className="student-statuses-list-header-status">Ngày chỉnh sửa</div>
                        <div className="student-statuses-list-header-action"></div>
                    </div>
                    {studentStatuses.map((studentStatus) => (
                        <StudentStatusItem 
                            key={studentStatus._id.toString()} 
                            studentStatus={studentStatus} 
                            setChosenStudentStatus={setChosenStudentStatus} 
                            DetailHandler={DetailHandler} 
                            onDeleteSuccess={fetchStudentStatuses}
                        />
                    ))}
                </div>

                <div className="student-statuses-pagination">
                    <button className='student-statuses-pagination-btn prev' onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <button className='student-statuses-pagination-btn next' onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default StudentStatuses;