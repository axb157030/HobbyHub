import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import FarmForumForm from './FarmForumForm.jsx'
import CommentSection from './CommentSection.jsx'
import { deletePost, getPostById, checkAuthorOfPostSameAsOneLoggedIn } from '../utils/supabase_queries.js'

const FarmForumDetails = () => {
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
    // Check here for a friendly message; RLS still enforces ownership in the database.
const isRealAuthor = await checkAuthorOfPostSameAsOneLoggedIn(id)

  if (isRealAuthor.error) return { error: isRealAuthor.error }

  if (!isRealAuthor.data) {
    return { error: new Error('Only the author of the post can delete the post') }
  }
    const result = await deletePost(id)

    if (result.error) return result
    if (!result.data) return { error: new Error('The post was not deleted.') }

    navigate('/farm-forum', { replace: true })
    return { error: null }
  }

  if (isLoading) {
    return (
      <main className="farm-forum-page">
        <p role="status">Loading post…</p>
      </main>
    )
  }

  if (loadError || !post) {
    return (
      <main className="farm-forum-page">
        <section className="farm-forum-card">
          <p className="farm-forum-alert" role="alert">
            {loadError || 'Post not found.'}
          </p>
          <Link className="farm-forum-button farm-forum-button--secondary" to="/farm-forum">
            Back to the feed
          </Link>
        </section>
      </main>
    )
  }

  return (
    <>
    {/* Keep comments on the post page and pass the ID so they load for this post only. */}
    <FarmForumForm
      key={post.id}
      mode="view"
      post={post}
      onDelete={handleDelete}
    />
    <br />
    <CommentSection postId={id}/>
    </>

  )
}

export default FarmForumDetails
