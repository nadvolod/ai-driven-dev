import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Task Management App',
    template: '%s | Task Management App',
  },
  description: 'A modern task management application built with Next.js 15, TypeScript, and Tailwind CSS',
  keywords: ['task management', 'productivity', 'todo', 'next.js', 'typescript'],
  authors: [{ name: 'Task Management Team' }],
  creator: 'Task Management Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://task-management-app.vercel.app',
    title: 'Task Management App',
    description: 'A modern task management application built with Next.js 15, TypeScript, and Tailwind CSS',
    siteName: 'Task Management App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Management App',
    description: 'A modern task management application built with Next.js 15, TypeScript, and Tailwind CSS',
    creator: '@taskmanagementapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // other: 'your-other-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    TaskFlow
                  </span>
                </div>
                
                {/* Navigation Links */}
                            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/demo"
                className="text-foreground hover:text-primary transition-colors"
              >
                Demo
              </Link>
              <Link
                href="/api-test"
                className="text-foreground hover:text-primary transition-colors"
              >
                API Test
              </Link>
              <Link
                href="/tasks"
                className="text-foreground hover:text-primary transition-colors"
              >
                Tasks
              </Link>
            </nav>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Toggle theme"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </button>

                {/* User Menu */}
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium"
                  aria-label="User menu"
                >
                  <span>U</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="container mx-auto max-w-screen-2xl px-4 py-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-4 md:h-14 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with{' '}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4 hover:text-primary"
                >
                  Next.js 15
                </a>
                ,{' '}
                <a
                  href="https://www.typescriptlang.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4 hover:text-primary"
                >
                  TypeScript
                </a>
                , and{' '}
                <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4 hover:text-primary"
                >
                  Tailwind CSS
                </a>
                .
              </p>
              
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 