import { ToastProvider } from '@/components/ui/Toast';
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
        <ToastProvider>
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
                      href="/demo/error-handling"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      UX Demo
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
            <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto max-w-screen-2xl px-4 py-6">
                <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                      Built with{' '}
                      <Link
                        href="https://nextjs.org"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        Next.js 15
                      </Link>
                      ,{' '}
                      <Link
                        href="https://www.typescriptlang.org"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        TypeScript
                      </Link>
                      , and{' '}
                      <Link
                        href="https://tailwindcss.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        Tailwind CSS
                      </Link>
                      .
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Link
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
} 