// import type { LayoutLoad } from './$types';
// import { redirect } from '@sveltejs/kit';
// import { handleLoginRedirect } from '$/lib/utils/login';

// const allowedRoutes = ['/login', '/about'];

// export const load = (async ({ url, fetch, data, depends }) => {
// 	depends('supabase:auth');

// 	const supabase = createSupabaseLoadClient({
// 		supabaseUrl: PUBLIC_SUPABASE_URL,
// 		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
// 		event: { fetch },
// 		serverSession: data.session
// 	});

// 	const {
// 		data: { session }
// 	} = await supabase.auth.getSession();

// 	if (!session && !allowedRoutes.some((route) => url.pathname.endsWith(route))) {
// 		throw redirect(307, handleLoginRedirect(url));
// 	}

// 	return { supabase, session };
// }) satisfies LayoutLoad;
