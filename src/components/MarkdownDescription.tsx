'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { getImagePath } from '../lib/imagePaths';
import React from 'react';

interface MarkdownDescriptionProps {
	content: string;
	projectId: string;
}

// Component for rendering a horizontal image gallery
function ImageGallery({ images, projectId }: { images: string[]; projectId: string }) {
	const imageCount = images.length;

	return (
		<div className="flex gap-4 my-6 items-stretch">
			{images.map((filename, index) => {
				const src = `/assets/projects/${projectId}/${filename}`;
				return (
					<div key={index} className="flex-1 min-w-0 rounded-lg overflow-hidden shadow-lg">
						<Image
							src={getImagePath(src)}
							alt={`Gallery image ${index + 1}`}
							width={800}
							height={600}
							className="w-full h-full object-cover"
							unoptimized={filename.endsWith('.gif')}
						/>
					</div>
				);
			})}
		</div>
	);
}

// Component for rendering a single image
function SingleImage({ filename, projectId }: { filename: string; projectId: string }) {
	const src = `/assets/projects/${projectId}/${filename}`;
	return (
		<span className="block my-6 rounded-lg overflow-hidden shadow-lg">
			<Image
				src={getImagePath(src)}
				alt="Project image"
				width={800}
				height={600}
				className="w-full h-auto object-cover"
				unoptimized={filename.endsWith('.gif')}
			/>
		</span>
	);
}

export default function MarkdownDescription({ content, projectId }: MarkdownDescriptionProps) {
	// Parse content into segments: markdown text and image blocks
	// Syntax:
	// - [image.png] = single image (vertical)
	// - [image1.png | image2.png] = horizontal gallery (side by side)

	// Combined regex to find both galleries and single images
	// Gallery: has | separator inside brackets
	// Single: no | separator
	const imageBlockRegex = /\[([^\]]+\.(jpg|jpeg|png|gif|webp)(?:\s*\|\s*[^\]]+\.(jpg|jpeg|png|gif|webp))*)\]/gi;

	// Find all image blocks and their positions
	const imageBlocks: { start: number; end: number; content: string; isGallery: boolean; images: string[] }[] = [];
	let match;

	while ((match = imageBlockRegex.exec(content)) !== null) {
		const fullMatch = match[0];
		const innerContent = match[1];
		const isGallery = innerContent.includes('|');

		const images = isGallery
			? innerContent.split('|').map(f => f.trim())
			: [innerContent.trim()];

		imageBlocks.push({
			start: match.index,
			end: match.index + fullMatch.length,
			content: fullMatch,
			isGallery,
			images
		});
	}

	// Build segments array alternating between text and images
	const segments: React.ReactNode[] = [];
	let lastEnd = 0;

	imageBlocks.forEach((block, blockIndex) => {
		// Add text before this image block
		if (block.start > lastEnd) {
			const textContent = content.slice(lastEnd, block.start);
			if (textContent.trim()) {
				segments.push(
					<ReactMarkdown
						key={`md-${blockIndex}`}
						remarkPlugins={[remarkGfm]}
						components={{
							h1: ({ children }) => (
								<h1 className="text-3xl font-bold mb-4 mt-8 first:mt-0" style={{ fontFamily: 'Nunito, sans-serif' }}>{children}</h1>
							),
							h2: ({ children }) => (
								<h2 className="text-2xl font-bold mb-3 mt-6 first:mt-0" style={{ fontFamily: 'Nunito, sans-serif' }}>{children}</h2>
							),
							h3: ({ children }) => (
								<h3 className="text-xl font-bold mb-2 mt-4" style={{ fontFamily: 'Nunito, sans-serif' }}>{children}</h3>
							),
							p: ({ children }) => (
								<p className="font-body text-gray-600 leading-relaxed mb-4">{children}</p>
							),
							ul: ({ children }) => (
								<ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
							),
							ol: ({ children }) => (
								<ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
							),
							li: ({ children }) => (
								<li className="font-body text-gray-600">{children}</li>
							),
							strong: ({ children }) => (
								<strong className="font-bold text-gray-800">{children}</strong>
							),
							em: ({ children }) => (
								<em className="italic">{children}</em>
							),
							a: ({ href, children }) => (
								<a
									href={href}
									className="text-blue-600 hover:text-blue-800 underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									{children}
								</a>
							),
							code: ({ children }) => (
								<code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
									{children}
								</code>
							),
							pre: ({ children }) => (
								<pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
									{children}
								</pre>
							),
							blockquote: ({ children }) => (
								<blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
									{children}
								</blockquote>
							),
						}}
					>
						{textContent}
					</ReactMarkdown>
				);
			}
		}

		// Add the image block
		if (block.isGallery) {
			segments.push(
				<ImageGallery key={`gallery-${blockIndex}`} images={block.images} projectId={projectId} />
			);
		} else {
			segments.push(
				<SingleImage key={`single-${blockIndex}`} filename={block.images[0]} projectId={projectId} />
			);
		}

		lastEnd = block.end;
	});

	// Add any remaining text after the last image block
	if (lastEnd < content.length) {
		const textContent = content.slice(lastEnd);
		if (textContent.trim()) {
			segments.push(
				<ReactMarkdown
					key="md-final"
					remarkPlugins={[remarkGfm]}
					components={{
						h1: ({ children }) => (
							<h1 className="text-3xl font-bold mb-4 mt-8 first:mt-0" style={{ fontFamily: 'Nunito, sans-serif' }}>{children}</h1>
						),
						h2: ({ children }) => (
							<h2 className="text-2xl font-bold mb-3 mt-6 first:mt-0" style={{ fontFamily: 'Nunito, sans-serif' }}>{children}</h2>
						),
						h3: ({ children }) => (
							<h3 className="text-xl font-bold mb-2 mt-4" style={{ fontFamily: 'Nunito, sans-serif' }}>{children}</h3>
						),
						p: ({ children }) => (
							<p className="font-body text-gray-600 leading-relaxed mb-4">{children}</p>
						),
						ul: ({ children }) => (
							<ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
						),
						ol: ({ children }) => (
							<ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
						),
						li: ({ children }) => (
							<li className="font-body text-gray-600">{children}</li>
						),
						strong: ({ children }) => (
							<strong className="font-bold text-gray-800">{children}</strong>
						),
						em: ({ children }) => (
							<em className="italic">{children}</em>
						),
						a: ({ href, children }) => (
							<a
								href={href}
								className="text-blue-600 hover:text-blue-800 underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								{children}
							</a>
						),
						code: ({ children }) => (
							<code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
								{children}
							</code>
						),
						pre: ({ children }) => (
							<pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
								{children}
							</pre>
						),
						blockquote: ({ children }) => (
							<blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
								{children}
							</blockquote>
						),
					}}
				>
					{textContent}
				</ReactMarkdown>
			);
		}
	}

	return (
		<div className="markdown-content">
			{segments}
		</div>
	);
}
