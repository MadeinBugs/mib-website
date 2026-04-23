'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaCheckCircle, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export interface QuoteRow {
	id: string;
	status: string;
	created_at: string;
	updated_at: string;
	expires_at: string;
	client_name: string;
	client_email: string;
	studio_name: string | null;
	locale: string;
	currency: string;
	setup_price: number;
	maintenance_months: number;
	total_price: number;
	twenty_opportunity_id: string | null;
	response_sent_at: string | null;
	ref_param: string | null;
}

type SortColumn = 'created_at' | 'status' | 'total_price';

const STATUS_LABELS = ['all', 'new', 'contacted', 'quoted', 'accepted', 'rejected', 'expired'] as const;
type StatusFilter = typeof STATUS_LABELS[number];

const STATUS_COLORS: Record<string, string> = {
	new: 'bg-blue-900/30 text-blue-400',
	contacted: 'bg-amber-900/30 text-amber-400',
	quoted: 'bg-teal-900/30 text-teal-400',
	accepted: 'bg-green-900/30 text-green-400',
	rejected: 'bg-neutral-800 text-neutral-400',
	expired: 'bg-red-900/30 text-red-400',
};

function isSyncPending(quote: QuoteRow): boolean {
	if (quote.twenty_opportunity_id) return false;
	return Date.now() - new Date(quote.created_at).getTime() > 60_000;
}

function formatRelative(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60_000);
	const hours = Math.floor(mins / 60);
	const days = Math.floor(hours / 24);
	if (days > 0) return `${days}d ago`;
	if (hours > 0) return `${hours}h ago`;
	if (mins > 0) return `${mins}m ago`;
	return 'just now';
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: 'short', day: 'numeric', year: 'numeric',
	});
}

