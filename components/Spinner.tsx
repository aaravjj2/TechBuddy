export type SpinnerProps = {
  /** Accessible label describing what is loading */
  label?: string;
  className?: string;
};

export function Spinner({
  label = "Loading",
  className = "",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent align-middle ${className}`}
    >
      {/* Screen reader text */}
      <span className="sr-only">{label}</span>
    </span>
  );
}
