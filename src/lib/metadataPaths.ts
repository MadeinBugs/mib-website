// Utility function to handle metadata asset paths
export function getMetadataAssetPath(path: string): string {
	// Remove leading slash if present
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;
	return `/${cleanPath}`;
}
