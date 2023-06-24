import type { NavElement } from '$lib/components/nav/nav-elements';
import { mdiAbacus, mdiAccountDetails, mdiChat, mdiHome, mdiInformation, mdiSpiritLevel } from '@mdi/js';

export const navElements: NavElement[] = [
	{
		title: 'Home',
		url: '/',
		isPublic: true,
		drawerIconPath: mdiHome,
	},
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
		title: 'Multi Level',
		id: 'test',
		drawerIconPath: mdiSpiritLevel,
		elements: [
			{
				title: 'Data',
				url: '/data',
				drawerIconPath: mdiAbacus,
			},
		],
	},
	{
		title: 'User Management',
		url: '/users',
		drawerIconPath: mdiAccountDetails,
		roles: ['admin'],
	},
];
