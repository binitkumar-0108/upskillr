export default function ProgressBar({ value = 0, className = '', showLabel = true }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-2xs text-ink-muted">{pct}% complete</span>
        </div>
      )}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
