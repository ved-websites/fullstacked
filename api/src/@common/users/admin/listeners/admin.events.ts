import { AdminService } from '../admin.service';

export const ADMIN_CREATE_USER_EVENT_KEY = 'admin.create-user';

export type ADMIN_CREATE_USER_EVENT_TYPE = Parameters<AdminService['sendNewUserRegistrationEmail']>;
