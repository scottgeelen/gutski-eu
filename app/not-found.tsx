import "@/app/globals.css";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import Link from "next/link";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export const metadata = { title: "404 — GUTSKI", robots: { index: false } };

// Root not-found voor onbekende URL's. Rendert een eigen <html>/<body> omdat
// de site geen root-layout heeft (twee route-group-layouts).
export default function NotFound() {
  return (
    <html lang="nl" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <main className="notfound">
          <span className="mono">Error 404</span>
          <h1>404</h1>
          <p>Deze piste bestaat niet.</p>
          <Link className="btn" href="/">
            Terug naar home
          </Link>
        </main>
      </body>
    </html>
  );
}
