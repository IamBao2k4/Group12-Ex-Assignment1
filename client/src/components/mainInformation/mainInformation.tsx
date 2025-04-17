import { useState } from 'react';
import Header from './header/header';
import './mainInformation.css';
import Students from './students/students';

const MainInformation = () => {
  const [searchString, setSearchString] = useState("");

  function searchHandler(searchString: string) {
    setSearchString(searchString);
  }

  return (
    <div className="main-information">
      <Header searchHandler={searchHandler}/>
      <div className="main-information-content">
        <Students searchString={searchString} />
      </div>
    </div>
  )
}

export default MainInformation;