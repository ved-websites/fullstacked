import type { Session, User } from '$prisma-client';

export type AppUser = Prettify<User & { hashedPassword: null; fullName: string | null }>;

export type LiveUser = Prettify<User & { online: boolean }>;

export type UserContainer = { user: AppUser | null; session: Session | null };

export interface SessionWithToken extends Session {
	token: string;
}
