import React, { useEffect, useState, useCallback } from "react";
import "./courses.css";

import CourseItem from "./courseItem/courseItem";
import CourseDialog from "./courseDialog/courseDialog";

import { Subject } from "./models/course";
import { Faculty } from "../faculties/models/faculty";
import Header from "../header/header";
import AddIcon from "@mui/icons-material/Add";

import { SERVER_URL } from "../../../../global";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Subjects: React.FC = () => {
  const [courses, setSubjects] = useState<Subject[]>([]);
  const [dialogType, setDialogType] = useState("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chosenSubject, setChosenSubject] = useState<Subject | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [faculty, setFaculty] = useState("");
  const [search, setSearch] = useState("");

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/courses?faculty=${faculty}&page=${currentPage}`
      );
      const data = await response.json();
      setSubjects(data.data);
      setTotalPages(data.meta.total);
    } catch (error) {
      console.error("Error fetching courses:", error);
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

      const jsonData: Subject[] = XLSX.utils.sheet_to_json(sheet);
      setSubjects(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = (fileType: "csv" | "xlsx") => {
    if (courses.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(courses);

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
      saveAs(data, "courses.xlsx");
    } else {
      XLSX.writeFile(wb, "courses.csv");
    }
  };

  if (!courses) {
    return <div className="courses">Loading...</div>;
  }

  return (
    <div className="courses">
      <Header searchHandler={setSearch} />
      <CourseDialog
        subject={chosenSubject ?? courses[0]}
        type={dialogType}
        onSuccess={fetchSubjects}
      />
      <div style={{ display: "flex", justifyContent: "space-between" , width: "100%"}}>
        <h1>Subjects</h1>
        <div className="courses-add">
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleImport}
            style={{ display: "none" }}
            id="fileInput"
          />
          <button onClick={() => document.getElementById("fileInput")?.click()}>
            <i className="fa-solid fa-file-import"></i>
          </button>
          <button className="add-subject" onClick={() => DialogHandler("add")}>
            <AddIcon />
          </button>
        </div>
      </div>
  
      <select
        className="courses-faculty"
        name="faculty"
        id="faculty"
        onChange={Filter}
      >
        <option value="" defaultChecked>
          All
        </option>
        {faculties.map((faculty) => (
          <option key={faculty._id.toString()} value={faculty._id.toString()}>
            {faculty.ten_khoa}
          </option>
        ))}
      </select>
  
      <div className="courses-list">
        <div className="courses-list-header row">
          <div className="courses-list-header-name">Tên môn học</div>
          <div className="courses-list-header-code">Mã môn học</div>
          <div className="courses-list-header-faculty">Khoa</div>
          <div className="courses-list-header-action"></div>
        </div>
  
        <div className="list-courses">
          {courses.map((subject) => (
            <CourseItem
              key={subject._id.toString()}
              id={subject._id.toString()}
              subject={subject}
              DialogHandler={DialogHandler}
              setChosenSubject={setChosenSubject}
              onDeleteSuccess={fetchSubjects}
            />
          ))}
        </div>
      </div>
  
      <div className="courses-export">
        <button onClick={() => handleExport("csv")}>
          <i className="fa-solid fa-file-export"></i> Export CSV
        </button>
        <button onClick={() => handleExport("xlsx")}>
          <i className="fa-solid fa-file-export"></i> Export Excel
        </button>
      </div>
  
      <div className="courses-pagination">
        <button
          className="courses-pagination-btn prev"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="courses-pagination-btn next"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Subjects;