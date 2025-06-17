import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArticleIcon from "@mui/icons-material/Article";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import { useNotification } from "../../../common/NotificationContext";
import { Student } from "../models/student";
import { Status } from "../../student_statuses/models/student_status";
import "./studentItem.css";
import { useTranslation } from "react-i18next";
import { SERVER_URL } from "../../../../../global";
import { useNavigate } from "react-router-dom";

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
    const { t, i18n } = useTranslation();
    const [status, setStatus] = useState<Status>();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    function EditBtnHandler() {
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
                    t("student.deleteSuccess", { name: student.ho_ten })
                );
                setShowConfirmation(false);
                onDeleteSuccess();
            } else {
                showNotification(
                    "error",
                    data.message || t("student.deleteError")
                );
            }
        } catch (error) {
            showNotification("error", t("student.deleteError"));
            console.error("Error deleting student:", error);
        }
    }

    function goToTranscriptHandler() {
        navigate(`/transcripts/${student._id}`);
    }

    function handleDetailClick() {
        navigate(`/students/${student._id}`);
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title={t("student.deleteConfirmTitle")}
                message={t("student.deleteConfirmMessage", {
                    name: student.ho_ten,
                })}
                onConfirm={DeleteStudentHandler}
                onCancel={() => setShowConfirmation(false)}
            />
            <tr key={id} title={t("student.viewTranscript")}>
                <td
                    onClick={goToTranscriptHandler}
                    style={{ cursor: "pointer" }}
                >
                    {student.ho_ten}
                </td>
                <td
                    onClick={goToTranscriptHandler}
                    style={{ cursor: "pointer" }}
                >
                    {student.ma_so_sinh_vien}
                </td>
                <td
                    onClick={goToTranscriptHandler}
                    style={{ cursor: "pointer" }}
                >
                    {student.ngay_sinh}
                </td>
                <td
                    onClick={goToTranscriptHandler}
                    style={{ cursor: "pointer" }}
                >
                    {i18n.language === "en" ? status?.en : status?.vi}
                </td>
                <td>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={EditBtnHandler}
                        title={t("common.edit")}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={deleteConfirmHandler}
                        title={t("common.delete")}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                    <Button
                        variant="outline-info"
                        size="sm"
                        className="ms-2"
                        onClick={handleDetailClick}
                        title={t("common.view")}
                    >
                        <ArticleIcon fontSize="small" />
                    </Button>
                </td>
            </tr>
        </>
    );
};

export default StudentItem;
