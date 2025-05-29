import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { SelectedStationProvider } from '@/contexts/selected-station-context';
import { Toaster } from '@/components/ui/toaster';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Electrocar-charging.uz',
  description: 'Find charging stations for your electric vehicle in Uzbekistan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <SelectedStationProvider>
                {children}
                <Toaster />
              </SelectedStationProvider>
            </APIProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
