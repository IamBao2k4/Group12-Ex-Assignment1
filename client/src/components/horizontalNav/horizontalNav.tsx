import './horizontalNav.css';
import NavItem from './navigation/navItem/navItem';
import { FaUser, FaBook, FaChalkboardTeacher, FaGraduationCap, FaUserCheck, FaLayerGroup } from 'react-icons/fa';
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
                <Link to="/students" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name={t('nav.student')} icon={<FaUser />} />
                </Link>
                <Link to="/courses" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name={t('nav.courses')} icon={<FaBook />} />
                </Link>
                <Link to="/open-classes" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name={t('nav.openClasses')} icon={<FaLayerGroup />} />
                </Link>
                <Link to="/faculties" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name={t('nav.faculty')} icon={<FaChalkboardTeacher />} />
                </Link>
                <Link to="/programs" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name={t('nav.programs')} icon={<FaGraduationCap />} />
                </Link>
                <Link to="/student-statuses" style={{ textDecoration: 'none', color: 'black', width: '100%' }}>
                    <NavItem name={t('nav.studentStatus')} icon={<FaUserCheck />} />
                </Link>
            </div>
            <div className="language-switcher-container">
                <LanguageSwitcher />
            </div>
        </div>
    )
}

export default HorizontalNav;