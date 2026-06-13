interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, max = 5, size = "md" }: StarRatingProps) {
  const starClass = size === "sm" ? "text-sm" : "text-base";
  return (
    <div className={`flex items-center gap-0.5 text-amber-500 ${starClass}`} aria-label={`${rating} / ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}
