'use client';

import { useState } from 'react';

interface PreferencesStrings {
	successTitle: string;
	successMessage: string;
	preferencesTitle: string;
	preferencesDescription: string;
	studioLabel: string;
	studioDescription: string;
	devlogLabel: string;
	devlogDescription: string;
	preferencesConfirm: string;
	preferencesDismiss: string;
}

interface PreferencesModalProps {
	email: string;
	t: PreferencesStrings;
	onClose: () => void;
}

export default function PreferencesModal({ email, t, onClose }: PreferencesModalProps) {
	const [studio, setStudio] = useState(false);
	const [devlog, setDevlog] = useState(false);
	const [sending, setSending] = useState(false);

	async function handleConfirm() {
		const tags: string[] = [];
		if (studio) tags.push('studio');
		if (devlog) tags.push('devlog');

		// If nothing selected, treat as dismiss
		if (tags.length === 0) {
			onClose();
			return;
		}

		setSending(true);
		try {
			await fetch('/api/newsletter/preferences', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, tags }),
			});
		} catch {
			// Silently fail — preferences are optional
		}
		onClose();
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
		>
			<div className="bg-white rounded-lg border-2 border-amber-300 shadow-xl max-w-md w-full p-6 space-y-5 animate-in">
				{/* Success header */}
				<div className="text-center space-y-2">
					<h3 className="font-h2 text-xl font-bold text-neutral-800">
						{t.successTitle}
					</h3>
					<p className="font-body text-sm text-gray-600">
						{t.successMessage}
					</p>
				</div>

				{/* Divider */}
				<hr className="border-amber-200" />

				{/* Preferences */}
				<div className="space-y-3">
					<h4 className="font-h2 font-bold text-neutral-800">
						{t.preferencesTitle}
					</h4>
					<p className="font-body text-sm text-gray-500">
						{t.preferencesDescription}
					</p>

					{/* Studio checkbox */}
					<label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors cursor-pointer">
						<input
							type="checkbox"
							checked={studio}
							onChange={(e) => setStudio(e.target.checked)}
							className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
						/>
						<div>
							<span className="font-body font-medium text-sm text-neutral-800">
								{t.studioLabel}
							</span>
							<p className="font-body text-xs text-gray-500 mt-0.5">
								{t.studioDescription}
							</p>
						</div>
					</label>

					{/* Devlog checkbox */}
					<label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors cursor-pointer">
						<input
							type="checkbox"
							checked={devlog}
							onChange={(e) => setDevlog(e.target.checked)}
							className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
						/>
						<div>
							<span className="font-body font-medium text-sm text-neutral-800">
								{t.devlogLabel}
							</span>
							<p className="font-body text-xs text-gray-500 mt-0.5">
								{t.devlogDescription}
							</p>
						</div>
					</label>
				</div>

				{/* Action buttons */}
				<div className="flex flex-col sm:flex-row gap-2 pt-1">
					<button
						onClick={handleConfirm}
						disabled={sending}
						className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300
							text-white font-bold text-sm rounded-lg transition-all duration-200
							hover:scale-105 active:scale-95 disabled:hover:scale-100"
					>
						{t.preferencesConfirm}
					</button>
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200
							text-gray-700 font-medium text-sm rounded-lg transition-all duration-200"
					>
						{t.preferencesDismiss}
					</button>
				</div>
			</div>
		</div>
	);
}
