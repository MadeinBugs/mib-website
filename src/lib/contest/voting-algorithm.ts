export interface VotingPhoto {
	id: number;
	pictureId: number;
	storagePath: string;
	voteCount: number;
	imageUrl: string | null;
}

/** Mulberry32 seeded PRNG — deterministic for a given seed. */
function seededRandom(seed: number) {
	return function () {
		seed |= 0;
		seed = seed + 0x6d2b79f5 | 0;
		let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}

/**
 * Orders photos: interleaves low-vote and high-vote photos (2 low : 1 high),
 * then applies a windowed shuffle (groups of 4) for local variety without
 * destroying the global interleave pattern.
 */
export function orderPhotosForVoting(photos: VotingPhoto[], seed: number): VotingPhoto[] {
	if (photos.length === 0) return [];

	const rand = seededRandom(seed);

	// Sort by vote count ascending, random tiebreaking
	const sorted = [...photos].sort((a, b) => {
		const voteDiff = a.voteCount - b.voteCount;
		if (voteDiff !== 0) return voteDiff;
		return rand() - 0.5;
	});

	// Interleave: 2 low-vote slots, then 1 high-vote slot
	const result: VotingPhoto[] = [];
	let low = 0;
	let high = sorted.length - 1;
	let turn = 0;

	while (low <= high) {
		if (turn % 3 === 2) {
			result.push(sorted[high--]);
		} else {
			result.push(sorted[low++]);
		}
		turn++;
	}

	// Windowed shuffle — groups of 4 for local variety
	const WINDOW = 4;
	for (let i = 0; i < result.length; i += WINDOW) {
		const windowEnd = Math.min(i + WINDOW, result.length);
		for (let j = windowEnd - 1; j > i; j--) {
			const k = i + Math.floor(rand() * (j - i + 1));
			[result[j], result[k]] = [result[k], result[j]];
		}
	}

	return result;
}
