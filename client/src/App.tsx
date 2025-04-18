import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import HorizontalNav from "./components/horizontalNav/horizontalNav";
import Courses from "./components/mainInformation/courses/courses";
import Faculties from "./components/mainInformation/faculties/faculties";
import MainInformation from "./components/mainInformation/mainInformation";
import OpenClassComponent from "./components/mainInformation/open_class";
import Programs from "./components/mainInformation/programs/programs";
import StudentStatuses from "./components/mainInformation/student_statuses/student_statuses";
import Transcript from "./components/mainInformation/transcript/transcript";

function App() {
    return (
        <Router>
            <div
                id="main-container"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    width: "100%",
                }}
            >
                <HorizontalNav />
                <div
                    className="content-area"
                    style={{
                        flex: 1,
                        padding: "20px",
                        overflowY: "auto",
                        height: "100%",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<MainInformation />} />
                        <Route path="/students" element={<MainInformation />} />
                        <Route path="/faculties" element={<Faculties />} />
                        <Route path="/programs" element={<Programs />} />
                        <Route
                            path="/student-statuses"
                            element={<StudentStatuses />}
                        />
                        <Route path="/courses" element={<Courses />} />
                        <Route
                            path="/open-classes"
                            element={<OpenClassComponent />}
                        />
                        <Route
                            path="/transcripts/:studentId"
                            element={<Transcript />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
