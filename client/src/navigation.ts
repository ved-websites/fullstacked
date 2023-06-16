import { mdiHome, mdiInformation, mdiAbacus, mdiSpiritLevel } from '@mdi/js';
import type { NavElement } from '$lib/components/nav/nav-elements';

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
		title: 'Testing multi-level',
		id: 'test',
		isPublic: true,
		drawerIconPath: mdiSpiritLevel,
		elements: [
			{
				title: 'test1',
				url: '/nani',
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
