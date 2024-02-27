import type { NavElement } from '$lib/components/nav/nav-elements';
import { Roles, type I18nKey } from '~shared';

export const navElements: NavElement[] = [
	{
		title: 'navbar.navigation.about' satisfies I18nKey,
		url: '/about',
		isPublic: true,
		drawerIconPath: 'i-mdi-information',
	},
	{
		title: 'navbar.navigation.chat' satisfies I18nKey,
		url: '/chat',
		drawerIconPath: 'i-mdi-chat',
		roles: [Roles.CHAT],
	},
	{
		title: 'navbar.navigation.admin' satisfies I18nKey,
		id: 'admin',
		drawerIconPath: 'i-mdi-shield-crown',
		roles: [Roles.ADMIN],
		elements: [
			{
				title: 'navbar.navigation.admin-users' satisfies I18nKey,
				url: '/admin/users',
				drawerIconPath: 'i-mdi-account-details',
				matches: [/\/admin\/users\/.+/],
			},
		],
	},
];
