import { Outlet } from 'react-router'
import FarmHeader from './components/FarmHeader.jsx'

const App = () => {
  return (
    <>
      {/* Keep shared navigation here; the current route's page appears in Outlet. */}
      <FarmHeader />
      <Outlet />
    </>
  )
}

export default App
