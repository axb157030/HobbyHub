import { useNavigate } from 'react-router'
import FarmBlogForm from './FarmBlogForm.jsx'
import { createPost } from '../utils/supabase_queries.js'

const AddFarmBlog = () => {
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

    navigate(`/farm-blog/${data.id}`)
    return { error: null }
  }

  return (
    <FarmBlogForm
      mode="create"
      onSave={handleSave}
      cancelTo="/farm-blog"
    />
  )
}

export default AddFarmBlog
