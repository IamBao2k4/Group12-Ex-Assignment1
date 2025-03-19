import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HorizontalNav from './components/horizontalNav/horizontalNav';
import MainInformation from './components/mainInformation/mainInformation';
import Students from './components/mainInformation/students/show-list-students/students';
import Faculties from './components/mainInformation/faculties/faculties';

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
          <Route path="/" element={<MainInformation />}>
            <Route index element={<Students searchString="" />} />
            <Route path="students" element={<Students searchString="" />} />
          </Route>
          <Route path="faculties" element={<Faculties />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;