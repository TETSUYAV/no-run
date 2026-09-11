import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CookieBanner } from '@/components/CookieBanner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#fc5200',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ghostpace.app'),
  title: {
    default: 'GhostPace — Télémétrie d’Élite & Générateur GPX Strava',
    template: '%s | GhostPace',
  },
  description:
    'Générez des traces GPX furtives ultra-réalistes : profil altimétrique SRTM, asservissement GAP physiologique en côte et fréquence cardiaque synchronisée pour Strava.',
  keywords: [
    'gpx generator',
    'strava trace',
    'gpx garmin',
    'simulation course',
    'trace furtive',
    'canaprun alternative',
    'elevation srtm',
  ],
  authors: [{ name: 'GhostPace Stealth Lab' }],
  creator: 'GhostPace',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ghostpace.app',
    title: 'GhostPace — Télémétrie d’Élite & Générateur GPX Strava',
    description:
      'Générez des traces GPX furtives ultra-réalistes avec calibration bi-passe GAP, altimétrie SRTM et signatures Garmin/Apple Watch.',
    siteName: 'GhostPace Stealth Lab',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'GhostPace Stealth Lab Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'GhostPace — Télémétrie d’Élite & Générateur GPX Strava',
    description:
      'Générez des traces GPX furtives ultra-réalistes calibrées pour Strava, Garmin et Komoot.',
    images: ['/icon-512.png'],
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GhostPace',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
