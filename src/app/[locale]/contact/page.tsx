import { getTranslations, normalizeLocale } from '../../../lib/i18n';
import ContentLayout from '../../../components/ContentLayout';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);

	// Load translations
	const t = await getTranslations(locale);

	return (
		<ContentLayout translations={t} locale={locale}>
			<div className="space-y-16">
				{/* Page Header */}
				<div className="text-center space-y-6">
					<h1 className="heading-crayon">
						{t.pages.contact.title}
					</h1>
					<p className="text-2xl md:text-3xl font-bold text-gray-800 max-w-3xl mx-auto">
						{locale === 'en'
							? "Let's create something amazing together!"
							: 'Vamos criar algo incrível juntos!'
						}
					</p>
				</div>

				{/* Contact Emails */}
				<div className="max-w-4xl mx-auto">
					<div className="grid md:grid-cols-2 gap-8">
						{/* General Contact */}
						<div className="content-card text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<div className="space-y-4">
								<div className="text-5xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 cursor-pointer">
									🦋
								</div>
								<h2 className="text-xl md:text-2xl font-bold text-gray-800">
									{locale === 'en' ? 'Say Hello!' : 'Diga Olá!'}
								</h2>
								<p className="text-sm md:text-base text-gray-600">
									{locale === 'en' ? 'Send us some insect pics!' : 'Nos mande fotos de insetos!'}
								</p>
								<a
									href="mailto:hello@madeinbugs.com.br"
									className="inline-block text-lg md:text-xl font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-200 hover:scale-105 transform"
								>
									hello@madeinbugs.com.br
								</a>
							</div>
						</div>

						{/* Work/Jobs Contact */}
						<div className="content-card text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<div className="space-y-4">
								<div className="text-5xl group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 cursor-pointer">
									🐞
								</div>
								<h2 className="text-xl md:text-2xl font-bold text-gray-800">
									{locale === 'en' ? 'Work With Us!' : 'Trabalhe Conosco!'}
								</h2>
								<p className="text-sm md:text-base text-gray-600">
									{locale === 'en' ? 'Ready to make some bugs... I mean, games?' : 'Hora de fazer alguns bugs... digo, jogos?'}
								</p>
								<a
									href="mailto:hello@madeinbugs.com.br"
									className="inline-block text-lg md:text-xl font-semibold text-green-600 hover:text-green-800 transition-colors duration-200 hover:scale-105 transform"
								>
									hello@madeinbugs.com.br
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Social Media */}
				<div className="max-w-2xl mx-auto text-center space-y-8">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800">
						{locale === 'en' ? 'Follow our tracks' : 'Siga nossas pegadas'}
					</h2>

					<div className="flex justify-center space-x-8">
						{/* LinkedIn */}
						<a
							href="https://www.linkedin.com/company/made-in-bugs/"
							target="_blank"
							rel="noopener noreferrer"
							className="group w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
							title="LinkedIn"
						>
							<svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
							</svg>
						</a>

						{/* Instagram */}
						<a
							href="https://www.instagram.com/madeinbugs?igsh=MThnZGx2cDZieTVnbw=="
							target="_blank"
							rel="noopener noreferrer"
							className="group w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
							title="Instagram"
						>
							<svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z" />
							</svg>
						</a>

						{/* Discord */}
						<a
							href="https://discord.gg/YX9aDaYwnx"
							target="_blank"
							rel="noopener noreferrer"
							className="group w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
							title="Discord"
						>
							<svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</ContentLayout>
	);
}
