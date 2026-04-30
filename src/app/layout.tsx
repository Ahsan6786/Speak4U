import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "SpeakMirror – Daily AI Speaking Coach",
  description: "Stop hesitating. Start speaking with clarity, structure, and confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full transition-colors duration-300`}>
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
