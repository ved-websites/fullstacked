import { vi } from 'vitest';

export const loadLuciaModule = () => import('lucia');
export const loadLuciaUtils = () => import('lucia/utils');
export const loadPrismaAdapterModule = () => import('@lucia-auth/adapter-prisma');
export const loadLuciaMiddleware = () => import('lucia/middleware');

export const loadLuciaCryptoNode18 = vi.fn();
