import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import FarmBlogForm from './FarmBlogForm.jsx'
import { deletePost, getPostById } from '../utils/supabase_queries.js'

const FarmBlogDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [postResult, setPostResult] = useState({
    id: null,
    post: null,
    error: '',
  })

  // The detail route loads the post, then reuses the shared form in read-only mode.
  useEffect(() => {
    let isCurrent = true

    getPostById(id).then(({ data, error }) => {
      if (!isCurrent) return

      setPostResult({
        id,
        post: data,
        error: error?.message ?? (data ? '' : 'Post not found.'),
      })
    })

    return () => {
      isCurrent = false
    }
  }, [id])

  const isLoading = postResult.id !== id
  const post = isLoading ? null : postResult.post
  const loadError = isLoading ? '' : postResult.error

  const handleDelete = async () => {
    // Supabase RLS decides whether this browser identity owns the post.
    const result = await deletePost(id)

    if (result.error) return result
    if (!result.data) return { error: new Error('The post was not deleted.') }

    navigate('/farm-blog', { replace: true })
    return { error: null }
  }

  if (isLoading) {
    return (
      <main className="farm-blog-page">
        <p role="status">Loading post…</p>
      </main>
    )
  }

  if (loadError || !post) {
    return (
      <main className="farm-blog-page">
        <section className="farm-blog-card">
          <p className="farm-blog-alert" role="alert">
            {loadError || 'Post not found.'}
          </p>
          <Link className="farm-blog-button farm-blog-button--secondary" to="/farm-blog">
            Back to the feed
          </Link>
        </section>
      </main>
    )
  }

  return (
    <FarmBlogForm
      key={post.id}
      mode="view"
      post={post}
      onDelete={handleDelete}
    />
  )
}

export default FarmBlogDetails
