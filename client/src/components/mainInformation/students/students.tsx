import React, { useEffect, useState, useCallback } from "react";
import "./students.css";

import StudentItem from "./studentItem/studentItem";
import ProfileDialog from "./profileDialog/profileDialog";

import { Student } from "./models/student";
import { Faculty } from "../faculties/models/faculty";
import AddIcon from "@mui/icons-material/Add";

import { SERVER_URL } from "../../../../global";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface StudentProps {
    searchString: string;
}

const Students: React.FC<StudentProps> = ({ searchString }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [profileType, setProfileType] = useState("add");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [chosenStudent, setChosenStudent] = useState<Student | null>(null);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [faculty, setFaculty] = useState("");

    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch(
                `${SERVER_URL}/api/v1/students?searchString=${searchString}&faculty=${faculty}&page=${currentPage}`
            );
            const data = await response.json();
            setStudents(data.data);
            setTotalPages(data.meta.total);
        } catch (error) {
            console.error("Error fetching students:", error);
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

    function Filter(event: React.ChangeEvent<HTMLSelectElement>) {
        setFaculty(event.target.value);
    }

    function ProfileHandler(type: string) {
        setProfileType(type);
        const profileDialog = document.querySelector(
            ".profile-dialog-container"
        ) as HTMLElement;
        profileDialog.classList.toggle("hidden");
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

    if (!students) {
        return <div>Loading...</div>;
    }

    return (
        <div className="students">
            <ProfileDialog
                student={chosenStudent ?? students[0]}
                type={profileType}
                onSuccess={fetchStudents}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>Students</h1>
                <div className="students-add">
                    <input
                        type="file"
                        accept=".csv, .xlsx"
                        onChange={handleImport}
                        style={{ display: "none" }}
                        id="fileInput"
                    />
                    <button
                        onClick={() =>
                            document.getElementById("fileInput")?.click()
                        }
                    >
                        Import File
                    </button>

                    <button
                        className="add-student"
                        onClick={() => ProfileHandler("add")}
                    >
                        Add Student
                    </button>
                </div>
            </div>

            <div className="select-wrapper">
                <select
                    className="students-faculty"
                    name="faculty"
                    id="faculty"
                    onChange={Filter}
                >
                    <option value="" defaultChecked>
                        All
                    </option>
                    {faculties.map((faculty) => (
                        <option
                            key={faculty._id.toString()}
                            value={faculty._id.toString()}
                        >
                            {faculty.ten_khoa}
                        </option>
                    ))}
                </select>

                <svg
                    width="9"
                    height="7"
                    viewBox="0 0 9 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="students-select-icon"
                >
                    <path
                        d="M4.243 6.32851L0 2.08551L1.415 0.671509L4.243 3.50051L7.071 0.671509L8.486 2.08551L4.243 6.32851Z"
                        fill="#C4C4C4"
                    />
                </svg>
            </div>

            <div className="students-list">
                <div className="students-list-header row">
                    <div className="students-list-header-name">Họ tên</div>
                    <div className="students-list-header-id">
                        Mã số sinh viên
                    </div>
                    <div className="students-list-header-birthday">
                        Ngày sinh
                    </div>
                    <div className="students-list-header-status">
                        Tình trạng
                    </div>
                    <div className="students-list-header-action"></div>
                </div>

                <div className="list-students">
                    {students.map((student) => (
                        <StudentItem
                            key={student._id.toString()}
                            id={student._id.toString()}
                            student={student}
                            ProfileHandler={ProfileHandler}
                            setChosenStudent={setChosenStudent}
                            onDeleteSuccess={fetchStudents}
                        />
                    ))}
                </div>
            </div>

            <div className="students-export">
                <button onClick={() => handleExport("csv")}>Export CSV</button>

                <button onClick={() => handleExport("xlsx")}>
                    Export Excel
                </button>
            </div>

            <div className="students-pagination">
                <button
                    className="students-pagination-btn prev"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    className="students-pagination-btn next"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Students;
