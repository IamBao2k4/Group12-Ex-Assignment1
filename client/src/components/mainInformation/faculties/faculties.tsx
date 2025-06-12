import { useEffect, useState, useCallback } from "react";
import { Faculty } from "./models/faculty";
import Header from "../header/header";
import './faculties.css';
import FacultyItem from "./facultyItem/facultyItem";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import '../../../components/common/DomainStyles.css';
import { useTranslation } from 'react-i18next';
import { FacultiesRoute } from "./route/faculties.route";

const Faculties = () => {
    const { t } = useTranslation();
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [type, setType] = useState('');
    const [chosenFaculty, setChosenFaculty] = useState<Faculty | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchFaculties = useCallback(async () => {
        setLoading(true);
        try {
            const response = await FacultiesRoute.getFaculties(
                { page: currentPage, limit: 10 }, 
                { searchString: search }
            );
            setFaculties(response.data);
            setTotalPages(response.meta.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setLoading(false);
        }
    }, [currentPage, search]);

    useEffect(() => {
        fetchFaculties();
    }, [fetchFaculties]);

    function DetailHandler(type: string) {
        const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
        setType(type);
        detailDialog.classList.toggle('hidden');
    }

    return (
        <div className="domain-container">
            <DetailDialog 
                type={type} 
                faculty={chosenFaculty ?? faculties[0]} 
                onSuccess={fetchFaculties}
            />
            <Header searchHandler={setSearch} />
            
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>{t('faculty.title')}</h2>
                        <Button variant="success" onClick={() => DetailHandler('add')}>
                            <AddIcon /> {t('faculty.add')}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>{t('faculty.facultyCode')}</th>
                                    <th>{t('faculty.facultyName')}</th>
                                    <th>{t('common.createdAt')}</th>
                                    <th>{t('common.updatedAt')}</th>
                                    <th>{t('common.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">{t('common.loading')}</td>
                                    </tr>
                                ) : faculties.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">{t('faculty.notFound')}</td>
                                    </tr>
                                ) : (
                                    faculties.map((faculty) => (
                                        <FacultyItem 
                                            key={faculty._id.toString()} 
                                            faculty={faculty} 
                                            setChosenFaculty={setChosenFaculty} 
                                            DetailHandler={DetailHandler}
                                            onDeleteSuccess={fetchFaculties}
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

export default Faculties;