import React, { useState, useEffect } from "react";
import "./studentItem.css";
import { Student } from "../models/student";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import { useNotification } from "../../../common/NotificationContext";

import { SERVER_URL } from "../../../../../global";

interface StudentItemProps {
    id: string;
    student: Student;
    ProfileHandler: (type: string) => void;
    setChosenStudent: (student: Student) => void;
    onDeleteSuccess: () => void;
}

const StudentItem: React.FC<StudentItemProps> = ({
    id,
    student,
    ProfileHandler,
    setChosenStudent,
    onDeleteSuccess,
}) => {
    const [status, setStatus] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();

    function EditBtnHandler() {
        console.log("Edit button clicked");
        setChosenStudent(student);
        ProfileHandler("edit");
    }

    useEffect(() => {
        fetch(`${SERVER_URL}/api/v1/student-statuses/${student.tinh_trang}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.tinh_trang);
            });
    }, [student.tinh_trang]);

    function deleteConfirmHandler() {
        setShowConfirmation(true);
    }

    async function DeleteStudentHandler() {
        try {
            const response = await fetch(
                `${SERVER_URL}/api/v1/students/${student._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                showNotification(
                    "success",
                    `Student "${student.ho_ten}" deleted successfully`
                );
                setShowConfirmation(false);
                onDeleteSuccess(); // Call the refresh function instead of reloading page
            } else {
                showNotification(
                    "error",
                    data.message || "Failed to delete student"
                );
            }
        } catch (error) {
            showNotification("error", "Error occurred while deleting student");
            console.error("Error deleting student:", error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title="Delete Confirmation"
                message={`Are you sure you want to delete the student "${student.ho_ten}"?`}
                onConfirm={DeleteStudentHandler}
                onCancel={() => setShowConfirmation(false)}
            />
            <div className="student-item row" key={id}>
                <div className="student-item-info">
                    <div className="student-item-info-name">
                        {student.ho_ten}
                    </div>
                    <div className="student-item-info-id">
                        {student.ma_so_sinh_vien}
                    </div>
                    <div className="student-item-info-birthday">
                        {student.ngay_sinh}
                    </div>
                    <div className="student-item-info-status">{status}</div>
                    <div className="student-item-action">
                        <button
                            className="student-item-action-edit"
                            onClick={EditBtnHandler}
                        >
                            <EditIcon />
                        </button>
                        <button
                            className="student-item-action-delete"
                            onClick={deleteConfirmHandler}
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentItem;
