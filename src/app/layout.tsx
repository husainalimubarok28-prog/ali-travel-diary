import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ali Travel Diary - 21 Countries in 10 Months",
  description: "Jelajahi 21 negara dalam 10 bulan bersama Ali. Backpacking, budget tips, dan cerita perjalanan inspiratif.",
  keywords: ["travel", "backpacking", "ali travel diary", "21 negara", "10 bulan", "budget travel", "student immersion"],
  authors: [{ name: "Husain Ali Mubarok" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Ali Travel Diary",
    title: "Ali Travel Diary - 21 Countries in 10 Months",
    description: "Jelajahi 21 negara dalam 10 bulan bersama Ali. Backpacking, budget tips, dan cerita perjalanan inspiratif.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Travel Diary",
    description: "Jelajahi 21 negara dalam 10 bulan bersama Ali.",
    images: ["/images/og-default.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://alitraveldiary.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'auto';
                  var isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider>
            <LanguageProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
