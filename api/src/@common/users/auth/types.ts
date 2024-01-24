import type { User as PrismaUser } from '$prisma-client';
import type { Session, User } from 'lucia';

export type LuciaSession = Session;
export type LuciaUser = User;

export type LiveUser = PrismaUser & { online: boolean };
