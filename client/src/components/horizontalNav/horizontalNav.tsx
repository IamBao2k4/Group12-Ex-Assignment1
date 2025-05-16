import './horizontalNav.css';
import NavItem from './navigation/navItem/navItem';
import { FaUser, FaBook, FaChalkboardTeacher, FaBuilding, FaChartBar, FaCog, FaGraduationCap, FaUserCheck, FaLayerGroup } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HorizontalNav = () => {
    return (
        <div className="horizontal-nav">
            <Link to="/students" style={{ textDecoration: 'none', color: 'black' }}>
                <p className="horizontal-nav-title">
                    Student<span style={{ color: 'var(--secondary)' }}>Manager</span>
                </p>
            </Link>
            <div className="nav-container">
                <Link to="/students" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Students" icon={<FaUser />} />
                </Link>
                <Link to="/courses" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Courses" icon={<FaBook />} />
                </Link>
                <Link to="/open-classes" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Open Classes" icon={<FaLayerGroup />} />
                </Link>
                <Link to="/faculties" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Faculties" icon={<FaChalkboardTeacher />} />
                </Link>
                <Link to="/programs" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Programs" icon={<FaGraduationCap />} />
                </Link>
                <Link to="/student-statuses" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Student Statuses" icon={<FaUserCheck />} />
                </Link>
                <Link to="/instructors" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Instructors" icon={<FaChalkboardTeacher />} />
                </Link>
                <Link to="/departments" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Departments" icon={<FaBuilding />} />
                </Link>
                <Link to="/reports" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Reports" icon={<FaChartBar />} />
                </Link>
                <Link to="/settings" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name="Settings" icon={<FaCog />} />
                </Link>
            </div>
        </div>
    )
}

export default HorizontalNav;