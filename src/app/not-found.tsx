import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container">
      <h1>That page is not in this demo.</h1>
      <p>Your local work is still saved.</p>
      <Link className="button button-primary" href="/">
        Return to demo home
      </Link>
    </div>
  );
}
