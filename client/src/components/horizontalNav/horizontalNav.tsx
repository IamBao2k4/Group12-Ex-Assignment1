import './horizontalNav.css';
import NavItem from './navigation/navItem/navItem';
import { FaUser, FaBook, FaChalkboardTeacher, FaBuilding, FaChartBar, FaCog, FaGraduationCap, FaUserCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HorizontalNav = () => {
    return (
        <div className="horizontal-nav">
            <p className="horizontal-nav-title">
                Student<span style={{ color: 'var(--secondary)' }}>Manager</span>
            </p>
            <div className="nav-container">
                <Link to="/students">
                    <NavItem name="Student" icon={<FaUser />} />
                </Link>
                <Link to="/courses">
                    <NavItem name="Courses" icon={<FaBook />} />
                </Link>
                <Link to="/faculties">
                    <NavItem name="Faculty" icon={<FaChalkboardTeacher />} />
                </Link>
                <Link to="/programs">
                    <NavItem name="Programs" icon={<FaGraduationCap />} />
                </Link>
                <Link to="/student-statuses">
                    <NavItem name="Student Status" icon={<FaUserCheck />} />
                </Link>
                <Link to="/instructors">
                    <NavItem name="Instructors" icon={<FaChalkboardTeacher />} />
                </Link>
                <Link to="/departments">
                    <NavItem name="Departments" icon={<FaBuilding />} />
                </Link>
                <Link to="/reports">
                    <NavItem name="Reports" icon={<FaChartBar />} />
                </Link>
                <Link to="/settings">
                    <NavItem name="Settings" icon={<FaCog />} />
                </Link>
            </div>
        </div>
    )
}

export default HorizontalNav;