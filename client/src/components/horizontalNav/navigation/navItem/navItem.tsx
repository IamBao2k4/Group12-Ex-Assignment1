import './navItem.css';

interface NavItemProps {
    name: string;
    icon: React.ReactNode;
}

const NavItem = ({ name, icon }: NavItemProps) => {
    return (
        <div className="nav-item-container">
            <div className="nav-item">
                {icon}
                <span className="nav-item-text">{name}</span>
            </div>
        </div>
    )
}

export default NavItem;