function formatPrice(amount: number, currency: string): string {
	if (currency === 'BRL') return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
	return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

interface Props {
	quotes: QuoteRow[];
}

export default function QuoteListClient({ quotes }: Props) {
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
	const [sortColumn, setSortColumn] = useState<SortColumn>('created_at');
	const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
	const [search, setSearch] = useState('');

	function handleSort(col: SortColumn) {
		if (sortColumn === col) {
			setSortDir(d => d === 'asc' ? 'desc' : 'asc');
		} else {
			setSortColumn(col);
			setSortDir('desc');
		}
	}

	const filtered = useMemo(() => {
		let result = quotes;

		if (statusFilter !== 'all') {
			result = result.filter(q => q.status === statusFilter);
		}

		if (search.trim()) {
			const q = search.trim().toLowerCase();
			result = result.filter(quote =>
				quote.client_name.toLowerCase().includes(q) ||
				quote.client_email.toLowerCase().includes(q) ||
				(quote.studio_name ?? '').toLowerCase().includes(q) ||
				quote.id.toLowerCase().includes(q)
			);
		}

		result = [...result].sort((a, b) => {
			let cmp = 0;
			if (sortColumn === 'created_at') {
				cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			} else if (sortColumn === 'status') {
				cmp = a.status.localeCompare(b.status);
			} else if (sortColumn === 'total_price') {
				cmp = a.total_price - b.total_price;
			}
			return sortDir === 'asc' ? cmp : -cmp;
		});

		return result;
	}, [quotes, statusFilter, sortColumn, sortDir, search]);

	const counts = useMemo(() => {
		const c: Record<string, number> = { all: quotes.length };
		for (const q of quotes) {
			c[q.status] = (c[q.status] ?? 0) + 1;
		}
		return c;
	}, [quotes]);

	function SortIcon({ col }: { col: SortColumn }) {
		if (sortColumn !== col) return <FaSort className="inline ml-1 opacity-30 text-xs" />;
		return sortDir === 'asc'
			? <FaSortUp className="inline ml-1 text-service-accent text-xs" />
			: <FaSortDown className="inline ml-1 text-service-accent text-xs" />;
	}

	const syncPendingCount = quotes.filter(isSyncPending).length;

	return (
		<div>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-bold text-white">Quote Requests</h1>
					<p className="text-service-text-secondary text-sm mt-1">
						{quotes.length} total
						{syncPendingCount > 0 && (
							<span className="ml-2 text-amber-400">
								· {syncPendingCount} pending Twenty sync
							</span>
						)}
					</p>
				</div>
				<input
					type="search"
					placeholder="Search by name, email, studio, ID…"
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="w-full sm:w-72 bg-service-bg-elevated border border-service-border rounded-lg px-3 py-2 text-sm text-service-text-primary placeholder:text-service-text-tertiary focus:outline-none focus:border-service-accent"
				/>
			</div>

			{/* Status filter tabs */}
			<div className="flex flex-wrap gap-2 mb-6">
				{STATUS_LABELS.map(s => (
					<button
						key={s}
						onClick={() => setStatusFilter(s)}
						className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${statusFilter === s
							? 'bg-service-accent text-white'
							: 'bg-service-bg-elevated border border-service-border text-service-text-secondary hover:text-white'
							}`}
					>
						{s} {counts[s] !== undefined && <span className="opacity-70">({counts[s] ?? 0})</span>}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<div className="text-center py-16 text-service-text-tertiary">
					<p className="text-lg">No quotes found.</p>
				</div>
			) : (
				<div className="bg-service-bg-elevated border border-service-border rounded-xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-service-border text-service-text-tertiary">
									<th
										className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white transition-colors whitespace-nowrap"
										onClick={() => handleSort('created_at')}
									>
										Date <SortIcon col="created_at" />
									</th>
									<th className="text-left px-4 py-3 font-medium whitespace-nowrap">Client / Studio</th>
									<th
										className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white transition-colors whitespace-nowrap"
										onClick={() => handleSort('status')}
									>
										Status <SortIcon col="status" />
									</th>
									<th
										className="text-right px-4 py-3 font-medium cursor-pointer hover:text-white transition-colors whitespace-nowrap"
										onClick={() => handleSort('total_price')}
									>
										Total <SortIcon col="total_price" />
									</th>
									<th className="text-center px-4 py-3 font-medium whitespace-nowrap">Flags</th>
									<th className="px-4 py-3" />
								</tr>
							</thead>
							<tbody>
								{filtered.map((quote, i) => {
									const syncPending = isSyncPending(quote);
									return (
										<tr
											key={quote.id}
											className={`border-b border-service-border/50 hover:bg-white/[0.02] transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''
												}`}
										>
											<td className="px-4 py-3 whitespace-nowrap">
												<div className="text-service-text-primary font-medium">{formatDate(quote.created_at)}</div>
												<div className="text-service-text-tertiary text-xs">{formatRelative(quote.created_at)}</div>
											</td>
											<td className="px-4 py-3">
												<div className="text-service-text-primary font-medium">{quote.client_name}</div>
												<div className="text-service-text-tertiary text-xs">{quote.client_email}</div>
												{quote.studio_name && (
													<div className="text-service-text-secondary text-xs">{quote.studio_name}</div>
												)}
											</td>
											<td className="px-4 py-3 whitespace-nowrap">
												<span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${STATUS_COLORS[quote.status] ?? 'bg-neutral-800 text-neutral-400'}`}>
													{quote.status}
												</span>
											</td>
											<td className="px-4 py-3 text-right whitespace-nowrap">
												<span className="text-service-text-primary font-semibold">
													{formatPrice(Number(quote.total_price), quote.currency)}
												</span>
												{quote.maintenance_months > 0 && (
													<div className="text-service-text-tertiary text-xs">+{quote.maintenance_months}mo maint.</div>
												)}
											</td>
											<td className="px-4 py-3">
												<div className="flex items-center justify-center gap-2">
													{syncPending && (
														<span title="Twenty sync pending (>60s)" className="text-amber-400">
															<FaExclamationTriangle />
														</span>
													)}
													{quote.response_sent_at && (
														<span title="Response email sent" className="text-green-400">
															<FaCheckCircle />
														</span>
													)}
													{quote.ref_param && (
														<span
															title={`ref: ${quote.ref_param}`}
															className="text-xs bg-service-bg text-service-text-tertiary px-1.5 py-0.5 rounded border border-service-border"
														>
															{quote.ref_param}
														</span>
													)}
												</div>
											</td>
											<td className="px-4 py-3 whitespace-nowrap">
												<Link
													href={`/admin/quotes/${quote.id}`}
													className="text-service-accent hover:underline text-xs font-medium"
												>
													View →
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
