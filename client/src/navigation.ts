import type { NavElement } from '$lib/components/nav/nav-elements';
import { mdiAbacus, mdiHome, mdiInformation, mdiSpiritLevel } from '@mdi/js';

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
		title: 'Data Driven',
		id: 'test',
		isPublic: true,
		drawerIconPath: mdiSpiritLevel,
		elements: [
			{
				title: 'Data',
				url: '/data',
				isPublic: true,
				drawerIconPath: mdiAbacus,
			},
			{
				title: 'Chat',
				url: '/chat',
				isPublic: true,
				drawerIconPath: mdiAbacus,
			},
		],
	},
	{
		title: 'Services',
		url: '/services',
	},
	{
		title: 'Pricing',
		url: '/pricing',
	},
	{
		title: 'Contact',
		url: '/contact',
	},
];
