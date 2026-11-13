import FeedControls from "./FeedControls";

const FarmFeed = ({ posts=[] }) => {
  return (
    <>
    <div className="feed">
        {posts.map((post) => (
            <div key={post.id} className="feed__post">
                <h2 className="feed__post-title">{post.title}</h2>
                <p className="feed__post-date">{new Date(post.created_at).toLocaleString()}</p>
                <p className="feed__post-upvotes">Upvotes: {post.upvotes_count}</p>
            </div>
        ))}
    </div>
    </>

  );
}
export default FarmFeed