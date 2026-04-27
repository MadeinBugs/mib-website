import '../globals.css';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pt-BR' }
  ];
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Made in Bugs - Indie Game Studio',
    description: 'Embracing the chaotic nature of game development with perseverance and creativity.',
    other: {
      'locale': locale,
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="locale-layout" data-locale={locale}>
      {children}
    </div>
  );
}
