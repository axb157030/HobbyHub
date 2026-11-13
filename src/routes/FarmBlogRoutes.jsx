import { lazy } from 'react'

export const AddFarmBlog = lazy(() => import('../components/AddFarmBlog.jsx'))
export const FarmBlogDetails = lazy(
  () => import('../components/FarmBlogDetails.jsx'),
)
export const EditFarmBlog = lazy(() => import('../components/EditFarmBlog.jsx'))
