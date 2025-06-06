import { useEffect, useState, useCallback } from "react";
import { Course } from "./models/course";
import Header from "../header/header";
import CourseItem from "./courseItem/courseItem";
import CourseDialog from "./courseDialog/courseDialog";
import AddIcon from "@mui/icons-material/Add";
import { Card, Button, Table, Pagination, Form } from "react-bootstrap";
import "../../../components/common/DomainStyles.css";
import { useTranslation } from 'react-i18next';
import { CoursesRoute } from "./route/courses.route";
import { Faculty } from "../faculties/models/faculty";

interface SearchParams {
    searchString?: string;
    faculty?: string;
}

const Courses = () => {
    const { t, i18n } = useTranslation();
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState('');
    const [chosenCourse, setChosenCourse] = useState<Course | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [faculty, setFaculty] = useState<string>("");
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [facultiesLoading, setFacultiesLoading] = useState(false);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const searchParams: SearchParams = {
                searchString: search
            };
            
            if (faculty) {
                searchParams.faculty = faculty;
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
            setCourses([]);
            setLoading(false);
        }
    }, [currentPage, search, faculty]);

    const fetchFaculties = useCallback(async () => {
        setFacultiesLoading(true);
        try {
            const response = await CoursesRoute.getAllFaculties();
            // Ensure response is an array
            if (Array.isArray(response)) {
                setFaculties(response);
            } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
                setFaculties((response as any).data);
            } else {
                console.warn('Unexpected faculties response structure:', response);
                setFaculties([]);
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setFaculties([]);
        } finally {
            setFacultiesLoading(false);
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
                        <Form.Select 
                            onChange={handleFacultyChange} 
                            value={faculty}
                            disabled={facultiesLoading}
                        >
                            <option value="">
                                {facultiesLoading ? t('common.loading') : t('common.all')}
                            </option>
                            {Array.isArray(faculties) && faculties.map((faculty) => (
                                <option key={faculty._id.toString()} value={faculty._id.toString()}>
                                    {i18n.language === "en" ? faculty.ten_khoa.en : faculty.ten_khoa.vn}
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
                                            course={course} 
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