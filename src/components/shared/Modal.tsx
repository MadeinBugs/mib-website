'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeClasses: Record<string, string> = {
	sm: 'max-w-sm w-full',
	md: 'max-w-md w-full',
	lg: 'max-w-2xl w-full',
	full: 'w-full h-full max-w-none max-h-none rounded-none',
};

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = 'md',
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);

	// Capture the element that triggered the modal
	useEffect(() => {
		if (isOpen) {
			triggerRef.current = document.activeElement as HTMLElement;
		}
	}, [isOpen]);

	// Trap focus within modal
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
				return;
			}

			if (e.key !== 'Tab' || !modalRef.current) return;

			const focusable = modalRef.current.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		},
		[onClose]
	);

	// Keep handler in a ref so the effect only re-runs when isOpen changes,
	// not on every parent re-render (which would steal focus from inputs).
	const handleKeyDownRef = useRef(handleKeyDown);
	handleKeyDownRef.current = handleKeyDown;

	// Add/remove keydown listener and body scroll lock
	useEffect(() => {
		if (!isOpen) return;

		const listener = (e: KeyboardEvent) => handleKeyDownRef.current(e);
		document.addEventListener('keydown', listener);
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		// Focus the modal container
		modalRef.current?.focus();

		return () => {
			document.removeEventListener('keydown', listener);
			document.body.style.overflow = originalOverflow;
			// Restore focus to trigger element
			triggerRef.current?.focus();
		};
	}, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

	const isFull = size === 'full';

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className={`fixed inset-0 z-50 flex items-center justify-center ${isFull ? '' : 'p-4'}`}
					onClick={onClose}
				>
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
					<motion.div
						ref={modalRef}
						tabIndex={-1}
						initial={{ opacity: 0, scale: isFull ? 1 : 0.9, y: isFull ? 0 : 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: isFull ? 1 : 0.9, y: isFull ? 0 : 20 }}
						transition={{ duration: 0.3 }}
						className={`relative bg-service-bg-elevated ${isFull ? '' : 'rounded-xl border border-service-border'} shadow-2xl flex flex-col outline-none ${sizeClasses[size]}`}
						style={isFull ? { height: '100dvh' } : { maxHeight: '90dvh' }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						{(title || true) && (
							<div className="flex items-center justify-between px-6 py-4 border-b border-service-border shrink-0">
								{title && (
									<h2 className="font-bold text-lg text-service-text-primary">
										{title}
									</h2>
								)}
								<button
									onClick={onClose}
									className="ml-auto p-1 text-service-text-tertiary hover:text-service-text-primary transition-colors rounded-lg hover:bg-service-bg-strong"
									aria-label="Close"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						)}

						{/* Body */}
						<div className="flex-1 overflow-y-auto px-6 py-4">
							{children}
						</div>

						{/* Footer */}
						{footer && (
							<div className="px-6 py-4 border-t border-service-border shrink-0">
								{footer}
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
