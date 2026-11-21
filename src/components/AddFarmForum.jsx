import { useNavigate } from 'react-router'
import FarmForumForm from './FarmForumForm.jsx'
import { createPost } from '../utils/supabase_queries.js'

const AddFarmForum = () => {
  const navigate = useNavigate()

  // This page saves the shared form's values, then opens the post that was created.
  const handleSave = async (values) => {
    const { data, error } = await createPost(
      values.title,
      values.content,
      values.imageUrl,
      values.flag,
      values.videoUrl,
      values.repostId,
    )

    if (error || !data) {
      return {
        error: error ?? new Error('The post was not returned after saving.'),
      }
    }

    navigate(`/farm-forum/${data.id}`)
    return { error: null }
  }

  return (
    <FarmForumForm
      mode="create"
      onSave={handleSave}
      cancelTo="/farm-forum"
    />
  )
}

export default AddFarmForum
