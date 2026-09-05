import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter, Noto_Sans_Devanagari, JetBrains_Mono } from 'next/font/google';
import { OfflineIndicator, LanguageSwitcher } from '@/components/layout';
import './globals.css';

export const dynamic = 'force-dynamic';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: '--font-noto-devanagari',
  subsets: ['devanagari'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StatVidya — Workforce Competency Intelligence',
  description: "Competency Intelligence Platform for India's Official Statistical System (MoSPI / NSSTA)",
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoDevanagari.variable} ${jetbrainsMono.variable} h-full antialiased light`}
      style={{ colorScheme: 'light' }}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f7f2eb] text-[#1a1a1a]" style={{ colorScheme: 'light' }} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <div className="flex flex-col min-h-full">
              {children}
              <OfflineIndicator />
              <LanguageSwitcher />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
