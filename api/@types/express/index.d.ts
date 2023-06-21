import type { AuthRequest } from 'lucia-auth';
import type { Auth } from '../../src/@common/lucia/lucia.module';

declare module 'express' {
	interface Response {
		auth: AuthRequest<Auth>;
	}
}
