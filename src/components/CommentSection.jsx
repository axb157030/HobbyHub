import { useCallback, useEffect, useState } from 'react'
import {
  createComment,
  deleteComment,
  getComments,
  getCurrentUserId,
  updateComment,
} from '../utils/supabase_queries.js'
import './CommentSection.css'

const formatDate = (value) => {
  if (!value) return ''

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const CommentSection = ({ postId }) => {
  const [commentsResult, setCommentsResult] = useState({
    postId: null,
    comments: [],
  })
  const [currentUserId, setCurrentUserId] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [busyCommentId, setBusyCommentId] = useState(null)
  const [loadedPostId, setLoadedPostId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const comments =
    commentsResult.postId === postId ? commentsResult.comments : []
  const isLoading = loadedPostId !== postId

  const retrieveComments = useCallback(async (isCurrent = () => true) => {
    const { data, error } = await getComments(postId)
    if (!isCurrent()) return false

    if (error) {
      setErrorMessage(error.message)
      return false
    }

    setCommentsResult({ postId, comments: data ?? [] })
    setErrorMessage('')
    return true
  }, [postId])

  useEffect(() => {
    let isCurrent = true

    const loadComments = async () => {
      const { data: userId, error } = await getCurrentUserId()
      if (!isCurrent) return

      setErrorMessage('')
      if (error) {
        setErrorMessage(error.message)
        setLoadedPostId(postId)
        return
      }

      setCurrentUserId(userId)
      await retrieveComments(() => isCurrent)
      if (isCurrent) setLoadedPostId(postId)
    }

    loadComments()

    return () => {
      // Ignore this request if the visitor leaves before it finishes.
      isCurrent = false
    }
  }, [postId, retrieveComments])

  const addComment = async () => {
    const content = newComment.trim()
    if (!content) return

    setErrorMessage('')
    setIsSubmitting(true)
    const { data, error } = await createComment(postId, content)

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    if (!data) {
      setErrorMessage('The comment was not added.')
      setIsSubmitting(false)
      return
    }

    setNewComment('')
    await retrieveComments()
    setIsSubmitting(false)
  }

  const saveComment = async (commentId) => {
    const content = editText.trim()
    if (!content) {
      setErrorMessage('A comment cannot be blank.')
      return
    }

    setErrorMessage('')
    setBusyCommentId(commentId)
    const { data, error } = await updateComment(commentId, content)

    if (error) {
      setErrorMessage(error.message)
      setBusyCommentId(null)
      return
    }

    if (!data) {
      setErrorMessage('The comment was not updated.')
      setBusyCommentId(null)
      return
    }

    setEditingId(null)
    setEditText('')
    await retrieveComments()
    setBusyCommentId(null)
  }

  const removeComment = async (commentId) => {
    setErrorMessage('')
    setBusyCommentId(commentId)
    const { data, error } = await deleteComment(commentId)

    if (error) {
      setErrorMessage(error.message)
      setBusyCommentId(null)
      return
    }

    if (!data) {
      setErrorMessage('The comment was not deleted.')
      setBusyCommentId(null)
      return
    }

    await retrieveComments()
    setBusyCommentId(null)
  }

  return (
    <section className="comment-section">
      <h3 className="comment-section__title">
        Comments <span className="comment-section__count">{comments.length}</span>
      </h3>

      {errorMessage && (
        <p className="comment-alert" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="comment-form">
        <textarea
          className="comment-form__input"
          placeholder="Add a comment..."
          aria-label="Add a comment"
          rows={3}
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        />
        <div className="comment-form__actions">
          <button
            type="button"
            className="btn btn--primary"
            disabled={!newComment.trim() || isSubmitting}
            onClick={addComment}
          >
            {isSubmitting ? 'Posting...' : 'Post comment'}
          </button>
        </div>
      </div>

      <ul className="comment-list">
        {isLoading ? (
          <li className="comment-list__empty" role="status">Loading comments...</li>
        ) : comments.length === 0 ? (
          <li className="comment-list__empty">No comments yet. Be the first!</li>
        ) : (
          comments.map((comment) => {
            // This controls the buttons only; database policies still protect each write.
            const isAuthor = comment.author_id === currentUserId
            const isEdited =
              comment.updated_at &&
              comment.created_at &&
              Date.parse(comment.updated_at) > Date.parse(comment.created_at)

            return (
              <li key={comment.id} className="comment">
                <div className="comment__header">
                  <span className="comment__author">
                    {isAuthor ? 'You' : 'Anonymous'}
                  </span>
                  <span className="comment__date">
                    {formatDate(comment.created_at)}
                  </span>
                  {isEdited && <span className="comment__edited">(edited)</span>}
                </div>

                {editingId === comment.id ? (
                  <div className="comment__edit">
                    <textarea
                      className="comment-form__input"
                      aria-label="Edit comment"
                      rows={3}
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                    />
                    <div className="comment__actions">
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={busyCommentId === comment.id}
                        onClick={() => saveComment(comment.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => {
                          setEditingId(null)
                          setEditText('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment__body">{comment.content}</p>
                )}

                {isAuthor && editingId !== comment.id && (
                  <div className="comment__actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => {
                        setErrorMessage('')
                        setEditingId(comment.id)
                        setEditText(comment.content)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger"
                      disabled={busyCommentId === comment.id}
                      onClick={() => removeComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}

export default CommentSection