import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import FarmFeed from './components/FarmFeed.jsx'
import {
  AddFarmBlog,
  EditFarmBlog,
  FarmBlogDetails,
} from './routes/FarmBlogRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<p role="status">Loading page…</p>}>
        {/* Nested pages share App's header; the URL chooses the page inside its Outlet. */}
        <Routes>
          <Route path="/farm-blog" element={<App />}>
            <Route index element={<FarmFeed />} />
            <Route path="add" element={<AddFarmBlog />} />
            <Route path=":id" element={<FarmBlogDetails />} />
            <Route path=":id/edit" element={<EditFarmBlog />} />
          </Route>
          <Route path="*" element={<Navigate to="/farm-blog" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
