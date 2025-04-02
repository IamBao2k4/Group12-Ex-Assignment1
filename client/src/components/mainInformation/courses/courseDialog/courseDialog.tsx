import React, { useState, useEffect } from "react";
import "./subjectDialog.css";
import { SERVER_URL } from "../../../../../global";

import { Subject } from "../models/course";
import { Faculty } from "../../faculties/models/faculty";

interface CourseDialogProps {
  subject: Subject | null;
  type: string; // "add" or "edit"
  onSuccess: () => void;
}

const CourseDialog: React.FC<CourseDialogProps> = ({ subject, type, onSuccess }) => {
  const [maMonHoc, setMaMonHoc] = useState(subject?.ma_mon_hoc || "");
  const [ten, setTen] = useState(subject?.ten || "");
  const [tinChi, setTinChi] = useState(subject?.tin_chi || 0);
  const [faculty, setFaculty] = useState(subject?.khoa || "");
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/faculties/all`);
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    }

    fetchFaculties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ma_mon_hoc: maMonHoc,
      ten,
      tin_chi: tinChi,
      khoa: faculty,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/api/v1/subjects${type === "edit" ? `/${subject?._id}` : ""}`,
        {
          method: type === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save subject");
      }

      onSuccess();
      closeDialog();
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  const closeDialog = () => {
    const dialog = document.querySelector(".subject-dialog-container") as HTMLElement;
    dialog.classList.add("hidden");
  };

  return (
    <div className="subject-dialog-container hidden">
      <div className="subject-dialog">
        <h2>{type === "edit" ? "Edit Subject" : "Add Subject"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="maMonHoc">Mã môn học</label>
            <input
              type="text"
              id="maMonHoc"
              value={maMonHoc}
              onChange={(e) => setMaMonHoc(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ten">Tên môn học</label>
            <input
              type="text"
              id="ten"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tinChi">Số tín chỉ</label>
            <input
              type="number"
              id="tinChi"
              value={tinChi}
              onChange={(e) => setTinChi(Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="faculty">Khoa</label>
            <select
              id="faculty"
              value={faculty.toString()}
              onChange={(e) => setFaculty(e.target.value)}
              required
            >
              <option value="">Chọn khoa</option>
              {faculties.map((faculty) => (
                <option key={faculty._id.toString()} value={faculty._id.toString()}>
                  {faculty.ten_khoa}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">{type === "edit" ? "Save" : "Add"}</button>
            <button type="button" onClick={closeDialog}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseDialog;