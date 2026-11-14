import "./FarmBlogCard.css";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}; // Thank you, https://stackoverflow.com/questions/48689876/how-to-convert-timestamp-in-react-js

const FarmBlogCard = ({ post }) => {
  return (
    <article
      className="farm-card"
      tabIndex={0}
      role="button"
    >
      <h3 className="farm-card__title">{post.title}</h3>

      <div className="farm-card__meta">
        <span className="farm-card__upvotes" aria-label={`${post.upvotes_count} upvotes`}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M12 4l8 9h-5v7H9v-7H4z" fill="currentColor" />
          </svg>
          {post.upvotes_count}
        </span>

        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
      </div>
    </article>
  );
};

export default FarmBlogCard;