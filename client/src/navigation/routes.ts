import { k } from '$i18n';
import type { NavElement } from '$lib/components/nav/nav-elements';

export const navElements: NavElement[] = [
	{
		title: k('navbar.navigation.about'),
		url: '/about',
		isPublic: true,
		drawerIconPath: 'i-mdi-information',
	},
	{
		title: k('navbar.navigation.chat'),
		url: '/chat',
		drawerIconPath: 'i-mdi-chat',
	},
	{
		title: k('navbar.navigation.admin'),
		id: 'admin',
		drawerIconPath: 'i-mdi-shield-crown',
		roles: ['admin'],
		elements: [
			{
				title: k('navbar.navigation.admin-users'),
				url: '/admin/users',
				drawerIconPath: 'i-mdi-account-details',
			},
			{
				title: k('navbar.navigation.admin-data'),
				url: '/admin/data',
				drawerIconPath: 'i-mdi-abacus',
			},
		],
	},
];
