import React, { useEffect, useState, useCallback } from "react";
import StudentItem from "./studentItem/studentItem";
import ProfileDialog from "./profileDialog/profileDialog";
import { Student } from "./models/student";
import { Faculty } from "../faculties/models/faculty";
import AddIcon from "@mui/icons-material/Add";
import { Card, Button, Table, Pagination, Form, Row, Col } from 'react-bootstrap';
import '../../../components/common/DomainStyles.css';
import { SERVER_URL } from "../../../../global";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface StudentsProps {
    searchString: string;
}

const Students: React.FC<StudentsProps> = (searchString) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [profileType, setProfileType] = useState("add");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [chosenStudent, setChosenStudent] = useState<Student | null>(null);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [faculty, setFaculty] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${SERVER_URL}/api/v1/students?searchString=${searchString.searchString}&faculty=${faculty}&page=${currentPage}`
            );
            const data = await response.json();
            setStudents(data.data);
            setTotalPages(data.meta.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students:", error);
            setLoading(false);
        }
    }, [searchString, faculty, currentPage]);

    const fetchFaculty = useCallback(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/faculties/all`);
            const data = await response.json();
            setFaculties(data);
        } catch (error) {
            console.error("Error fetching faculty:", error);
        }
    }, []);

    useEffect(() => {
        fetchFaculty();
        fetchStudents();
    }, [fetchFaculty, fetchStudents]);

    function ProfileHandler(type: string) {
        setProfileType(type);
        const profileDialog = document.querySelector(
            ".profile-dialog-container"
        ) as HTMLElement;
        profileDialog.classList.toggle("hidden");
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

            const jsonData: Student[] = XLSX.utils.sheet_to_json(sheet);
            setStudents(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleExport = (fileType: "csv" | "xlsx") => {
        if (students.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const ws = XLSX.utils.json_to_sheet(students);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");

        if (fileType === "xlsx") {
            const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array",
            });
            const data = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(data, "students.xlsx");
        } else {
            XLSX.writeFile(wb, "students.csv");
        }
    };

    return (
        <div className="domain-container">
            <ProfileDialog
                student={chosenStudent ?? students[0]}
                type={profileType}
                onSuccess={fetchStudents}
            />
            
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>Danh sách sinh viên</h2>
                        <div className="d-flex">
                            <input
                                type="file"
                                accept=".csv, .xlsx"
                                onChange={handleImport}
                                style={{ display: "none" }}
                                id="fileInput"
                            />
                            <Button 
                                variant="primary" 
                                className="mx-2"
                                onClick={() => document.getElementById("fileInput")?.click()}
                            >
                                Import File
                            </Button>
                            <Button variant="success" onClick={() => ProfileHandler("add")}>
                                <AddIcon /> Thêm sinh viên mới
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Form className="mb-3">
                        <Row>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Khoa:</Form.Label>
                                    <Form.Select 
                                        onChange={(e) => setFaculty(e.target.value)}
                                        value={faculty}
                                    >
                                        <option value="">Tất cả</option>
                                        {faculties.map((faculty) => (
                                            <option
                                                key={faculty._id.toString()}
                                                value={faculty._id.toString()}
                                            >
                                                {faculty.ten_khoa}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Họ tên</th>
                                    <th>Mã số sinh viên</th>
                                    <th>Ngày sinh</th>
                                    <th>Tình trạng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">Đang tải...</td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">Không tìm thấy sinh viên nào</td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <StudentItem
                                            key={student._id.toString()}
                                            id={student._id.toString()}
                                            student={student}
                                            ProfileHandler={ProfileHandler}
                                            setChosenStudent={setChosenStudent}
                                            onDeleteSuccess={fetchStudents}
                                        />
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <Button variant="outline-primary" onClick={() => handleExport("csv")} className="me-2">
                                Export CSV
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleExport("xlsx")}>
                                Export Excel
                            </Button>
                        </div>
                        
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

export default Students;
