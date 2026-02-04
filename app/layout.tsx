import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Generation AI",
  description: "Generate and edit images with AI — text-to-image and instruction-based editing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
