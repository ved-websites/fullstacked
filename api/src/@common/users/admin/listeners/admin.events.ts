import { createEventDefinition } from '$events/event.definition';
import { AdminService } from '../admin.service';

export const ADMIN_CREATE_USER_EVENT = createEventDefinition<Parameters<AdminService['sendNewUserRegistrationEmail']>>('admin.create-user');
