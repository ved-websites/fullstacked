import type { User } from 'lucia';

export const ADMIN_CREATE_USER_EVENT_KEY = 'admin.create-user';

export type ADMIN_CREATE_USER_EVENT_TYPE = {
	user: User;
	options: { origin: string; originUser: User };
};
