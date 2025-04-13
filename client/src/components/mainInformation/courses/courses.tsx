import React, { useEffect, useState, useCallback } from "react";
import "./courses.css";
import CourseItem from "./courseItem/courseItem";
import CourseDialog from "./courseDialog/courseDialog";
import { Subject } from "./models/course";
import { Faculty } from "../faculties/models/faculty";
import AddIcon from "@mui/icons-material/Add";
import { Card, Button, Form, Table, Pagination, Row, Col } from 'react-bootstrap';
import '../../../components/common/DomainStyles.css';
import { SERVER_URL } from "../../../../global";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dialogType, setDialogType] = useState("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chosenSubject, setChosenSubject] = useState<Subject | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [faculty, setFaculty] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/courses?faculty=${faculty}&page=${currentPage}`
      );
      const data = await response.json();
      setSubjects(data.data);
      setTotalPages(data.meta.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setLoading(false);
    }
  }, [faculty, currentPage]);

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
    fetchSubjects();
  }, [fetchFaculties, fetchSubjects]);

  function Filter(event: React.ChangeEvent<HTMLSelectElement>) {
    setFaculty(event.target.value);
  }

  function DialogHandler(type: string) {
    setDialogType(type);
    const dialog = document.querySelector(".subject-dialog-container") as HTMLElement;
    dialog.classList.toggle("hidden");
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: Subject[] = XLSX.utils.sheet_to_json(sheet);
      setSubjects(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = (fileType: "csv" | "xlsx") => {
    if (subjects.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(subjects);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subjects");

    if (fileType === "xlsx") {
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, "subjects.xlsx");
    } else {
      XLSX.writeFile(wb, "subjects.csv");
    }
  };

  return (
    <div className="domain-container">
      <CourseDialog
        subject={chosenSubject ?? subjects[0]}
        type={dialogType}
        onSuccess={fetchSubjects}
      />
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Danh sách môn học</h2>
            <div className="d-flex gap-2">
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleImport}
                style={{ display: "none" }}
                id="fileInput"
              />
              <Button variant="secondary" onClick={() => document.getElementById("fileInput")?.click()}>
                <i className="fa-solid fa-file-import"></i> Nhập Excel
              </Button>
              <Button variant="success" onClick={() => DialogHandler("add")}>
                <AddIcon /> Thêm môn học
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Khoa:</Form.Label>
                <Form.Select onChange={Filter} value={faculty}>
                  <option value="">Tất cả</option>
                  {faculties.map((faculty) => (
                    <option key={faculty._id.toString()} value={faculty._id.toString()}>
                      {faculty.ten_khoa}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end justify-content-end">
              <Button variant="outline-secondary" className="me-2" onClick={() => handleExport("csv")}>
                <i className="fa-solid fa-file-export"></i> Xuất CSV
              </Button>
              <Button variant="outline-primary" onClick={() => handleExport("xlsx")}>
                <i className="fa-solid fa-file-export"></i> Xuất Excel
              </Button>
            </Col>
          </Row>

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
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">Không tìm thấy môn học nào</td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <CourseItem
                      key={subject._id.toString()}
                      id={subject._id.toString()}
                      subject={subject}
                      DialogHandler={DialogHandler}
                      setChosenSubject={setChosenSubject}
                      onDeleteSuccess={fetchSubjects}
                    />
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
              
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Subjects;