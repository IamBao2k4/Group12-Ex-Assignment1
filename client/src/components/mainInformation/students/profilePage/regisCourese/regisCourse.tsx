import React, { useState, useEffect } from "react";
import "./regisCourse.css";
import { SERVER_URL } from "../../../../../../global";
import { OpenClass } from "../../../open_class/models/open_class.model";
import { Enrollment } from "../models/enrollment.model";
import { Student } from "../../models/student";

interface RegisCourseProps {
    student: Student;
}

const RegisCourse: React.FC<RegisCourseProps> = ({ student }) => {
    const [availableCourses, setAvailableCourses] = useState<OpenClass[]>([]);
    const [registeredCourses, setRegisteredCourses] = useState<Enrollment[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

    useEffect(() => {
        const fetchAvailableCourses = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/v1/open_class/student/${student._id}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setAvailableCourses(data);
                } else {
                    console.error("Error fetching available courses:", data);
                    setAvailableCourses([]);
                }
            } catch (error) {
                console.error("Error fetching available courses:", error);
            }
        };

        const fetchRegisteredCourses = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/v1/enrollments/student/${student._id}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRegisteredCourses(data);
                } else {
                    console.error("Error fetching registered courses:", data);
                    setRegisteredCourses([]);
                }
            } catch (error) {
                console.error("Error fetching registered courses:", error);
            }
        };

        fetchAvailableCourses();
        fetchRegisteredCourses();
    }, [student._id]);

    const handleCheckboxChange = (courseId: string) => {
        setSelectedCourses((prevSelected) =>
            prevSelected.includes(courseId)
                ? prevSelected.filter((id) => id !== courseId) // Remove if already selected
                : [...prevSelected, courseId] // Add if not selected
        );
    };

    const handleRegisterCourse = async () => {
        if (!selectedCourses.length) return;

        try {
            // Prepare the payload to match CreateEnrollmentDto
            selectedCourses.map(async (courseId) => {
                const course = availableCourses.find((c) => c._id === courseId);

                const response = await fetch(`${SERVER_URL}/api/v1/enrollments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        ma_sv: student._id.toString(),
                        ma_mon: course?.course_details?.ma_mon_hoc || "",
                        ma_lop: course?.ma_lop || "", 
                    }), // Send the array of enrollment objects
                });

            });
        } catch (error) {
            console.error("Error registering courses:", error);
        }
    };

    const handleUnregisterCourse = async (courseId: string) => {
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/enrollments`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            if (!response.ok) throw new Error("Failed to unregister course");

        } catch (error) {
            console.error("Error unregistering course:", error);
        }
    };

    if (!availableCourses.length && !registeredCourses.length) {
        return <div className="regis-course-loading">Enrollment loading...</div>;
    }

    return (
        <div className="regis-course-container">
            <div className="regis-course-left">
                <h2>Available Courses</h2>
                <div className="regis-course-checkbox-group">
                    <table className="regis-course-table">
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Schedule</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableCourses.map((course) => (
                                <tr key={course._id} className="regis-course-row">
                                    <td>{course.course_details?.ten}</td>
                                    <td>{course.lich_hoc}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="availableCourse"
                                            value={course._id}
                                            checked={course._id ? selectedCourses.includes(course._id) : false}
                                            onChange={() => course._id && handleCheckboxChange(course._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    className="regis-course-register-btn"
                    onClick={handleRegisterCourse}
                    disabled={!selectedCourses}
                >
                    Register
                </button>
            </div>
            <div className="regis-course-divider"></div>
            <div className="regis-course-right">
                <h2>Registered Courses</h2>
                <ul className="regis-course-list">
                    {registeredCourses.map((course) => (
                        <li key={course._id.toString()} className="regis-course-item">
                            <span>
                                {course.ma_mon} ({course.ma_mon})
                            </span>
                            <button
                                className="regis-course-unregister-btn"
                                onClick={() => handleUnregisterCourse(course._id.toString())}
                            >
                                Unregister
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RegisCourse;