'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
	content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
	return (
		<div className="markdown-content">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					p: ({ children }) => (
						<span className="text-gray-700">{children}</span>
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
							className="text-purple-600 hover:text-purple-700 underline"
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
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
