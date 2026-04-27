import { toast } from 'sonner';

export function toastVoted(message: string) {
	toast(message, {
		style: {
			background: '#04c597',
			color: '#ffffff',
			border: 'none',
		},
	});
}

export function toastUnvoted(message: string) {
	toast(message, {
		style: {
			background: '#f59e0b',
			color: '#ffffff',
			border: 'none',
		},
	});
}

export function toastVoteFailed(message: string) {
	toast(message, {
		style: {
			background: '#ef4444',
			color: '#ffffff',
			border: 'none',
		},
	});
}
