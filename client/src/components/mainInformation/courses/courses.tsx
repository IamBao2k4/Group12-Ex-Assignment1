import { useEffect, useState, useCallback } from "react";
import { Subject } from "./models/course";
import { Faculty } from "../faculties/models/faculty";
import Header from "../header/header";
import "./courses.css";
import CourseItem from "./courseItem/courseItem";
import CourseDialog from "./courseDialog/courseDialog";
import AddIcon from "@mui/icons-material/Add";
import { Card, Button, Table, Pagination, Form } from "react-bootstrap";
import "../../../components/common/DomainStyles.css";

import { SERVER_URL } from "../../../../global";

const Courses = () => {
  const [courses, setCourses] = useState<Subject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogType, setDialogType] = useState("");
  const [chosenCourse, setChosenCourse] = useState<Subject | null>(null);
  const [search, setSearch] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [faculty, setFaculty] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/courses?page=${currentPage}&searchString=${search}&faculty=${faculty}`
      );
      const data = await response.json();
      setCourses(data.data);
      setTotalPages(data.meta.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  }, [search, faculty, currentPage]);

  const fetchFaculties = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/v1/faculties/all`);
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  }, []);

  useEffect(() => {
    fetchFaculties();
    fetchCourses();
  }, [fetchFaculties, fetchCourses]);

  function DialogHandler(type: string) {
    const dialog = document.querySelector(".subject-dialog-container") as HTMLElement;
    setDialogType(type);
    dialog.classList.toggle("hidden");
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleFacultyChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFaculty(event.target.value);
  }

  return (
    <div className="domain-container">
      <CourseDialog
        type={dialogType}
        subject={chosenCourse ?? courses[0]}
        onSuccess={fetchCourses}
      />
      <Header searchHandler={setSearch} />

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Danh sách môn học</h2>
            <Button variant="success" onClick={() => DialogHandler("add")}>
              <AddIcon /> Thêm môn học
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Khoa:</Form.Label>
            <Form.Select onChange={handleFacultyChange} value={faculty}>
              <option value="">Tất cả</option>
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
                  <th>Tên môn học</th>
                  <th>Mã môn học</th>
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
                      DialogHandler={DialogHandler}
                      onDeleteSuccess={fetchCourses}
                      id={course._id.toString()}
                    />
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
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