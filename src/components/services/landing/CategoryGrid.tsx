import Link from 'next/link';
import { FaServer, FaCogs, FaBolt, FaAddressBook, FaEnvelope, FaChartLine, FaToolbox, FaShareAlt, FaGamepad } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { Translations } from '@/lib/i18n';

interface CategoryGridProps {
	locale: string;
	t: Translations['services']['landing']['categories'];
}

const CATEGORIES: Array<{ key: string; labelKey: keyof Omit<CategoryGridProps['t'], 'title'>; Icon: IconType }> = [
	{ key: 'infrastructure', labelKey: 'infrastructure', Icon: FaServer },
	{ key: 'cicd', labelKey: 'cicd', Icon: FaCogs },
	{ key: 'automation', labelKey: 'automation', Icon: FaBolt },
	{ key: 'crm', labelKey: 'crm', Icon: FaAddressBook },
	{ key: 'marketing', labelKey: 'marketing', Icon: FaEnvelope },
	{ key: 'analytics', labelKey: 'analytics', Icon: FaChartLine },
	{ key: 'team-management', labelKey: 'teamManagement', Icon: FaToolbox },
	{ key: 'social-media', labelKey: 'socialMedia', Icon: FaShareAlt },
	{ key: 'web-gamedev', labelKey: 'webGamedev', Icon: FaGamepad },
];

const ICON_COLORS = [
	'#3dd68c', '#1ed8a4', '#58d5ba', '#49c3db', '#75c7f0',
	'#9db1ff', '#b0a9ff', '#bba5ff', '#d59cff', '#dc8fe8',
	'#ff80ca',
];

export default function CategoryGrid({ locale, t }: CategoryGridProps) {
	return (
		<section className="px-6 py-16">
			<div className="max-w-5xl mx-auto">
				<h2 className="text-2xl font-bold text-service-text-primary mb-10 text-center">
					{t.title}
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
					{CATEGORIES.map((cat, index) => (
						<Link
							key={cat.key}
							href={`/${locale}/services/infra-builder?category=${cat.key}`}
							className="p-4 bg-service-bg-elevated rounded-xl border-2 border-service-border hover:border-service-accent transition-colors text-center"
						>
							<cat.Icon
								className="text-3xl mx-auto mb-2"
								style={{ color: ICON_COLORS[index % ICON_COLORS.length] }}
							/>
							<span className="font-semibold text-service-text-primary text-sm">
								{t[cat.labelKey]}
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
