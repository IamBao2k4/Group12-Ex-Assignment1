import React,{ useState, useEffect } from "react";
import "./courseItem.css";
import { Subject } from "../models/course";
import { SERVER_URL } from "../../../../../global";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';
import ConfirmationDialog from '../../../common/ConfirmationDialog';
import { useNotification } from '../../../common/NotificationContext';

interface CourseItemProps {
    id: string;
    subject: Subject;
    DialogHandler: (type: string) => void;
    setChosenSubject: (subject: Subject) => void;
    onDeleteSuccess: () => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
    id,
    subject,
    DialogHandler,
    setChosenSubject,
    onDeleteSuccess,
}) => {
    const [faculty, setFaculty] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { showNotification } = useNotification();

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

    function deleteConfirmHandler() {
        setShowConfirmation(true);
    }

    async function handleDelete() {
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/subjects/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (response.ok) {
                showNotification('success', `Course "${subject.ten}" deleted successfully`);
                setShowConfirmation(false);
                onDeleteSuccess(); // Call the refresh function instead of reloading page
            } else {
                showNotification('error', data.message || 'Failed to delete course');
            }
        } catch (error) {
            showNotification('error', 'Error occurred while deleting course');
            console.error("Error deleting subject:", error);
        }
    }

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                title="Delete Confirmation"
                message={`Are you sure you want to delete the course "${subject.ten}"?`}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirmation(false)}
            />
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