import type {
	SelectedItemSnapshot,
	Currency,
	Locale,
} from '@/lib/services/types';
import { formatPrice } from '@/lib/services/format';
import { FaGift } from 'react-icons/fa';

interface QuoteSnapshotProps {
	selectedItems: SelectedItemSnapshot[];
	currency: Currency;
	locale: Locale;
	setupPrice: number;
	totalPrice: number;
	maintenanceMonths: number;
	maintenanceMonthlyPrice: number;
	maintenanceTotal: number;
	hasPendingItems: boolean;
	pendingItemCount: number;
}

export default function QuoteSnapshot({
	selectedItems,
	currency,
	locale,
	setupPrice,
	totalPrice,
	maintenanceMonths,
	maintenanceMonthlyPrice,
	maintenanceTotal,
	hasPendingItems,
	pendingItemCount,
}: QuoteSnapshotProps) {
	return (
		<div className="space-y-6">
			{/* Itemized list */}
			<div className="space-y-3">
				<h2 className="font-bold text-neutral-800">
					{locale === 'en' ? 'Services' : 'Serviços'}
				</h2>

				{selectedItems.map((item) => (
					<div key={item.serviceId} className="border border-neutral-200 rounded-lg p-4 space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm text-neutral-800">
									{item.serviceName[locale]}
								</span>
								{item.bundledFree && (
									<span className="inline-flex items-center gap-1 text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
										<FaGift className="text-[10px]" />
										{locale === 'en' ? 'bundled free' : 'incluído grátis'}
									</span>
								)}
							</div>
							<span className="text-sm font-medium text-neutral-700">
								{item.bundledFree
									? formatPrice(0, currency)
									: formatPrice(item.basePrice[currency], currency)}
							</span>
						</div>

						{/* Configuration options */}
						{item.configurations.length > 0 && (
							<div className="pl-3 border-l-2 border-neutral-100 space-y-1">
								{item.configurations.map((config) => (
									<div key={config.configurationId}>
										<p className="text-xs text-neutral-500">{config.configurationLabel[locale]}</p>
										{config.selectedOptions.map((opt) => (
											<div key={opt.optionId} className="flex items-center justify-between">
												<span className="text-xs text-neutral-600 pl-2">
													{opt.optionLabel[locale]}
												</span>
												{(opt.priceModifier[currency] !== 0) && (
													<span className="text-xs text-neutral-500">
														{opt.priceModifier[currency] > 0 ? '+' : ''}
														{formatPrice(opt.priceModifier[currency], currency)}
													</span>
												)}
											</div>
										))}
									</div>
								))}
							</div>
						)}

						{/* Custom fields */}
						{item.customFields.length > 0 && (
							<div className="pl-3 border-l-2 border-neutral-100 space-y-1">
								{item.customFields.map((cf) => (
									<div key={cf.customFieldId}>
										<p className="text-xs text-neutral-500">{cf.customFieldLabel[locale]}</p>
										{cf.values.map((val, idx) => (
											<p key={idx} className="text-xs text-neutral-600 pl-2">
												{val}
											</p>
										))}
										{cf.pendingPricing && (
											<span className="text-xs text-amber-600 font-medium">
												⏱ {locale === 'en' ? 'Pricing pending review' : 'Preço sob consulta'}
											</span>
										)}
									</div>
								))}
							</div>
						)}

						{/* Third-party costs */}
						{item.thirdPartyCosts.length > 0 && (
							<div className="pl-3 border-l-2 border-amber-100 space-y-1">
								{item.thirdPartyCosts.map((cost) => (
									<div key={cost.id} className="flex items-center justify-between">
										<span className="text-xs text-amber-700">{cost.label[locale]}</span>
										<span className="text-xs text-amber-600">
											~{formatPrice(cost.amount[currency], currency)}
											{cost.amountMax && `–${formatPrice(cost.amountMax[currency], currency)}`}
											/{cost.frequency === 'monthly' ? (locale === 'en' ? 'mo' : 'mês')
												: cost.frequency === 'yearly' ? (locale === 'en' ? 'yr' : 'ano')
													: (locale === 'en' ? 'once' : 'único')}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Pending items notice */}
			{hasPendingItems && (
				<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
					<p className="text-sm text-amber-800">
						⏱ {pendingItemCount} {locale === 'en'
							? `item${pendingItemCount !== 1 ? 's' : ''} require review — we'll include pricing in our response.`
							: `ite${pendingItemCount !== 1 ? 'ns precisam de' : 'm precisa de'} revisão — incluiremos o preço na nossa resposta.`}
					</p>
				</div>
			)}

			{/* Maintenance */}
			{maintenanceMonths > 0 && (
				<div className="bg-neutral-50 rounded-lg p-4 space-y-1">
					<h3 className="text-sm font-medium text-neutral-700">
						{locale === 'en' ? 'Maintenance Plan' : 'Plano de Manutenção'}
					</h3>
					<p className="text-sm text-neutral-600">
						{maintenanceMonths} {locale === 'en' ? 'months' : 'meses'} × {formatPrice(maintenanceMonthlyPrice, currency)}/
						{locale === 'en' ? 'mo' : 'mês'}
					</p>
					<p className="text-sm font-medium text-neutral-700">
						{locale === 'en' ? 'Maintenance total:' : 'Total manutenção:'} {formatPrice(maintenanceTotal, currency)}
					</p>
				</div>
			)}

			{/* Totals */}
			<div className="border-t border-neutral-200 pt-4 space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-neutral-600">
						{locale === 'en' ? 'Setup' : 'Implementação'}
					</span>
					<span className="font-medium text-neutral-700">{formatPrice(setupPrice, currency)}</span>
				</div>
				{maintenanceTotal > 0 && (
					<div className="flex justify-between text-sm">
						<span className="text-neutral-600">
							{locale === 'en' ? 'Maintenance' : 'Manutenção'}
						</span>
						<span className="font-medium text-neutral-700">{formatPrice(maintenanceTotal, currency)}</span>
					</div>
				)}
				<div className="flex justify-between text-lg pt-2 border-t border-neutral-200">
					<span className="font-bold text-neutral-800">Total</span>
					<span className="font-bold text-neutral-800">{formatPrice(totalPrice, currency)}</span>
				</div>
			</div>
		</div>
	);
}
