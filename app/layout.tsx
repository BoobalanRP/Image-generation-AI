import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ImageAI Studio | AI-Powered Image Generation",
  description:
    "Transform your ideas into stunning visuals with advanced AI image generation. Create beautiful art, realistic photos, and unique illustrations in seconds.",
  keywords: ["AI", "image generation", "text-to-image", "art", "FLUX", "Hugging Face"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
