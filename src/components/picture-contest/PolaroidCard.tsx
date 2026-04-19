'use client';

import Image from 'next/image';

function getRotation(id: string): number {
	const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
	return (hash % 7) - 3; // -3 to +3
}

interface PolaroidCardProps {
	imageUrl: string | null;
	label: string;
	id: string;
	onClick?: () => void;
}

export default function PolaroidCard({ imageUrl, label, id, onClick }: PolaroidCardProps) {
	const rotation = getRotation(id);

	return (
		<div
			onClick={onClick}
			className="group cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:z-10"
			style={{
				transform: `rotate(${rotation}deg)`,
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = `rotate(${rotation}deg)`;
			}}
		>
			<div
				className="bg-white shadow-md group-hover:shadow-xl transition-shadow duration-300"
				style={{
					padding: '12px 12px 60px 12px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
				}}
			>
				{/* Image area */}
				<div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={label}
							fill
							className="object-cover"
							loading="lazy"
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						/>
					) : (
						<div className="w-full h-full bg-neutral-200 animate-pulse" />
					)}
				</div>

				{/* Label area (polaroid bottom) */}
				<p
					className="text-center text-neutral-600 mt-3 truncate"
					style={{
						fontFamily: "'Pangolin', cursive",
						fontSize: '0.85rem',
					}}
				>
					{label}
				</p>
			</div>
		</div>
	);
}
