'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { getImagePath } from '../lib/imagePaths';

interface MarkdownDescriptionProps {
	content: string;
	projectId: string;
}

export default function MarkdownDescription({ content, projectId }: MarkdownDescriptionProps) {
	// Custom function to process image syntax [image.jpg]
	const processedContent = content.replace(
		/\[([^\]]+\.(jpg|jpeg|png|gif|webp))\]/gi,
		(match, filename) => {
			return `![](/assets/projects/${projectId}/${filename})`;
		}
	);

	return (
		<div className="markdown-content">
			<ReactMarkdown
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
					img: ({ src, alt }) => {
						if (!src || typeof src !== 'string') return null;

						return (
							<div className="my-6 rounded-lg overflow-hidden shadow-lg">
								<Image
									src={getImagePath(src)}
									alt={alt || 'Project image'}
									width={800}
									height={600}
									className="w-full h-auto object-cover"
									unoptimized={src.endsWith('.gif')}
								/>
							</div>
						);
					},
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
				{processedContent}
			</ReactMarkdown>
		</div>
	);
}
