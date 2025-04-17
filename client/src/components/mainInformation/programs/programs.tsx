import { useEffect, useState, useCallback } from "react";
import { Program } from "./models/program";
import Header from "../header/header";
import './programs.css';
import ProgramItem from "./programItem/programItem";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import '../../../components/common/DomainStyles.css';

import { SERVER_URL } from '../../../../global';

const Programs = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [type, setType] = useState('');
    const [chosenProgram, setChosenProgram] = useState<Program | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPrograms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SERVER_URL + `/api/v1/programs?page=${currentPage}&searchString=${search}`,);
            const data = await response.json();
            setPrograms(data.data);
            setTotalPages(data.meta.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching programs:', error);
            setLoading(false);
        }
    }, [search, currentPage]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    function DetailHandler(type: string) {
        const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
        setType(type);
        detailDialog.classList.toggle('hidden');
    }

    return (
        <div className="domain-container">
            <DetailDialog 
                type={type} 
                program={chosenProgram ?? programs[0]} 
                onSuccess={fetchPrograms}
            />
            <Header searchHandler={setSearch} />
            
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>Danh sách chương trình</h2>
                        <Button variant="success" onClick={() => DetailHandler('add')}>
                            <AddIcon /> Thêm chương trình mới
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Tên chương trình</th>
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
                                ) : programs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center">Không tìm thấy chương trình nào</td>
                                    </tr>
                                ) : (
                                    programs.map((program) => (
                                        <ProgramItem 
                                            key={program._id.toString()} 
                                            program={program} 
                                            setChosenProgram={setChosenProgram} 
                                            DetailHandler={DetailHandler}
                                            onDeleteSuccess={fetchPrograms}
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

export default Programs;