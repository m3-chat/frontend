import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./code-font.css";
import "./outfit.css";
import { ThemeMatcher } from "@/components/ThemeMatcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M3 Chat",
  description:
    "M3 Chat is a 100% open-source, private, and free AI chat web app with no account requirements and 10+ local models.",
  openGraph: {
    title: "M3 Chat",
    description:
      "Open-source, free, privacy-focused AI chat with 10+ models and no account required.",
    url: "https://m3-chat.vercel.app",
    siteName: "M3 Chat",
    images: [
      {
        url: "/logo.png",
        alt: "M3 Chat Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M3 Chat",
    description:
      "Open-source, free, privacy-focused AI chat with 10+ models and no account required.",
    images: ["/logo.png"],
    creator: "@myferdoescoding",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <ThemeMatcher>
        <link rel="icon" href="/logo.png" />
        <Analytics />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </ThemeMatcher>
    </html>
  );
}
