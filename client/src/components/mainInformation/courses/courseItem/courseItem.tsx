import React, { useState, useEffect } from "react";
import { Subject } from "../models/course";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';
import { CoursesRoute } from "../route/courses.route";

interface CourseItemProps {
  subject: Subject;
  DialogHandler: (type: string) => void;
  setChosenSubject: (subject: Subject) => void;
  setShowConfirmation: (show: boolean) => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
  subject,
  DialogHandler,
  setChosenSubject,
  setShowConfirmation
}) => {
  const [faculty, setFaculty] = useState<string>("");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await CoursesRoute.getFacultyById(subject.khoa.toString());
        setFaculty(data.ten_khoa);
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };

    fetchFaculty();
  }, [subject.khoa]);

  const handleEdit = () => {
    setChosenSubject(subject);
    DialogHandler("edit");
  };

  function deleteConfirmHandler() {
    setShowConfirmation(true);
  }

  return (
    <>
      <tr>
        <td>{subject.ten}</td>
        <td>{subject.ma_mon_hoc}</td>
        <td>{faculty}</td>
        <td>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={deleteConfirmHandler}>
            <DeleteIcon fontSize="small" />
          </Button>
        </td>
      </tr>
    </>
  );
};

export default CourseItem;