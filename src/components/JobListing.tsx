'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { JobData } from '../lib/jobs';

interface JobListingProps {
	job: JobData;
	locale: 'en' | 'pt-BR';
	isEven?: boolean;
}

export default function JobListing({ job, locale, isEven = false }: JobListingProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const title = job.title[locale];
	const description = job.description[locale];

	return (
		<div className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isEven ? 'bg-gray-100' : 'bg-white'}`}>
			{/* Collapsible Header */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${isEven ? 'hover:bg-gray-200' : 'hover:bg-gray-100'}`}
			>
				<div className="flex-1">
					<h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
				</div>
				<div className="ml-4">
					<motion.div
						animate={{ rotate: isExpanded ? 180 : 0 }}
						transition={{ duration: 0.2 }}
						className="text-gray-400"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</motion.div>
				</div>
			</button>

			{/* Expanded Content */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="px-6 pb-6 pt-2 border-t border-gray-100">
							<p className="text-gray-700 mb-4">{description}</p>
							<Link
								href={`/${locale}/jobs/${job.id}`}
								className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
							>
								{locale === 'en' ? 'Learn More' : 'Saiba Mais'}
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
