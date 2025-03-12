import Header from './header/header';
import './mainInformation.css';
import Students from './students/show-list-students/students';

const MainInformation = () => {
  return (
    <div className="main-information">
      <Header />
      <div className="main-information-content">
        <Students />
      </div>
    </div>
  )
}

export default MainInformation;