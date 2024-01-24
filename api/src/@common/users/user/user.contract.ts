import { c } from '~contract';
import { userProfileContract } from './profile/profile.contract';
import { userSecurityContract } from './security/security.contract';

export const userContract = c.router({
	settings: {
		profile: userProfileContract,
		security: userSecurityContract,
	},
});
