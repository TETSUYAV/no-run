import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#fc5200',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://norun.app'),
  title: {
    default: 'No Run — Faux Tracés Strava & Télémétrie GPX',
    template: '%s | No Run',
  },
  description:
    'Générez de faux tracés Strava ultra-réalistes sans courir : profil altimétrique SRTM, asservissement GAP physiologique en côte et fréquence cardiaque synchronisée.',
  keywords: [
    'faux trace strava',
    'no run',
    'gpx generator',
    'strava faker',
    'gpx garmin',
    'simulation course sans courir',
    'trace alibi',
    'canaprun alternative',
    'elevation srtm',
  ],
  authors: [{ name: 'No Run' }],
  creator: 'No Run',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://norun.app',
    title: 'No Run — Faux Tracés Strava & Télémétrie GPX',
    description:
      'Générez de faux tracés Strava ultra-réalistes sans quitter votre canapé : calibration GAP, altimétrie SRTM et signatures Garmin/Apple Watch.',
    siteName: 'No Run',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'No Run — La trace Strava parfaite sans courir',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'No Run — Faux Tracés Strava & Télémétrie GPX',
    description:
      'Générez de faux tracés Strava ultra-réalistes sans courir. Calibré pour Strava, Garmin et Komoot.',
    images: ['/og-image.png'],
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
    title: 'No Run',
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
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
