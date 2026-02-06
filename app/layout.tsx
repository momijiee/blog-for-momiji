import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momiji's Blog",
  description: "A personal blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <header className="border-b">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-4">
            <Link href="/" className="font-medium hover:underline">
              Home
            </Link>
            <Link href="/about" className="font-medium hover:underline">
              About
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Momiji
        </footer>
      </body>
    </html>
  );
}
