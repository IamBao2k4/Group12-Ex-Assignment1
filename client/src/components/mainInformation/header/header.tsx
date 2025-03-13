import './header.css'
import SearchIcon from '@mui/icons-material/Search';

interface HeaderProps {
  searchHandler: (query: string) => void
}

const Header: React.FC<HeaderProps> = ({ searchHandler }) => {
  function searchHandlerFunc(e: React.ChangeEvent<HTMLInputElement>) {
    searchHandler(e.target.value)
  }

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-search">
          <input type="text" placeholder="Search" onChange={searchHandlerFunc}/>
          <SearchIcon className="header-search-icon" />
        </div>
        <div className="header-profile">
            <img src="/images/ME.jpg"/>
            <p className="header-profile-name">John Doe</p>
            <p className="header-profile-role">Admin</p>
        </div>
      </div>
    </div>
  )
}

export default Header
