'use client';

import type { BilingualString, Locale } from '../../../lib/services/types';
import type { ElementType } from 'react';

interface BilingualTextProps {
	text: BilingualString;
	locale: Locale;
	className?: string;
	as?: ElementType;
}

export default function BilingualText({ text, locale, className, as: Tag = 'span' }: BilingualTextProps) {
	return <Tag className={className}>{text[locale]}</Tag>;
}
