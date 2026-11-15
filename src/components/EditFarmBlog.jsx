import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import FarmBlogForm from './FarmBlogForm.jsx'
import { getPostById, updatePost, checkAuthorOfPostSameAsOneLoggedIn } from '../utils/supabase_queries.js'

const EditFarmBlog = () => {
  // The URL tells this page which post to load.
  const { id } = useParams()
  const navigate = useNavigate()
  const [postResult, setPostResult] = useState({
    id: null,
    post: null,
    error: '',
  })

  // Load the saved post first; the form below starts with its current values.
  useEffect(() => {
    // Ignore a slow response if the user leaves this post before it finishes loading.
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

  const handleSave = async (values) => {
    // This check gives a clear message; the database's RLS policy is the real lock.
    const isRealAuthor = await checkAuthorOfPostSameAsOneLoggedIn(id)

    if (isRealAuthor.error) return { error: isRealAuthor.error }

    if (!isRealAuthor.data) {
      return { error: new Error('Only the author of the post can edit the post') }
    }
    const result = await updatePost(
      id,
      values.title,
      values.content,
      values.imageUrl,
      values.flag,
      values.videoUrl,
    )
    if (result.error || !result.data) {
      return {
        error:
          result.error ?? new Error('The updated post was not returned.'),
      }
    }

    navigate(`/farm-blog/${id}`)
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
      mode="edit"
      post={post}
      onSave={handleSave}
      cancelTo={`/farm-blog/${id}`}
    />
  )
}

export default EditFarmBlog
