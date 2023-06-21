import type { AuthRequest } from 'lucia-auth';
import type { Auth } from '../../src/@common/lucia/lucia.module';

declare global {
	namespace Express {
		interface Response {
			auth: AuthRequest<Auth>;
		}
	}
}
