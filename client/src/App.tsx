import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HorizontalNav from './components/horizontalNav/horizontalNav';
import MainInformation from './components/mainInformation/mainInformation';
import Students from './components/mainInformation/students/students';
import Faculties from './components/mainInformation/faculties/faculties';
import Programs from './components/mainInformation/programs/programs';
import StudentStatuses from './components/mainInformation/student_statuses/student_statuses';

function App() {
  return (
    <Router>
      <div id="main-container"
        style={{
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          height: '100%'
        }}
      >
        <HorizontalNav />
        <Routes>
          <Route path="/students" element={<MainInformation />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/student-statuses" element={<StudentStatuses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;