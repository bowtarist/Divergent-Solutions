import type { Metadata } from "next";
import { Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.divergentsolutionsllc.com"),
  title: "Divergent Solutions | Quality Gutter Installation in Scottsboro, AL",
  description:
    "Licensed and insured gutter installation, repair, guards, fascia, soffit, siding, renovations, and new construction support across North Alabama, Tennessee, and Georgia.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Divergent Solutions | Quality Gutter Installation in Scottsboro, AL",
    description:
      "Licensed and insured gutter installation and exterior support across Scottsboro, Huntsville, Gadsden, Fort Payne, Winchester, and Trenton.",
    url: "/",
    siteName: "Divergent Solutions",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
