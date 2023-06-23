import type { Auth as ApiAuth } from '$common/auth/lucia/lucia.factory';
import type { AuthRequest, Session } from 'lucia';

declare global {
	declare namespace Lucia {
		type Auth = ApiAuth;

		type DatabaseUserAttributes = {
			email: string;
			firstName?: string;
			lastName?: string;
		};
		// type DatabaseSessionAttributes = {};
	}

	declare namespace Express {
		interface Locals {
			auth: AuthRequest<ApiAuth>;
		}

		interface Request {
			session: Session | null;
		}
	}
}

export {};
