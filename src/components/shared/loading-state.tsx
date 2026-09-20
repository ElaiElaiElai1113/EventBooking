export function LoadingState() {
  return (
    <div
      className="container loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="eyebrow">DAVAO EVENT PLATFORM · DEMO</p>
      <p>Preparing your view…</p>
      <div className="loading-line" aria-hidden="true" />
      <div className="loading-block" aria-hidden="true" />
      <p className="small muted">Your saved scene stays in this browser.</p>
    </div>
  );
}
