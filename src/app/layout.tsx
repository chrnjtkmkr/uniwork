import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkWrapper } from "@/components/clerk-wrapper";

const geistSans = {
  variable: "--font-geist-sans",
  className: "font-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
  className: "font-mono",
};

export const metadata: Metadata = {
  title: "UniWork | Neural Task OS",
  description: "High-performance synchronization for modern universes.",
};

import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isDemoMode = !publishableKey || publishableKey === "" || publishableKey.includes("test_");

  return (
    <html lang="en" suppressHydrationWarning className="dark selection:bg-primary/20 selection:text-primary">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ErrorBoundary>
            {isDemoMode ? children : <ClerkWrapper>{children}</ClerkWrapper>}
          </ErrorBoundary>
          <Toaster position="bottom-right" theme="dark" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
