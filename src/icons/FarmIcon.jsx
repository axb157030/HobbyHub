// FarmIcon.jsx
export default function FarmIcon({ size = 28, accent = "var(--orange)", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* roof */}
      <path d="M2.5 11 L5.5 6.5 L12 4 L18.5 6.5 L21.5 11" />
      {/* barn body */}
      <path d="M5 10.5 V20 H19 V10.5" />
      {/* barn door with cross brace */}
      <rect x="9" y="13" width="6" height="7" />
      <path d="M9 13 L15 20 M15 13 L9 20" stroke={accent} />
      {/* hayloft window */}
      <circle cx="12" cy="8.3" r="1.2" stroke={accent} />
      {/* ground line */}
      <path d="M2 20 H22" />
    </svg>
  );
}