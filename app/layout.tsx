import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "NS Fitness Club | Build Your Strongest Self",
  description: "A premium strength and fitness destination built around discipline, progress, and community.",
  openGraph: {
    title: "NS Fitness Club",
    description: "Build your strongest self.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}

