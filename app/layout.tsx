import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NavLink } from "@/components/ui/nav-link"
import { BackToTop } from "@/components/ui/back-to-top";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://momiji.dev"),
  title: {
    default: "Momiji · 思考 / 技术 / 个人系统",
    template: "%s | Momiji",
  },
  description: "记录思考、技术成长与个人系统构建的个人博客。",
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
            <div className="flex gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/article">Article</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
            <ThemeToggle />
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Momiji
        </footer>
        <BackToTop/>
        </ThemeProvider>
      </body>
    </html>
  );
}
