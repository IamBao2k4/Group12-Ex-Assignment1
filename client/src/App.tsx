import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HorizontalNav from './components/horizontalNav/horizontalNav';
import MainInformation from './components/mainInformation/mainInformation';
import ProfilePage from './components/mainInformation/students/profilePage/profilePage';
import Faculties from './components/mainInformation/faculties/faculties';
import Programs from './components/mainInformation/programs/programs';
import StudentStatuses from './components/mainInformation/student_statuses/student_statuses';
import Courses from './components/mainInformation/courses/courses';
import OpenClassComponent from './components/mainInformation/open_class';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div id="main-container"
        style={{
          display: 'flex', 
          flexDirection: 'row',
          height: '100%',
          width: '100%'
        }}
      >
        <HorizontalNav />
        <div className="content-area" style={{ 
          flex: 1, 
          padding: '20px',
          overflowY: 'auto',
          height: '100%'
        }}>
          <Routes>
            <Route path='/' element={<MainInformation/>}/>
            <Route path="/students" element={<MainInformation />} />
            <Route path="/students/:id" element={<ProfilePage />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/student-statuses" element={<StudentStatuses />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/open-classes" element={<OpenClassComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;