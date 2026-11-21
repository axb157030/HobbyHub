import { lazy } from 'react'

export const AddFarmForum = lazy(() => import('../components/AddFarmForum.jsx'))
export const FarmForumDetails = lazy(
  () => import('../components/FarmForumDetails.jsx'),
)
export const EditFarmForum = lazy(() => import('../components/EditFarmForum.jsx'))
