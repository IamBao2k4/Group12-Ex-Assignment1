import  HorizontalNav  from './components/horizontalNav/horizontalNav'
import  MainInformation  from './components/mainInformation/mainInformation'

function App() {
  return (
    <div id="main-container"
      style={{
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        height: '100%'
      }}
      >
      <HorizontalNav/>
      <MainInformation />
    </div>
  )
}

export default App
