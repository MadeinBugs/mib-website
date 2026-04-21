'use client';

export default function HoneypotField() {
	return (
		<div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
			<label htmlFor="website_url">Website</label>
			<input
				type="text"
				id="website_url"
				name="website_url"
				tabIndex={-1}
				autoComplete="off"
			/>
		</div>
	);
}
