import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });
	const pathname = request.nextUrl.pathname;

	// Normalize /pt-br/... → /pt-BR/... (308 permanent redirect)
	if (pathname.startsWith('/pt-br/')) {
		const url = request.nextUrl.clone();
		url.pathname = '/pt-BR/' + pathname.slice('/pt-br/'.length);
		return NextResponse.redirect(url, 308);
	}

	// Bare /terms or /privacy → detect locale from Accept-Language header
	if (pathname === '/terms' || pathname === '/privacy') {
		const acceptLang = request.headers.get('accept-language') ?? '';
		const locale = /\ben\b/.test(acceptLang.split(',')[0] ?? '') ? 'en' : 'pt-BR';
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}${pathname}`;
		return NextResponse.redirect(url, 302);
	}

	// Legal pages don't need auth — only locale normalization (handled above)
	if (/^\/(en|pt-BR)\/(terms|privacy)/.test(pathname)) {
		return supabaseResponse;
	}

	const isPictureContestRoute = /^\/(en|pt-BR)\/picture-contest/.test(pathname);
	const isPictureContestAdmin = /^\/(en|pt-BR)\/picture-contest\/(gallery|login|logout)/.test(pathname);
	const isMascotRoute = pathname.startsWith('/mascot');

	// Choose which Supabase project to authenticate against
	const supabaseUrl = (isPictureContestAdmin)
		? process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL!
		: process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = (isPictureContestAdmin)
		? process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_ANON_KEY!
		: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

	const supabase = createServerClient(
		supabaseUrl,
		supabaseAnonKey,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						request.cookies.set(name, value)
					);
					supabaseResponse = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// Refresh the auth session (required by @supabase/ssr)
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// --- PICTURE_CONTEST_LIVE gate ---
	// Public picture-contest routes (not admin) are blocked when not live,
	// unless the user is an authenticated admin.
	if (isPictureContestRoute && !isPictureContestAdmin) {
		const isLive = process.env.PICTURE_CONTEST_LIVE === 'true';

		if (!isLive) {
			// Check admin auth against the picture-contest Supabase project
			const adminSupabase = createServerClient(
				process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_ANON_KEY!,
				{
					cookies: {
						getAll() {
							return request.cookies.getAll();
						},
						setAll() { },
					},
				}
			);
			const { data: { user: adminUser } } = await adminSupabase.auth.getUser();

			if (!adminUser) {
				// Not live and not admin → redirect to home
				const url = request.nextUrl.clone();
				url.pathname = '/';
				return NextResponse.redirect(url);
			}
		}

		return supabaseResponse;
	}

	if (isPictureContestAdmin) {
		// --- Picture Contest admin gallery auth ---
		const localeMatch = pathname.match(/^\/(en|pt-BR)/);
		const locale = localeMatch ? localeMatch[1] : 'pt-BR';

		const isLoginRoute = /^\/(en|pt-BR)\/picture-contest\/login/.test(pathname);

		if (!user && !isLoginRoute) {
			const url = request.nextUrl.clone();
			url.pathname = `/${locale}/picture-contest/login`;
			return NextResponse.redirect(url);
		}

		if (user && isLoginRoute) {
			const url = request.nextUrl.clone();
			url.pathname = `/${locale}/picture-contest/gallery`;
			return NextResponse.redirect(url);
		}
	} else if (isMascotRoute) {
		// --- Mascot auth ---
		const isPublicRoute =
			pathname.startsWith('/mascot/login') ||
			pathname.startsWith('/mascot/register') ||
			pathname.startsWith('/mascot/api/validate-invite') ||
			pathname.startsWith('/mascot/api/consume-invite');

		if (!user && !isPublicRoute) {
			const url = request.nextUrl.clone();
			url.pathname = '/mascot/login';
			return NextResponse.redirect(url);
		}

		const isAuthPage =
			pathname.startsWith('/mascot/login') ||
			pathname.startsWith('/mascot/register');
		if (user && isAuthPage) {
			const url = request.nextUrl.clone();
			url.pathname = '/mascot';
			return NextResponse.redirect(url);
		}
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		'/mascot/:path*',
		'/en/picture-contest',
		'/en/picture-contest/:path*',
		'/pt-BR/picture-contest',
		'/pt-BR/picture-contest/:path*',
		'/pt-br/picture-contest',
		'/pt-br/picture-contest/:path*',
		'/en/terms/:path*',
		'/en/privacy/:path*',
		'/pt-BR/terms/:path*',
		'/pt-BR/privacy/:path*',
		'/pt-br/terms/:path*',
		'/pt-br/privacy/:path*',
		'/terms',
		'/privacy',
	],
};