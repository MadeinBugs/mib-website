// Utility function to handle image paths
export function getImagePath(path: string): string {
	// Remove leading slash if present
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;
	return `/${cleanPath}`;
}
