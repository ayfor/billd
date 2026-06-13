import type { Metadata } from "next";
import { Inter, Silkscreen, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});
const pixelify = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixelify" });

export const metadata: Metadata = {
  title: "billd",
  description: "Personal expense tracker — quick-add, budgets, projections.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${silkscreen.variable} ${pixelify.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
