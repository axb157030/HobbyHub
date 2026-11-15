const UpvoteIcon = ({ size = 16, className = "" }) => (
  <svg
    className={`upvote-icon ${className}`}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 3.5 20 13h-5v7.5H9V13H4z" />
  </svg>
);

export default UpvoteIcon;