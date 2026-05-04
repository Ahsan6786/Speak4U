import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { AppInitializer } from "@/components/app-initializer";


import type { Metadata, Viewport } from "next";

import { ThemeColorHandler } from "@/components/ThemeColorHandler";

export const metadata: Metadata = {
  title: "REVIAL – Daily AI Speaking Coach",
  description: "Stop hesitating. Start speaking with clarity, structure, and confidence.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "REVIAL",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-full overflow-x-hidden`}>
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AppInitializer>
              <ThemeColorHandler />
              {children}
              <InstallPrompt />
            </AppInitializer>
          </AuthProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}

