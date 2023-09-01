import assert from 'assert';
import gql from 'graphql-tag';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { GetEmptyMessagesQuery } from './_generated/graphql';
import { E2ETestManager, users } from './utils/E2ETestManager';

vi.mock('$auth/lucia/modules-compat');

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
		const response = await manager
			.gql<GetEmptyMessagesQuery>()
			.query(gql`
				query GetEmptyMessages {
					messages {
						text
						time
					}
				}
			`)
			.expectNoErrors();

		const { data } = response;

		assert(data);

		expect(Array.isArray(data.messages)).toBe(true);
		expect(data.messages.length).toBe(0);
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

		const response = await manager
			.gql<GetEmptyMessagesQuery>()
			.query(gql`
				query GetEmptyMessages {
					messages {
						text
						time
					}
				}
			`)
			.expectNoErrors();

		const { data } = response;

		assert(data);

		expect(Array.isArray(data.messages)).toBe(true);
		expect(data.messages.length).toBe(2);

		data.messages.forEach((message) => {
			expect(message).toEqual({
				text: expect.any(String),
				time: expect.any(String),
			});
		});
	});
});
