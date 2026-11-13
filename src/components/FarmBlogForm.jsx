import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Link } from 'react-router'
import './FarmBlogForm.css'

const getValues = (post) => ({
  title: post?.title ?? '',
  content: post?.content ?? '',
  imageUrl: post?.image_url ?? '',
  flag: post?.flag ?? '',
  videoUrl: post?.video_url ?? '',
  repostId: post?.repost_id ?? '',
})

const formatDate = (value) => {
  if (!value) return ''

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

// Unlike a plain textarea, TipTap keeps formatting such as bold text and lists.
// It saves that document as HTML, and the same editor can show it read-only later.
const BlogEditor = ({ content, onChange, readOnly = false, labelId }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    editable: !readOnly,
    editorProps: {
      attributes: {
        spellcheck: 'true',
        lang: 'en',
        class: 'farm-blog-editor__prose',
        ...(readOnly
          ? { 'aria-label': 'Post content' }
          : { 'aria-labelledby': labelId }),
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(
        currentEditor.isEmpty ? '' : currentEditor.getHTML(),
      )
    },
  })

  useEffect(() => {
    if (!editor) return

    // When a post finishes loading, put its saved story into the editor.
    const nextContent = content || ''
    const currentContent = editor.isEmpty ? '' : editor.getHTML()

    if (currentContent !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false })
    }
  }, [content, editor])

  useEffect(() => {
    editor?.setEditable(!readOnly)
  }, [editor, readOnly])

  return (
    <div
      className={`farm-blog-editor${readOnly ? ' farm-blog-editor--readonly' : ''}`}
    >
      {!readOnly && editor && (
        <div className="farm-blog-editor__toolbar" role="toolbar" aria-label="Text formatting">
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Bold"
            title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Italic"
            title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Heading"
            title="Heading"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Bulleted list"
            title="Bulleted list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Numbered list"
            title="Numbered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Block quote"
            title="Block quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </button>
          <span className="farm-blog-editor__toolbar-spacer" />
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Undo"
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
          >
            Undo
          </button>
          <button
            type="button"
            className="farm-blog-editor__tool"
            aria-label="Redo"
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
          >
            Redo
          </button>
        </div>
      )}
      <EditorContent editor={editor} className="farm-blog-editor__content" />
    </div>
  )
}

