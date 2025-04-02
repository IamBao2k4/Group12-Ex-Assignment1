import React,{ useState, useEffect } from "react";
import "./subjectItem.css";

import { Subject } from "../models/subject";
import { SERVER_URL } from "../../../../../global";

interface SubjectItemProps {
    id: string;
    subject: Subject;
    DialogHandler: (type: string) => void;
    setChosenSubject: (subject: Subject) => void;
    onDeleteSuccess: () => void;
}

const SubjectItem: React.FC<SubjectItemProps> = ({
    id,
    subject,
    DialogHandler,
    setChosenSubject,
    onDeleteSuccess,
}) => {
    const [faculty, setFaculty] = useState<string>("");

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/v1/faculties/${subject.khoa}`);
                const data = await response.json();
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

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/api/v1/subjects/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete subject");
            }

            onDeleteSuccess();
        } catch (error) {
            console.error("Error deleting subject:", error);
        }
    };

    return (
        <div className="subject-item row">
            <div className="subject-item-name">{subject.ten}</div>
            <div className="subject-item-code">{subject.ma_mon_hoc}</div>
            <div className="subject-item-faculty">{faculty}</div>
            <div className="subject-item-actions">
                <button onClick={handleEdit}>
                    <i className="fa-solid fa-edit"></i>
                </button>
                <button onClick={handleDelete}>
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    );
};

export default SubjectItem;