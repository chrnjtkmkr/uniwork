import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkWrapper } from "@/components/clerk-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniWork | Universal Productivity & Collaboration Platform",
  description: "One place for everything you work on. Manage tasks, docs, files, and teams with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isDemoMode = !publishableKey || publishableKey === "" || publishableKey.includes("test_");

  if (isDemoMode) {
    console.log("🚀 RUNNING IN OFFLINE DEMO MODE - Clerk Disabled");
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} bg-[#0A0A0A] text-foreground antialiased selection:bg-primary/20 selection:text-primary`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {isDemoMode ? children : <ClerkWrapper>{children}</ClerkWrapper>}
        </ThemeProvider>
      </body>
    </html>
  );
}
