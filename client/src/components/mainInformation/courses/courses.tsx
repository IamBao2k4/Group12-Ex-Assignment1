import { useEffect, useState, useCallback } from "react";
import { Subject } from "./models/course";
import Header from "../header/header";
import CourseItem from "./courseItem/courseItem";
import CourseDialog from "./courseDialog/courseDialog";
import AddIcon from '@mui/icons-material/Add';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { useNotification } from '../../common/NotificationContext';
import { CoursesRoute } from "./route/courses.route";

const Courses = () => {
  const [courses, setCourses] = useState<Subject[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [type, setType] = useState('');
  const [chosenCourse, setChosenCourse] = useState<Subject | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await CoursesRoute.getCourses({ page: currentPage, limit: 10 }, { searchString: search });
      setCourses(response.data);
      setTotalPages(response.meta.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      setChosenCourse(courses[0]);
    }
  }, [courses]);

  function DetailHandler(type: string) {
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    setType(type);
    detailDialog.classList.toggle('hidden');
  }

  async function DeleteHandler() {
    if (!chosenCourse) return;

    try {
      await CoursesRoute.deleteCourse(chosenCourse._id.toString());
      showNotification('success', `Course "${chosenCourse.ten}" deleted successfully`);
      setShowConfirmation(false);
      fetchCourses();
    } catch (error) {
      showNotification('error', 'Error occurred while deleting course');
      console.error('Error deleting course:', error);
    }
  }

  return (
    <div className="domain-container">
      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the course "${chosenCourse?.ten}"?`}
        onConfirm={DeleteHandler}
        onCancel={() => setShowConfirmation(false)}
      />
      <CourseDialog 
        type={type} 
        subject={chosenCourse ?? courses[0]} 
        onSuccess={fetchCourses}
      />
      <Header searchHandler={setSearch} />
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Danh sách môn học</h2>
            <Button variant="success" onClick={() => DetailHandler('add')}>
              <AddIcon /> Thêm môn học mới
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã môn học</th>
                  <th>Tên môn học</th>
                  <th>Khoa</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center">Đang tải...</td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">Không tìm thấy môn học nào</td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <CourseItem 
                      key={course._id.toString()} 
                      subject={course} 
                      setChosenSubject={setChosenCourse} 
                      DialogHandler={DetailHandler}
                      setShowConfirmation={setShowConfirmation}
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