import { c } from '~contract';
import { adminContract } from './admin/admin.contract';

export const usersContract = c.router({
	admin: adminContract,
});
