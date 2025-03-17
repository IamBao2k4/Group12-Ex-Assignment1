import React, { useRef } from 'react';
import Header from './header/header';
import './mainInformation.css';
import Students from './students/show-list-students/students';
import { createRoot, Root } from 'react-dom/client';

const MainInformation = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<Root | null>(null);

  function searchHandler(searchString: string) {
    if (rootRef.current) {
      rootRef.current.render(<Students searchString={searchString} />);
    }
  }

  React.useEffect(() => {
    if (!rootRef.current) {
      const container = document.querySelector('.main-information-content') as HTMLElement;
      containerRef.current = container;
      rootRef.current = createRoot(container);
      rootRef.current.render(<Students searchString={" "} />);
    }
  }, []);

  return (
    <div className="main-information">
      <Header searchHandler={searchHandler}/>
      <div className="main-information-content">
        <Students searchString={" "} />
      </div>
    </div>
  )
}

export default MainInformation;