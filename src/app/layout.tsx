import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Ordinary — Skincare, decoded.",
  description: "Clinical formulations with integrity. A study in skincare, science, and less noise.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
