'use client';

import React, { useState } from 'react';
import {
	FaWindows,
	FaApple,
	FaLinux,
	FaAndroid,
	FaGlobe,
	FaSteam
} from 'react-icons/fa';
import { SiRoblox, SiIos } from 'react-icons/si';

interface PlatformTagsProps {
	platforms: string[];
	platformLinks?: { [platform: string]: string };
	platformMessages?: {
		[platform: string]: {
			en: string;
			'pt-BR': string;
		};
	};
	locale: string;
}

// Map platform names to their corresponding icons and colors
const platformConfig = {
	windows: {
		icon: FaWindows,
		label: { en: 'Windows', 'pt-BR': 'Windows' },
		color: 'text-blue-600',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	mac: {
		icon: FaApple,
		label: { en: 'Mac', 'pt-BR': 'Mac' },
		color: 'text-gray-800',
		bgColor: 'bg-gray-100',
		borderColor: 'border-gray-200',
		hoverBg: 'hover:bg-gray-200'
	},
	linux: {
		icon: FaLinux,
		label: { en: 'Linux', 'pt-BR': 'Linux' },
		color: 'text-yellow-600',
		bgColor: 'bg-yellow-100',
		borderColor: 'border-yellow-200',
		hoverBg: 'hover:bg-yellow-200'
	},
	ios: {
		icon: SiIos,
		label: { en: 'iOS', 'pt-BR': 'iOS' },
		color: 'text-gray-700',
		bgColor: 'bg-gray-100',
		borderColor: 'border-gray-200',
		hoverBg: 'hover:bg-gray-200'
	},
	android: {
		icon: FaAndroid,
		label: { en: 'Android', 'pt-BR': 'Android' },
		color: 'text-green-600',
		bgColor: 'bg-green-100',
		borderColor: 'border-green-200',
		hoverBg: 'hover:bg-green-200'
	},
	web: {
		icon: FaGlobe,
		label: { en: 'Web', 'pt-BR': 'Web' },
		color: 'text-blue-500',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	roblox: {
		icon: SiRoblox,
		label: { en: 'Roblox', 'pt-BR': 'Roblox' },
		color: 'text-red-600',
		bgColor: 'bg-red-100',
		borderColor: 'border-red-200',
		hoverBg: 'hover:bg-red-200'
	},
	steam: {
		icon: FaSteam,
		label: { en: 'Steam', 'pt-BR': 'Steam' },
		color: 'text-blue-700',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	mobile: {
		icon: FaAndroid, // Using Android icon as generic mobile
		label: { en: 'Mobile', 'pt-BR': 'Mobile' },
		color: 'text-purple-600',
		bgColor: 'bg-purple-100',
		borderColor: 'border-purple-200',
		hoverBg: 'hover:bg-purple-200'
	}
};

// Function to normalize platform names
function normalizePlatformName(platform: string): string {
	return platform.toLowerCase().replace(/\s+/g, '');
}

export default function PlatformTags({ platforms, platformLinks, platformMessages, locale }: PlatformTagsProps) {
	const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

	if (!platforms || platforms.length === 0) {
		return null;
	}

	const handlePlatformClick = (platform: string, normalizedPlatform: string) => {
		const link = platformLinks?.[normalizedPlatform];
		if (link) {
			window.open(link, '_blank', 'noopener,noreferrer');
		}
	};

	const getTooltipMessage = (normalizedPlatform: string) => {
		const customMessage = platformMessages?.[normalizedPlatform];
		if (customMessage) {
			return customMessage[locale as 'en' | 'pt-BR'] || customMessage.en;
		}
		return locale === 'en' ? 'Coming soon' : 'Em breve';
	};

	return (
		<div className="content-card-sm">
			<h3 className="font-h2 text-xl font-bold mb-4">
				{locale === 'en' ? 'Links' : 'Links'}
			</h3>
			<div className="flex flex-wrap gap-3">
				{platforms.map((platform, index) => {
					const normalizedPlatform = normalizePlatformName(platform);
					const config = platformConfig[normalizedPlatform as keyof typeof platformConfig];
					const hasLink = platformLinks?.[normalizedPlatform];
					const isHovered = hoveredPlatform === normalizedPlatform;

					// Fallback for unknown platforms
					if (!config) {
						return (
							<span
								key={index}
								className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
								text-gray-700 bg-gray-100 border border-gray-200"
							>
								{platform}
							</span>
						);
					}

					const Icon = config.icon;
					const label = config.label[locale as 'en' | 'pt-BR'] || config.label.en;

					return (
						<div key={index} className="relative">
							{hasLink ? (
								// Interactive button for platforms with links
								<button
									onClick={() => handlePlatformClick(platform, normalizedPlatform)}
									onMouseEnter={() => setHoveredPlatform(normalizedPlatform)}
									onMouseLeave={() => setHoveredPlatform(null)}
									className={`
										inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
										transition-all duration-200 hover:scale-105 cursor-pointer
										${config.color} ${config.bgColor} border ${config.borderColor}
										${config.hoverBg} hover:shadow-md
									`}
								>
									<Icon className="text-base flex-shrink-0" />
									<span className="font-body">{label}</span>
									<svg
										className="w-3 h-3 ml-1 opacity-60"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</button>
							) : (
								// Grayed out tag for platforms without links (coming soon)
								<button
									onMouseEnter={() => setHoveredPlatform(normalizedPlatform)}
									onMouseLeave={() => setHoveredPlatform(null)}
									className={`
										inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
										transition-all duration-200 cursor-default relative
										text-gray-500 bg-gray-100 border border-gray-300
									`}
								>
									<Icon className="text-base flex-shrink-0 opacity-60" />
									<span className="font-body opacity-75">{label}</span>
								</button>
							)}

							{/* Tooltip for platforms without links - shows on hover */}
							{isHovered && !hasLink && (
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
									<div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
										{getTooltipMessage(normalizedPlatform)}
										<div className="absolute top-full left-1/2 transform -translate-x-1/2">
											<div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-gray-800"></div>
										</div>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}