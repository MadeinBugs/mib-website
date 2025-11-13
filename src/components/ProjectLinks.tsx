'use client';

import React from 'react';
import {
	FaGlobe,
	FaGithub,
	FaSteam,
	FaGamepad,
	FaAppStore,
	FaGooglePlay,
	FaYoutube,
	FaTwitter,
	FaDiscord,
	FaLinkedin,
	FaFigma,
	FaBook
} from 'react-icons/fa';
import { SiItchdotio, SiUnity, SiUnrealengine, SiRoblox } from 'react-icons/si'; interface ProjectLinksProps {
	links: {
		website?: string;
		steam?: string;
		itchio?: string;
		github?: string;
		playStore?: string;
		appStore?: string;
		youtube?: string;
		twitter?: string;
		discord?: string;
		linkedin?: string;
		figma?: string;
		roblox?: string;
		wiki?: string;
	};
	locale: string;
}

// Map link types to their corresponding icons and labels
const linkConfig = {
	website: {
		icon: FaGlobe,
		label: { en: 'Website', 'pt-BR': 'Website' },
		color: 'text-blue-600',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	github: {
		icon: FaGithub,
		label: { en: 'GitHub', 'pt-BR': 'GitHub' },
		color: 'text-gray-800',
		bgColor: 'bg-gray-100',
		borderColor: 'border-gray-200',
		hoverBg: 'hover:bg-gray-200'
	},
	steam: {
		icon: FaSteam,
		label: { en: 'Steam', 'pt-BR': 'Steam' },
		color: 'text-blue-700',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	itchio: {
		icon: SiItchdotio,
		label: { en: 'itch.io', 'pt-BR': 'itch.io' },
		color: 'text-red-600',
		bgColor: 'bg-red-100',
		borderColor: 'border-red-200',
		hoverBg: 'hover:bg-red-200'
	},
	playStore: {
		icon: FaGooglePlay,
		label: { en: 'Google Play', 'pt-BR': 'Google Play' },
		color: 'text-green-600',
		bgColor: 'bg-green-100',
		borderColor: 'border-green-200',
		hoverBg: 'hover:bg-green-200'
	},
	appStore: {
		icon: FaAppStore,
		label: { en: 'App Store', 'pt-BR': 'App Store' },
		color: 'text-blue-600',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	youtube: {
		icon: FaYoutube,
		label: { en: 'YouTube', 'pt-BR': 'YouTube' },
		color: 'text-red-600',
		bgColor: 'bg-red-100',
		borderColor: 'border-red-200',
		hoverBg: 'hover:bg-red-200'
	},
	twitter: {
		icon: FaTwitter,
		label: { en: 'Twitter', 'pt-BR': 'Twitter' },
		color: 'text-blue-400',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	discord: {
		icon: FaDiscord,
		label: { en: 'Discord', 'pt-BR': 'Discord' },
		color: 'text-indigo-600',
		bgColor: 'bg-indigo-100',
		borderColor: 'border-indigo-200',
		hoverBg: 'hover:bg-indigo-200'
	},
	linkedin: {
		icon: FaLinkedin,
		label: { en: 'LinkedIn', 'pt-BR': 'LinkedIn' },
		color: 'text-blue-700',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	},
	figma: {
		icon: FaFigma,
		label: { en: 'Art Bible', 'pt-BR': 'Art Bible' },
		color: 'text-purple-600',
		bgColor: 'bg-purple-100',
		borderColor: 'border-purple-200',
		hoverBg: 'hover:bg-purple-200'
	},
	roblox: {
		icon: SiRoblox,
		label: { en: 'Roblox', 'pt-BR': 'Roblox' },
		color: 'text-red-600',
		bgColor: 'bg-red-100',
		borderColor: 'border-red-200',
		hoverBg: 'hover:bg-red-200'
	},
	wiki: {
		icon: FaBook,
		label: { en: 'Wiki', 'pt-BR': 'Wiki' },
		color: 'text-blue-600',
		bgColor: 'bg-blue-100',
		borderColor: 'border-blue-200',
		hoverBg: 'hover:bg-blue-200'
	}
};

export default function ProjectLinks({ links, locale }: ProjectLinksProps) {
	// Filter out empty links
	const availableLinks = Object.entries(links).filter(([_, url]) => url && url.trim() !== '');

	if (availableLinks.length === 0) {
		return null;
	}

	return (
		<div className="content-card-sm">
			<h3 className="font-h2 text-xl font-bold mb-4">
				{locale === 'en' ? 'Extras' : 'Extras'}
			</h3>
			<div className="flex flex-wrap gap-3">
				{availableLinks.map(([linkType, url]) => {
					const config = linkConfig[linkType as keyof typeof linkConfig];
					if (!config) return null;

					const Icon = config.icon;
					const label = config.label[locale as 'en' | 'pt-BR'] || config.label.en;

					return (
						<a
							key={linkType}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
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
						</a>
					);
				})}
			</div>
		</div>
	);
}
