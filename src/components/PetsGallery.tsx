'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getImagePath } from '../lib/imagePaths';

interface Pet {
	id: number;
	name: string;
	description: {
		en: string;
		'pt-BR': string;
	};
	image: string;
	active?: boolean;
}

interface PetsGalleryProps {
	pets: Pet[];
	locale: 'en' | 'pt-BR';
}

export default function PetsGallery({ pets, locale }: PetsGalleryProps) {
	const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

	// Filter only active pets
	const activePets = pets.filter(pet => pet.active !== false);

	if (activePets.length === 0) {
		return (
			<div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
				<p className="font-body text-lg">
					{locale === 'en'
						? 'No pet photos currently 😥'
						: 'Nenhuma foto de pet no momento 😥'
					}
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				{activePets.map((pet) => (
					<motion.div
						key={pet.id}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
						onClick={() => setSelectedPet(pet)}
					>
						<Image
							src={getImagePath(pet.image)}
							alt={pet.name}
							fill
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
							<div className="absolute bottom-0 left-0 right-0 p-3">
								<p className="text-white font-semibold text-sm">{pet.name}</p>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Modal for pet details */}
			<AnimatePresence>
				{selectedPet && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
						onClick={() => setSelectedPet(null)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="relative aspect-video">
								<Image
									src={getImagePath(selectedPet.image)}
									alt={selectedPet.name}
									fill
									className="object-cover"
								/>
								<button
									onClick={() => setSelectedPet(null)}
									className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<div className="p-6">
								<h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPet.name}</h3>
								<p className="text-gray-700">{selectedPet.description[locale]}</p>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
