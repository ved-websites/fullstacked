export type BaseUser = {
	email: string;
	firstName: string | null;
	lastName: string | null;
	roles: { text: string }[] | null;
	profilePictureRef: string | null;
	online?: boolean | null;
};
