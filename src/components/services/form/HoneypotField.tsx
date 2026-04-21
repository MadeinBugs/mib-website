'use client';

export default function HoneypotField() {
	return (
		<div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
			<label htmlFor="company_url_confirm">Website</label>
			<input
				type="text"
				id="company_url_confirm"
				name="company_url_confirm"
				tabIndex={-1}
				autoComplete="off"
			/>
		</div>
	);
}
