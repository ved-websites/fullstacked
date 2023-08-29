export type BaseNavElement = {
	title: string;
	isPublic?: boolean;
	drawerIconPath?: string;
	roles?: string[];
};

export type LinkNavElement = BaseNavElement & {
	url: `/${string}`;
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

		return navElem.url === route;
	}) as LinkNavElement | undefined;

	return navElemFound;
}

export function rolesIntersect(roles1: string[], roles2: string[]) {
	return roles1.some((role1) => roles2.some((role2) => role2 === role1));
}
