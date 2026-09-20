"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container">
      <h1>This view could not load.</h1>
      <p>
        Your saved local scene has not been reset. Retry this view or return
        using navigation.
      </p>
      <button className="button button-primary" onClick={reset}>
        Retry view
      </button>
    </div>
  );
}
