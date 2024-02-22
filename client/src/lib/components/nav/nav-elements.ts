import type { RoleSpec } from '~shared';

export type BaseNavElement = {
	title: string;
	isPublic?: boolean;
	drawerIconPath?: string;
	roles?: RoleSpec[];
};

export type LinkNavElement = BaseNavElement & {
	url: `/${string}`;
	matches?: (`/${string}` | RegExp)[];
};
export type GroupNavElement = BaseNavElement & {
	id: string;
	elements: LinkNavElement[];
};

export type NavElement = LinkNavElement | GroupNavElement;

export function getNavElement(navElements: NavElement[], route: string) {
	const navElemFound = navElements.find((navElem) => {
		if ('elements' in navElem) {
			return getNavElement(navElem.elements, route);
		}

		const navElemMatches = [navElem.url, ...(navElem.matches ?? [])];

		const result = navElemMatches.some((matcher) => route.match(matcher));

		return result;
	}) as LinkNavElement | undefined;

	return navElemFound;
}
