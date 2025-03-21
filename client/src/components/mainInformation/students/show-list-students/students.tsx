import React, { useEffect, useState } from "react";
import "./students.css";

import StudentItem from "./studentItem/studentItem";
import ProfileDialog from "./profileDialog/profileDialog";

import { Student } from "../../../../model/student";
import { Faculty } from '../../../../model/faculty';
import AddIcon from "@mui/icons-material/Add";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface StudentProps {
    searchString: string;
}

const Students: React.FC<StudentProps> = ({ searchString }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [profileType, setProfileType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [chosenStudent, setChosenStudent] = useState<Student | null>(null);

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
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [faculty, setFaculty] = useState('')

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/students?searchString=${searchString}&faculty=${faculty}&page=${currentPage}`)
                const data = await response.json()
                setStudents(data.data)
                setTotalPages(data.meta.total)
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }

        async function fetchFaculty() {
            try {
                const response = await fetch(
                    "http://localhost:3001/api/v1/faculties/all"
                );
                const data = await response.json();
                setFaculties(data);
            } catch (error) {
                console.error("Error fetching faculty:", error);
            }
        }

        fetchFaculty();
        fetchStudents();
    }, [faculty, searchString, currentPage]);

    function Filter(event: React.ChangeEvent<HTMLSelectElement>) {
        setFaculty(event.target.value);
    }


    function ProfileHandler(type: string) {
        const profileDialog = document.querySelector(
            ".profile-dialog-container"
        ) as HTMLElement;
        profileDialog.classList.toggle("hidden");
        setProfileType(type);
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

    if (!students) {
        return <div>Loading...</div>;
    }

    return (
        <div className="students">
            <ProfileDialog student={chosenStudent ?? students[0]} type={profileType} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                        <i className="fa-solid fa-file-import"></i>
                    </button>

                    <button
                        className="add-student"
                        onClick={() => ProfileHandler("add")}
                    >
                        <AddIcon />
                    </button>
                </div>
            </div>

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
                {students.map((student) => (
                    <StudentItem
                        key={student._id.toString()}
                        id={student._id.toString()}
                        student={student}
                        ProfileHandler={ProfileHandler}
                        setChosenStudent={setChosenStudent}
                    />
                ))}
            </div>

            <div className="students-export">
                <button onClick={() => handleExport("csv")}>
                    <i className="fa-solid fa-file-export"></i> Export CSV
                </button>

                <button onClick={() => handleExport("xlsx")}>
                    <i className="fa-solid fa-file-export"></i> Export Excel
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
