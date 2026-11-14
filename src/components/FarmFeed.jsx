import { useState, useEffect } from "react";
import FeedControls from "./FeedControls";
import FarmBlogCard from "./FarmBlogCard";
import { DEFAULT_FILTERS, applyFilters } from "./feedFilters";
import { getPublicFeed } from "../utils/supabase_queries.js";
import "./FarmFeed.css";
import { Link } from "react-router";

const FarmFeed = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false; // ignore the result if the component unmounts

    const loadFeed = async () => {
      setLoading(true);
      const { data, error } = await getPublicFeed();
      if (cancelled) return;

      if (error) {
        setError(error.message ?? "Something went wrong loading the feed.");
        setPosts([]);
      } else {
        setError("");
        setPosts(data ?? []);
      }
      setLoading(false);
    };

    loadFeed();

    return () => {
      cancelled = true;
    };
  }, []);

  // Plain derived value: recomputed each render, no effect, no memo
  const visiblePosts = applyFilters(posts, filters);

  return (
    <section className="farm-feed">
      <header className="farm-feed__header">
        <h2 className="farm-feed__title">Farm Feed</h2>
        <p className="farm-feed__subtitle">Stories, tips, and updates from the field.</p>
      </header>

      <FeedControls
        filters={filters}
        onFiltersChange={setFilters}
        posts={posts}
        visibleCount={visiblePosts.length}
      />

      {loading && (
        <div className="farm-feed__grid" aria-busy="true" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="farm-feed__skeleton" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="farm-feed__status farm-feed__status--error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && visiblePosts.length === 0 && (
        <p className="farm-feed__status">
          {posts.length === 0 ? "No posts yet." : "No posts match your filters."}
        </p>
      )}

      {!loading && !error && visiblePosts.length > 0 && (
        <div className="farm-feed__grid">
          {visiblePosts.map((post) => (
            <Link to={`/farm-blog/${post.id}`}>
              <FarmBlogCard key={post.id} post={post} />
              </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default FarmFeed;