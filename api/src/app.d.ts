import type { Auth as ApiAuth } from '$auth/lucia/lucia.factory';
import type { AuthRequest, Session } from 'lucia';

declare global {
	declare namespace Lucia {
		type Auth = ApiAuth;

		type DatabaseUserAttributes = {
			email: string;
			firstName?: string;
			lastName?: string;
			registerToken?: string | null;
			avatarRef?: string;
		};
		// type DatabaseSessionAttributes = {};
	}

	declare namespace Express {
		interface Locals {
			authRequest: AuthRequest<ApiAuth>;
		}

		interface Request {
			session: Session | null;
			sessionId: string | null;
		}
	}
}

export {};
