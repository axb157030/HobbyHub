import { ensureAnonymousSession, supabase } from './supabase.js'

const getSessionError = async () => {
  const { error } = await ensureAnonymousSession()
  return error
}

const getPublicFeed = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, content, image_url, upvotes_count, repost_id, created_at, updated_at, flag, video_url',
    )
    .order('created_at', { ascending: false })

  return { data, error }
}

const getPostById = async (postId) => {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, content, image_url, upvotes_count, repost_id, created_at, updated_at, flag, video_url',
    )
    .eq('id', postId)
    .single()

  return { data, error }
}

const getPostUpvoteStatus = async (postId) => {
  const sessionError = await getSessionError()
  if (sessionError) return { data: null, error: sessionError }

  const { data, error } = await supabase
    .from('post_votes')
    .select('post_id')
    .eq('post_id', postId)
    .maybeSingle()

  return { data: Boolean(data), error }
}

/* 
The column default author_id uuid default auth.uid() fills in the current 
user’s ID when the INSERT leaves author_id out. auth.uid() is a Supabase-provided 
SQL function that reads the ID from the request’s session.
*/

const createPost = async (
  title,
  content,
  imageUrl = null,
  flag = null,
  videoUrl = null,
  repostId = null,
) => {
  const sessionError = await getSessionError()
  if (sessionError) return { data: null, error: sessionError }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      image_url: imageUrl,
      flag,
      video_url: videoUrl,
      repost_id: repostId,
    })
    .select(
      'id, title, content, image_url, upvotes_count, repost_id, created_at, updated_at, flag, video_url',
    )
    .single()

  return { data, error }
}

/* 
When editing or deleting a post
the post's author id is checked to see whether it is the same as the Supabase anonymous user id
to ensure users can only edit and delete their posts.
Thank you `using (author_id = (select auth.uid()))`
*/

const updatePost = async (
  postId,
  title,
  content,
  imageUrl,
  flag,
  videoUrl,
) => {
  const sessionError = await getSessionError()
  if (sessionError) return { data: null, error: sessionError }

  const updates = { title, content }

  if (imageUrl !== undefined) updates.image_url = imageUrl
  if (flag !== undefined) updates.flag = flag
  if (videoUrl !== undefined) updates.video_url = videoUrl

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select(
      'id, title, content, image_url, upvotes_count, repost_id, created_at, updated_at, flag, video_url',
    )
    .single()

  return { data, error }
}

const deletePost = async (postId) => {
  const sessionError = await getSessionError()
  if (sessionError) return { data: null, error: sessionError }

  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .select('id')
    .single()

  return { data, error }
}

const togglePostUpvote = async (postId) => {
  const sessionError = await getSessionError()
  if (sessionError) return { data: null, error: sessionError }

  const { data, error } = await supabase.rpc('toggle_post_upvote', {
    target_post_id: postId,
  })

  return { data, error }
}

const getComments = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, content, created_at, updated_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  return { data, error }
}

const createComment = async (postId, content) => {
  const sessionError = await getSessionError()
  if (sessionError) return { data: null, error: sessionError }

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, content })
    .select('id, post_id, content, created_at, updated_at')
    .single()

  return { data, error }
}

const deleteComment = async (commentId) => {
  const sessionError = await getSessionError()
  if (sessionError) return { data: null, error: sessionError }

  const { data, error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .select('id')
    .single()

  return { data, error }
}

export {
  getPublicFeed,
  getPostById,
  getPostUpvoteStatus,
  createPost,
  updatePost,
  deletePost,
  togglePostUpvote,
  getComments,
  createComment,
  deleteComment,
}
