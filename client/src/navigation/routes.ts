import type { NavElement } from '$lib/components/nav/nav-elements';
import { mdiAbacus, mdiAccountDetails, mdiChat, mdiInformation, mdiShieldCrown } from '@mdi/js';

export const navElements: NavElement[] = [
	{
		title: 'About',
		url: '/about',
		isPublic: true,
		drawerIconPath: mdiInformation,
	},
	{
		title: 'Chat',
		url: '/chat',
		drawerIconPath: mdiChat,
	},
	{
		title: 'Admin',
		id: 'admin',
		drawerIconPath: mdiShieldCrown,
		roles: ['admin'],
		elements: [
			{
				title: 'User Management',
				url: '/users',
				drawerIconPath: mdiAccountDetails,
			},
			{
				title: 'Data',
				url: '/data',
				drawerIconPath: mdiAbacus,
			},
		],
	},
];
