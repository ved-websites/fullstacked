export type BaseNavElement = {
	title: string;
	isPublic?: boolean;
	drawerIconPath?: string;
};

export type LinkNavElement = BaseNavElement & {
	url: `/${string}`;
};
export type GroupNavElement = BaseNavElement & {
	id: string;
	elements: LinkNavElement[];
};

export type NavElement = LinkNavElement | GroupNavElement;
