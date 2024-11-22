import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Importing local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900", // Supports a wide range of weights
  display: "swap", // Ensures text is visible while fonts load
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900", // Matches range of weights
  display: "swap", // Better performance
});

// Metadata configuration
export const metadata: Metadata = {
  title: "Instructor Portal",
  description:
    "easy-to-use platform for instructors to create a fun gaming experience for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Example: Add custom favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-white text-text`}
      >
        {children}
      </body>
    </html>
  );
}
