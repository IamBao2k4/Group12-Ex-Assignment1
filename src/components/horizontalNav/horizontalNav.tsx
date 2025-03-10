import './horizontalNav.css';
import NavItem from './navigation/navItem/navItem';
import { FaUser, FaBook, FaChalkboardTeacher, FaBuilding, FaChartBar, FaCog } from 'react-icons/fa';

const HorizontalNav = () => {
    return (
        <div className="horizontal-nav">
            <p className="horizontal-nav-title">
                Student<span style={{ color: 'var(--secondary)' }}>Manager</span>
            </p>
            <div className="nav-container">
                <NavItem name="Student" icon={<FaUser />} />
                <NavItem name="Courses" icon={<FaBook />} />
                <NavItem name="Instructors" icon={<FaChalkboardTeacher />} />
                <NavItem name="Departments" icon={<FaBuilding />} />
                <NavItem name="Reports" icon={<FaChartBar />} />
                <NavItem name="Settings" icon={<FaCog />} />
            </div>
        </div>
    )
}

export default HorizontalNav;