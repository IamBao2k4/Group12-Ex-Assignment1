import { useEffect, useState, useCallback } from "react";
import { StudentStatus } from "./models/student_status";
import Header from "../header/header";
import './student_statuses.css';
import StudentStatusItem from "./student_statusItem/student_statusItem.tsx";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import '../../../components/common/DomainStyles.css';

import { SERVER_URL } from '../../../../global';

const StudentStatuses = () => {
    const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState('');
    const [chosenStatus, setChosenStatus] = useState<StudentStatus | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchStudentStatuses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SERVER_URL + `/api/v1/student-statuses?page=${currentPage}&searchString=${search}`);
            const data = await response.json();
            setStudentStatuses(data.data);
            setTotalPages(data.meta.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student statuses:', error);
            setLoading(false);
        }
    }, [currentPage, search]);

    useEffect(() => {
        fetchStudentStatuses();
    }, [fetchStudentStatuses]);

    function DetailHandler(type: string) {
        const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
        setType(type);
        detailDialog.classList.toggle('hidden');
    }

    return (
        <div className="domain-container">
            <DetailDialog 
                type={type} 
                studentStatus={chosenStatus ?? studentStatuses[0]} 
                onSuccess={fetchStudentStatuses}
            />
            <Header searchHandler={setSearch} />
            
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>Danh sách trạng thái sinh viên</h2>
                        <Button variant="success" onClick={() => DetailHandler('add')}>
                            <AddIcon /> Thêm trạng thái mới
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Tên trạng thái</th>
                                    <th>Ngày thêm</th>
                                    <th>Ngày cập nhật</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center">Đang tải...</td>
                                    </tr>
                                ) : studentStatuses.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center">Không tìm thấy trạng thái nào</td>
                                    </tr>
                                ) : (
                                    studentStatuses.map((status) => (
                                        <StudentStatusItem 
                                            key={status._id.toString()} 
                                            studentStatus={status} 
                                            setChosenStudentStatus={setChosenStatus} 
                                            DetailHandler={DetailHandler}
                                            onDeleteSuccess={fetchStudentStatuses}
                                        />
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <Pagination.Prev 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                                disabled={currentPage === 1}
                            />
                            
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Pagination.Item 
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            
                            <Pagination.Next 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last 
                                onClick={() => setCurrentPage(totalPages)} 
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default StudentStatuses;