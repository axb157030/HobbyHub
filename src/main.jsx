import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import FarmFeed from './components/FarmFeed.jsx'
import {
  AddFarmForum,
  EditFarmForum,
  FarmForumDetails,
} from './routes/FarmForumRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<p role="status">Loading page…</p>}>
        {/* Nested pages share App's header; the URL chooses the page inside its Outlet. */}
        <Routes>
          <Route path="/farm-forum" element={<App />}>
            <Route index element={<FarmFeed />} />
            <Route path="add" element={<AddFarmForum />} />
            <Route path=":id" element={<FarmForumDetails />} />
            <Route path=":id/edit" element={<EditFarmForum />} />
          </Route>
          <Route path="*" element={<Navigate to="/farm-forum" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
