/**
 * Root layout component for the Career Counseling Chat Application
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "../components/providers/trpc-provider";
import { AuthProvider } from "../components/providers/auth-provider";
import { ThemeProvider } from "../components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Counselor AI - Professional Guidance & Support",
  description: "Get personalized career guidance from our AI-powered career counselor. Explore opportunities, plan your career path, and get professional development advice.",
  keywords: "career counseling, job search, professional development, AI career advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('ui-theme') === 'dark' || 
                    (!localStorage.getItem('ui-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="ui-theme"
        >
          <AuthProvider>
            <TRPCProvider>
              {children}
            </TRPCProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