const FarmBlogForm = ({
  mode = 'create',
  post = null,
  onSave,
  onDelete,
  cancelTo,
}) => {
  // The same fields are reused for a new post, an edit, and a read-only post page.
  const [values, setValues] = useState(() => getValues(post))
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [titleError, setTitleError] = useState('')
  const isViewing = mode === 'view'

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setTitleError('')

    // Catch blank-looking titles here so the user gets a clear message before saving.
    const title = values.title.trim()
    if (!title) {
      setTitleError('A title is required.')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await onSave({
        ...values,
        title,
        content: values.content.trim() ? values.content : null,
        imageUrl: values.imageUrl.trim() || null,
        flag: values.flag || null,
        videoUrl: values.videoUrl.trim() || null,
        repostId: values.repostId.trim() || null,
      })

      if (error) setErrorMessage(error.message || 'The post could not be saved.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'The post could not be saved.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return

    setErrorMessage('')
    setIsDeleting(true)
    try {
      const { error } = await onDelete()
      if (error) {
        setErrorMessage(error.message || 'The post could not be deleted.')
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'The post could not be deleted.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (isViewing && post) {
    return (
      <main className="farm-blog-page">
        <article className="farm-blog-card">
          <div className="farm-blog-card__actions">
            <Link
              className="farm-blog-button farm-blog-button--secondary"
              to={`/farm-blog/${post.id}/edit`}
            >
              Edit post
            </Link>
            <button
              className="farm-blog-button farm-blog-button--danger"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting…' : 'Delete post'}
            </button>
          </div>

          {errorMessage && (
            <p className="farm-blog-alert" role="alert">
              {errorMessage}
            </p>
          )}

          <p className="farm-blog-eyebrow">Farm journal</p>
          <h1 className="farm-blog-title">{post.title}</h1>
          <div className="farm-blog-meta">
            {post.created_at && (
              <time dateTime={post.created_at}>
                Posted {formatDate(post.created_at)}
              </time>
            )}
            {post.updated_at && post.updated_at !== post.created_at && (
              <span>Updated {formatDate(post.updated_at)}</span>
            )}
            <span>{post.upvotes_count ?? 0} upvotes</span>
            {post.flag && (
              <span className="farm-blog-badge">{post.flag}</span>
            )}
          </div>

          {post.repost_id && (
            <p className="farm-blog-repost">
              Reposted from{' '}
              <Link to={`/farm-blog/${post.repost_id}`}>
                the original post
              </Link>
            </p>
          )}

          {post.content && (
            <section className="farm-blog-reading">
              <BlogEditor content={post.content} readOnly />
            </section>
          )}

          {post.image_url && (
            <img
              className="farm-blog-image"
              src={post.image_url}
              alt={post.title}
              loading="lazy"
            />
          )}

          {post.video_url && (
            <a
              className="farm-blog-video-link"
              href={post.video_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch the linked video
            </a>
          )}
        </article>
      </main>
    )
  }

  const isEditing = mode === 'edit'

  return (
    <main className="farm-blog-page">
      <section className="farm-blog-card">
        <header className="farm-blog-page__header">
          <p className="farm-blog-eyebrow">
            {isEditing ? 'Your farm journal' : 'Share what you’ve learned'}
          </p>
          <h1 className="farm-blog-title">
            {isEditing ? 'Edit your post' : 'Write a farm post'}
          </h1>
          <p className="farm-blog-intro">
            Share a practical idea, question, or lesson from the field.
          </p>
        </header>

        {errorMessage && (
          <p className="farm-blog-alert" role="alert">
            {errorMessage}
          </p>
        )}

        <form className="farm-blog-form" onSubmit={handleSave}>
          <div className="farm-blog-field">
            <label htmlFor="farm-blog-title">Title</label>
            <input
              id="farm-blog-title"
              name="title"
              type="text"
              value={values.title}
              onChange={(event) => {
                updateValue('title', event.target.value)
                if (titleError) setTitleError('')
              }}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'farm-blog-title-error' : undefined}
              required
              autoComplete="off"
              placeholder="A clear, specific title"
            />
            {titleError && (
              <span
                className="farm-blog-field-error"
                id="farm-blog-title-error"
              >
                {titleError}
              </span>
            )}
          </div>

          <div className="farm-blog-field">
            <span className="farm-blog-label" id="farm-blog-content-label">
              Story <span className="farm-blog-optional">(optional)</span>
            </span>
            <BlogEditor
              content={values.content}
              onChange={(content) => updateValue('content', content)}
              labelId="farm-blog-content-label"
            />
            <p className="farm-blog-help">
              Use the formatting tools to make your post easier to read.
            </p>
          </div>

          <div className="farm-blog-field">
            <label htmlFor="farm-blog-image-url">
              Image URL <span className="farm-blog-optional">(optional)</span>
            </label>
            <input
              id="farm-blog-image-url"
              name="imageUrl"
              type="url"
              value={values.imageUrl}
              onChange={(event) => updateValue('imageUrl', event.target.value)}
              placeholder="https://example.com/field.jpg"
            />
          </div>

          <div className="farm-blog-field">
            <label htmlFor="farm-blog-flag">
              Topic <span className="farm-blog-optional">(optional)</span>
            </label>
            <select
              id="farm-blog-flag"
              name="flag"
              value={values.flag}
              onChange={(event) => updateValue('flag', event.target.value)}
            >
              <option value="">No topic</option>
              <option value="Question">Question</option>
              <option value="Opinion">Opinion</option>
            </select>
          </div>

          <div className="farm-blog-field">
            <label htmlFor="farm-blog-video-url">
              Video URL <span className="farm-blog-optional">(optional)</span>
            </label>
            <input
              id="farm-blog-video-url"
              name="videoUrl"
              type="url"
              value={values.videoUrl}
              onChange={(event) => updateValue('videoUrl', event.target.value)}
              placeholder="https://example.com/video"
            />
          </div>

          {!isEditing && (
            <div className="farm-blog-field">
              <label htmlFor="farm-blog-repost-id">
                Repost an existing post{' '}
                <span className="farm-blog-optional">(optional)</span>
              </label>
              <input
                id="farm-blog-repost-id"
                name="repostId"
                type="text"
                value={values.repostId}
                onChange={(event) => updateValue('repostId', event.target.value)}
                placeholder="Paste the original post ID"
              />
            </div>
          )}

          <div className="farm-blog-form__actions">
            <button
              className="farm-blog-button farm-blog-button--primary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? 'Saving…'
                : isEditing
                  ? 'Save changes'
                  : 'Publish post'}
            </button>
            <Link
              className="farm-blog-button farm-blog-button--secondary"
              to={cancelTo || (isEditing && post ? `/farm-blog/${post.id}` : '/farm-blog')}
            >
              Cancel
            </Link>
            {isEditing && post && (
              <span className="farm-blog-upvote-note">
                Upvotes: {post.upvotes_count ?? 0} · Cannot be edited
              </span>
            )}
          </div>
        </form>
      </section>
    </main>
  )
}

export default FarmBlogForm
