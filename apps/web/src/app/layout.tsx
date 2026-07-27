import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = {
  variable: "inter-fallback",
};

export const metadata: Metadata = {
  title: "CollegePES | AI-Powered Smart Campus Management",
  description: "Enterprise resource planning for modern educational institutions. Manage academics, finance, placements, and more.",
  keywords: ["college", "erp", "education", "management", "ai"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
