import "@/app/globals.css";
import "./admin.css";
import { DM_Sans, DM_Mono, Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
