import type { User } from '$prisma-client';
import type { LuciaSession, LuciaUser } from '../types';

export type LuciaContainer = { user: LuciaUser | null; session: LuciaSession | null };

export type EnhancedUser<U extends User = User> = U & { hashedPassword: null; fullName: string | null };
