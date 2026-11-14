export const NO_FLAG = "__none__";

export const SORT_OPTIONS = {
  newest: { label: "Newest first", compare: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
  oldest: { label: "Oldest first", compare: (a, b) => new Date(a.created_at) - new Date(b.created_at) },
  mostUpvotes: { label: "Most upvotes", compare: (a, b) => b.upvotes_count - a.upvotes_count },
  leastUpvotes: { label: "Least upvotes", compare: (a, b) => a.upvotes_count - b.upvotes_count },
};

export const DEFAULT_FILTERS = { sortBy: "newest", flag: "all", titleQuery: "" };

export const applyFilters = (posts, { sortBy, flag, titleQuery }) => {
  const query = titleQuery.trim().toLowerCase();

  return posts
    .filter((p) => {
      if (flag === "all") return true;
      if (flag === NO_FLAG) return !p.flag;
      return p.flag === flag;
    })
    .filter((p) => !query || p.title?.toLowerCase().includes(query))
    .sort(SORT_OPTIONS[sortBy].compare);
};