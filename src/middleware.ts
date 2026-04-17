import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });
	const pathname = request.nextUrl.pathname;

	// Determine which Supabase project to use based on the route
	const isPictureContestRoute = /^\/(en|pt-BR)\/picture-contest/.test(pathname);

	const supabaseUrl = isPictureContestRoute
		? process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL!
		: process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = isPictureContestRoute
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

	if (isPictureContestRoute) {
		// --- Picture Contest auth ---
		const localeMatch = pathname.match(/^\/(en|pt-BR)/);
		const locale = localeMatch ? localeMatch[1] : 'pt-BR';

		const isPublicRoute = /^\/(en|pt-BR)\/picture-contest\/login/.test(pathname);

		if (!user && !isPublicRoute) {
			const url = request.nextUrl.clone();
			url.pathname = `/${locale}/picture-contest/login`;
			return NextResponse.redirect(url);
		}

		if (user && isPublicRoute) {
			const url = request.nextUrl.clone();
			url.pathname = `/${locale}/picture-contest`;
			return NextResponse.redirect(url);
		}
	} else {
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
		'/en/picture-contest/:path*',
		'/pt-BR/picture-contest/:path*',
	],
};
