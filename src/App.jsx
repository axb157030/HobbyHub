import { Outlet } from 'react-router'
import FarmHeader from './components/FarmHeader.jsx'

const App = () => {


  return (
    <>
    <FarmHeader/>
    <Outlet/>
    </>
  )
}

export default App
