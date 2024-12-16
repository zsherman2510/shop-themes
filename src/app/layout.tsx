import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modern Store - Premium E-commerce Experience",
  description:
    "Discover our curated collection of premium products with exceptional quality and style.",
  keywords: "e-commerce, online store, premium products, modern shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="modern"
          enableSystem={true}
          themes={["modern", "dark", "light"]}
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
