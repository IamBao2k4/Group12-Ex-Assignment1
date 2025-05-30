import { useEffect, useState, useCallback } from "react";
import { Subject } from "./models/course";
import Header from "../header/header";
import CourseItem from "./courseItem/courseItem";
import CourseDialog from "./courseDialog/courseDialog";
import AddIcon from "@mui/icons-material/Add";
import { Card, Button, Table, Pagination, Form } from "react-bootstrap";
import "../../../components/common/DomainStyles.css";
import { useTranslation } from 'react-i18next';
import { CoursesRoute } from "./route/courses.route";
import mongoose from "mongoose";

interface SearchParams {
    searchString?: string;
    faculty?: mongoose.Types.ObjectId;
}

const Courses = () => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<Subject[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState('');
    const [chosenCourse, setChosenCourse] = useState<Subject | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [faculty, setFaculty] = useState<string>("");
    const [faculties, setFaculties] = useState<any[]>([]);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const searchParams: SearchParams = {
                searchString: search
            };
            
            if (faculty) {
                searchParams.faculty = new mongoose.Types.ObjectId(faculty);
            }

            const response = await CoursesRoute.getCourses(
                { page: currentPage, limit: 10 }, 
                searchParams
            );
            setCourses(response.data);
            setTotalPages(response.meta.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    }, [currentPage, search, faculty]);

    const fetchFaculties = useCallback(async () => {
        try {
            const response = await CoursesRoute.getAllFaculties();
            setFaculties(response);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    }, []);

    useEffect(() => {
        fetchFaculties();
    }, [fetchFaculties]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    function DetailHandler(type: string) {
        const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
        setType(type);
        detailDialog.classList.toggle('hidden');
    }

    const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFaculty(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="domain-container">
            <CourseDialog 
                type={type} 
                subject={chosenCourse ?? courses[0]} 
                onSuccess={fetchCourses}
            />
            <Header searchHandler={setSearch} />
            
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>{t('course.title')}</h2>
                        <Button variant="success" onClick={() => DetailHandler("add")}>
                            <AddIcon /> {t('course.add')}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('faculty.title')}:</Form.Label>
                        <Form.Select onChange={handleFacultyChange} value={faculty}>
                            <option value="">{t('common.all')}</option>
                            {faculties.map((faculty) => (
                                <option key={faculty._id.toString()} value={faculty._id.toString()}>
                                    {faculty.ten_khoa}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>{t('course.courseName')}</th>
                                    <th>{t('course.courseCode')}</th>
                                    <th>{t('course.credits')}</th>
                                    <th>{t('faculty.title')}</th>
                                    <th>{t('common.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">{t('common.loading')}</td>
                                    </tr>
                                ) : courses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">{t('course.notFound')}</td>
                                    </tr>
                                ) : (
                                    courses.map((course) => (
                                        <CourseItem 
                                            key={course._id.toString()} 
                                            subject={course} 
                                            setChosenSubject={setChosenCourse} 
                                            DialogHandler={DetailHandler}
                                            onDeleteSuccess={fetchCourses}
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

export default Courses;