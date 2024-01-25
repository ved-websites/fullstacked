import { OnboardingDto } from '$users/onboarding/onboarding.dto';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { E2ETestManager, users } from './utils/E2ETestManager';

describe('OnboardingModule (e2e)', () => {
	const manager = new E2ETestManager({
		defaultUser: null,
		createUser: {
			admin: false,
		},
	});

	beforeAll(async () => {
		await manager.beforeAll();
	});
	afterAll(async () => {
		await manager.afterAll();
	});
	beforeEach(async () => {
		await manager.beforeEach();
	});

	it('returns setup page on first call', async () => {
		const response = await manager.rest('get', '/');

		expect(response.statusCode).toBe(200);
		expect(response.text).toContain('Setup');
	});

	it('returns generic page after creating initial user', async () => {
		await manager.rest('get', '/');

		const adminUser = users['admin'];

		await manager.rest('post', '/').send({
			email: adminUser.email,
			password: adminUser.password as string,
		} satisfies OnboardingDto);

		const response = await manager.rest('get', '/');

		expect(response.statusCode).toBe(200);
		expect(response.text).not.toContain('Setup');

		expect(response.text).toContain('API');
	});
});
