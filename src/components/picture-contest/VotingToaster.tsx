'use client';

import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';

export default function VotingToaster() {
	const [isMobile, setIsMobile] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const mql = window.matchMedia('(max-width: 640px)');
		setIsMobile(mql.matches);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, []);

	if (!mounted) return null;

	return (
		<Toaster
			position={isMobile ? 'top-center' : 'top-right'}
			visibleToasts={isMobile ? 1 : 3}
			duration={2300}
			toastOptions={{
				style: {
					fontFamily: 'var(--font-inter), Segoe UI, sans-serif',
					fontSize: '0.875rem',
					fontWeight: 600,
					borderRadius: '0.75rem',
					padding: '12px 16px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
				},
			}}
		/>
	);
}
