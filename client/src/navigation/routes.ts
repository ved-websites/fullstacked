import type { NavElement } from '$lib/components/nav/nav-elements';

export const navElements: NavElement[] = [
	{
		title: 'About',
		url: '/about',
		isPublic: true,
		drawerIconPath: 'i-mdi-information',
	},
	{
		title: 'Chat',
		url: '/chat',
		drawerIconPath: 'i-mdi-chat',
	},
	{
		title: 'Admin',
		id: 'admin',
		drawerIconPath: 'i-mdi-shield-crown',
		roles: ['admin'],
		elements: [
			{
				title: 'User Management',
				url: '/admin/users',
				drawerIconPath: 'i-mdi-account-details',
			},
			{
				title: 'Data',
				url: '/admin/data',
				drawerIconPath: 'i-mdi-abacus',
			},
		],
	},
];
