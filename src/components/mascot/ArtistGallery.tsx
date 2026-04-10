'use client';

import { useCallback } from 'react';
import { useMascotLocale } from './MascotLocaleContext';

interface GalleryItem {
	userId: string;
	displayName: string;
	updatedAt: string;
	commentary?: string;
	customizationData: Record<string, unknown>;
	previewUrl: string | null;
}

interface ArtistGalleryProps {
	items: GalleryItem[];
	year: number;
}

export default function ArtistGallery({ items, year }: ArtistGalleryProps) {
	const { t } = useMascotLocale();

	const handleDownloadJson = useCallback((item: GalleryItem) => {
		const blob = new Blob([JSON.stringify(item.customizationData, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `mascot-${item.displayName.replace(/\s+/g, '-').toLowerCase()}-${year}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}, [year]);

	return (
		<div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
			<h1
				style={{
					fontFamily: 'Tahoma, Geneva, sans-serif',
					fontSize: '18px',
					fontWeight: 'bold',
					color: '#333',
					marginBottom: '20px',
				}}
			>
				{t.galleryTitle} — {year}
			</h1>

			{items.length === 0 && (
				<p style={{ fontFamily: 'Tahoma, Geneva, sans-serif', fontSize: '12px', color: '#666' }}>
					{t.galleryEmpty}
				</p>
			)}

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
					gap: '16px',
				}}
			>
				{items.map((item) => (
					<div
						key={item.userId}
						style={{
							background: '#D4D0C8',
							border: '2px solid',
							borderColor: '#fff #808080 #808080 #fff',
							padding: '8px',
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
						}}
					>
						{/* Preview image */}
						<div
							style={{
								width: '100%',
								aspectRatio: '1',
								border: '2px solid',
								borderColor: '#808080 #fff #fff #808080',
								background: '#fff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
							}}
						>
							{item.previewUrl ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={item.previewUrl}
									alt={`${item.displayName}'s mascot`}
									style={{ width: '100%', height: '100%', objectFit: 'contain' }}
								/>
							) : (
								<span
									style={{
										fontFamily: 'Tahoma, Geneva, sans-serif',
										fontSize: '11px',
										color: '#999',
									}}
								>
									{t.galleryNoPreview}
								</span>
							)}
						</div>

						{/* Name & date */}
						<div>
							<div
								style={{
									fontFamily: 'Tahoma, Geneva, sans-serif',
									fontSize: '12px',
									fontWeight: 'bold',
									color: '#000',
								}}
							>
								{item.displayName}
							</div>
							<div
								style={{
									fontFamily: 'Tahoma, Geneva, sans-serif',
									fontSize: '10px',
									color: '#666',
								}}
							>
								{t.galleryLastUpdated}: {new Date(item.updatedAt).toLocaleDateString()}
							</div>
						</div>

						{/* Commentary */}
						<div
							style={{
								fontFamily: 'Tahoma, Geneva, sans-serif',
								fontSize: '11px',
								color: '#333',
								background: '#fff',
								border: '2px solid',
								borderColor: '#808080 #fff #fff #808080',
								padding: '6px',
								minHeight: '40px',
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word',
							}}
						>
							{item.commentary || (
								<span style={{ color: '#999', fontStyle: 'italic' }}>{t.galleryNoCommentary}</span>
							)}
						</div>

						{/* Action buttons */}
						<div style={{ display: 'flex', gap: '6px' }}>
							{item.previewUrl && (
								<a
									href={item.previewUrl}
									download={`mascot-${item.displayName.replace(/\s+/g, '-').toLowerCase()}-${year}.png`}
									style={{
										flex: 1,
										fontFamily: 'Tahoma, Geneva, sans-serif',
										fontSize: '11px',
										padding: '4px 8px',
										background: '#D4D0C8',
										border: '2px solid',
										borderColor: '#fff #808080 #808080 #fff',
										cursor: 'pointer',
										textAlign: 'center',
										textDecoration: 'none',
										color: '#000',
									}}
								>
									{t.galleryDownloadPng}
								</a>
							)}
							<button
								onClick={() => handleDownloadJson(item)}
								style={{
									flex: 1,
									fontFamily: 'Tahoma, Geneva, sans-serif',
									fontSize: '11px',
									padding: '4px 8px',
									background: '#D4D0C8',
									border: '2px solid',
									borderColor: '#fff #808080 #808080 #fff',
									cursor: 'pointer',
								}}
							>
								{t.galleryDownloadJson}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
