import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { getMetadataAssetPath } from '../lib/metadataPaths';
import { getVersionInfo } from '../lib/version';
import VersionLogger from '../components/VersionLogger';

const versionInfo = getVersionInfo();

export const metadata: Metadata = {
  title: 'Made in Bugs - Indie Game Studio',
  description: 'Made in Bugs indie game studio - Embracing the chaotic nature of game development with perseverance and creativity.',
  metadataBase: new URL('https://www.madeinbugs.com.br'),
  other: {
    'mib-version': versionInfo.version,
  },
  openGraph: {
    title: 'Made in Bugs - Indie Game Studio',
    description: 'Embracing the chaotic nature of game development with perseverance and creativity.',
    url: 'https://www.madeinbugs.com.br',
    siteName: 'Made in Bugs',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Made in Bugs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Made in Bugs - Indie Game Studio',
    description: 'Embracing the chaotic nature of game development with perseverance and creativity.',
  },
  icons: {
    icon: [
      { url: getMetadataAssetPath('/favicon-16x16.png'), sizes: '16x16', type: 'image/png' },
      { url: getMetadataAssetPath('/favicon-32x32.png'), sizes: '32x32', type: 'image/png' },
      { url: getMetadataAssetPath('/favicon.ico'), sizes: 'any' }
    ],
    apple: [
      { url: getMetadataAssetPath('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: getMetadataAssetPath('/android-chrome-192x192.png'), sizes: '192x192', type: 'image/png' },
      { url: getMetadataAssetPath('/android-chrome-512x512.png'), sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: getMetadataAssetPath('/site.webmanifest'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Version info for debugging - check page source */}
        {/* Made in Bugs Version: {versionInfo.version} */}
      </head>
      <body className="font-sans text-neutral-800">
        <VersionLogger />
        {children}
        <Script
          defer
          src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
