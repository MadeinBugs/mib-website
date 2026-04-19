'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface ConfirmFavoriteModalProps {
	isOpen: boolean;
	loading: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmFavoriteModal({
	isOpen,
	loading,
	onConfirm,
	onCancel,
}: ConfirmFavoriteModalProps) {
	const { t } = usePictureContestLocale();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					onClick={onCancel}
				>
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ duration: 0.3 }}
						className="relative bg-[#f7fff0] rounded-crayon border-2 border-[#1e6259] shadow-2xl p-8 max-w-md w-full"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="font-h2 text-xl font-bold text-neutral-800 mb-3">
							{t.confirmTitle}
						</h3>
						<p className="text-neutral-600 font-body mb-6 leading-relaxed">
							{t.confirmMessage}
						</p>

						<div className="flex gap-3">
							<button
								onClick={onCancel}
								disabled={loading}
								className="flex-1 px-4 py-2 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
							>
								{t.confirmCancel}
							</button>
							<button
								onClick={onConfirm}
								disabled={loading}
								className="flex-1 px-4 py-2 bg-[#04c597] text-white font-semibold rounded-lg hover:bg-[#036b54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? t.choosing : t.confirmYes}
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
