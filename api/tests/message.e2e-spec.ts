import assert from 'assert';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { r } from '~contract';
import { E2ETestManager, users } from './utils/E2ETestManager';

describe('MessageModule (e2e)', () => {
	const manager = new E2ETestManager();

	beforeAll(async () => {
		await manager.beforeAll();
	});
	afterAll(async () => {
		await manager.afterAll();
	});
	beforeEach(async () => {
		await manager.beforeEach();
	});

	it('return no messages', async () => {
		const response = await manager.tsrest(r.messages.list).expect(200);

		const messages = response.body;

		assert(messages);

		expect(Array.isArray(messages)).toBe(true);
		expect(messages.length).toBe(0);
	});

	it('return all messages', async () => {
		const user = users['admin'];

		await manager.prisma.message.createMany({
			data: [
				{
					text: 'Hellow World!',
					userId: user.instance!.id,
				},
				{
					text: 'Hellow World 2!',
					userId: user.instance!.id,
				},
			],
		});

		const response = await manager.tsrest(r.messages.list).expect(200);

		const messages = response.body;

		assert(messages);

		expect(Array.isArray(messages)).toBe(true);
		expect(messages.length).toBe(2);

		messages.forEach((message: unknown) => {
			expect(message).toMatchObject({
				text: expect.any(String),
				time: expect.any(String),
			});
		});
	});
});
