import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { Amatic_SC, Inter, Fredoka, Nunito, Comfortaa, Pangolin } from 'next/font/google';
import { getMetadataAssetPath } from '../lib/metadataPaths';
import { getVersionInfo } from '../lib/version';
import VersionLogger from '../components/VersionLogger';

const amatic = Amatic_SC({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--font-amatic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-inter' });
const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-fredoka' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap', variable: '--font-nunito' });
const comfortaa = Comfortaa({ subsets: ['latin'], weight: ['300', '400', '500'], display: 'swap', variable: '--font-comfortaa' });
const pangolin = Pangolin({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-pangolin' });

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
    <html lang="pt-BR" className={`${amatic.variable} ${inter.variable} ${fredoka.variable} ${nunito.variable} ${comfortaa.variable} ${pangolin.variable}`}>
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
