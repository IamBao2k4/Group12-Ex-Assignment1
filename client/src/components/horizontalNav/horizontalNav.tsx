import './horizontalNav.css';
import NavItem from './navigation/navItem/navItem';
import { FaUser, FaBook, FaChalkboardTeacher, FaBuilding, FaChartBar, FaCog, FaGraduationCap, FaUserCheck, FaLayerGroup } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

const HorizontalNav = () => {
    const { t } = useTranslation();

    return (
        <div className="horizontal-nav">
            <h1 className="horizontal-nav-title">
                {t('nav.title')}
            </h1>
            <div className="nav-container">
                <Link to="/students">
                    <NavItem name={t('nav.student')} icon={<FaUser />} />
                </Link>
                <Link to="/courses">
                    <NavItem name={t('nav.courses')} icon={<FaBook />} />
                </Link>
                <Link to="/open-classes">
                    <NavItem name={t('nav.openClasses')} icon={<FaLayerGroup />} />
                </Link>
                <Link to="/faculties">
                    <NavItem name={t('nav.faculty')} icon={<FaChalkboardTeacher />} />
                </Link>
                <Link to="/programs">
                    <NavItem name={t('nav.programs')} icon={<FaGraduationCap />} />
                </Link>
                <Link to="/student-statuses">
                    <NavItem name={t('nav.studentStatus')} icon={<FaUserCheck />} />
                </Link>
                <Link to="/instructors">
                    <NavItem name={t('nav.instructors')} icon={<FaChalkboardTeacher />} />
                </Link>
                <Link to="/departments">
                    <NavItem name={t('nav.departments')} icon={<FaBuilding />} />
                </Link>
                <Link to="/reports">
                    <NavItem name={t('nav.reports')} icon={<FaChartBar />} />
                </Link>
                <Link to="/settings">
                    <NavItem name={t('nav.settings')} icon={<FaCog />} />
                </Link>
            </div>
            <div className="language-switcher-container">
                <LanguageSwitcher />
            </div>
        </div>
    )
}

export default HorizontalNav;