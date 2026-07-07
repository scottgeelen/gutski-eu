import Link from "next/link";

export const metadata = { title: "404 — GUTSKI", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="notfound">
      <span className="mono">Error 404</span>
      <h1>404</h1>
      <p>Deze piste bestaat niet.</p>
      <Link className="btn" href="/">
        Terug naar home
      </Link>
    </main>
  );
}
