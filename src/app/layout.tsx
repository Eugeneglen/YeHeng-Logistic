import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BackgroundTexture } from "@/components/background-texture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YeHeng Logistics — Precision. Control. Personal.",
  description:
    "High-Touch Logistics for Singapore & Beyond. YeHeng Logistics delivers concierge-level supply chain management with human-verified visibility and dedicated service.",
  keywords: [
    "logistics",
    "Singapore",
    "freight forwarding",
    "last-mile delivery",
    "cross-border trucking",
    "supply chain",
    "concierge logistics",
    "YeHeng",
  ],
  authors: [{ name: "YeHeng Logistics Pte Ltd" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "YeHeng Logistics — Precision. Control. Personal.",
    description:
      "High-Touch Logistics for Singapore & Beyond. Concierge-level supply chain management.",
    siteName: "YeHeng Logistics Pte Ltd",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <div className="relative">
          {children}
        </div>
        <BackgroundTexture />
        <Toaster />
      </body>
    </html>
  );
}