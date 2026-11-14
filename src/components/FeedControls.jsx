import "./FeedControls.css";
import { DEFAULT_FILTERS, NO_FLAG, SORT_OPTIONS } from "./feedFilters";

const FeedControls = ({ filters, onFiltersChange, posts = [], visibleCount }) => {
  const { sortBy, flag, titleQuery } = filters;

  const update = (field) => (e) =>
    onFiltersChange({ ...filters, [field]: e.target.value });

  const flagOptions = [...new Set(posts.map((p) => p.flag).filter(Boolean))].sort();

  return (
    <div className="feed-controls">
      <form className="feed-controls__form" onSubmit={(e) => e.preventDefault()}>
        <div className="feed-controls__field feed-controls__field--grow">
          <label htmlFor="feed-title">Search title</label>
          <input
            id="feed-title"
            type="search"
            placeholder="e.g. cover crops"
            value={titleQuery}
            onChange={update("titleQuery")}
            autoComplete="off"
          />
        </div>

        <div className="feed-controls__field">
          <label htmlFor="feed-flag">Flag</label>
          <select id="feed-flag" value={flag} onChange={update("flag")}>
            <option value="all">All posts</option>
            <option value={NO_FLAG}>No flag</option>
            {flagOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="feed-controls__field">
          <label htmlFor="feed-sort">Sort by</label>
          <select id="feed-sort" value={sortBy} onChange={update("sortBy")}>
            {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="feed-controls__reset"
          onClick={() => onFiltersChange(DEFAULT_FILTERS)}
        >
          Reset
        </button>
      </form>

      <p className="feed-controls__count" aria-live="polite">
        Showing {visibleCount} of {posts.length} posts
      </p>
    </div>
  );
};

export default FeedControls;