import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { AnimatedNavLink } from "@/components/ui/animated-nav-link"


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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <header className="border-b">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <div className="flex gap-6">
              <AnimatedNavLink href="/">Home</AnimatedNavLink>
              <AnimatedNavLink href="/about">About</AnimatedNavLink>
            </div>
            <ThemeToggle />
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Momiji
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
