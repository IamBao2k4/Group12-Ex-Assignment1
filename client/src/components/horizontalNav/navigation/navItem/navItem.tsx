import './navItem.css';

interface NavItemProps {
    name: string;
    icon: React.ReactNode;
}

const NavItem = ({ name, icon }: NavItemProps) => {
    return (
        <div className="nav-item-container">
            <a href="#" className="nav-item">
                {icon}
                <span className="nav-item-text">{name}</span>
            </a>
        </div>
    )
}

export default NavItem;