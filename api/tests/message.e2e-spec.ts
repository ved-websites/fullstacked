import { BaseModules } from '$/app.helpers';
import { MessageModule } from '$/message/message.module';
import type { Message } from '$prisma-graphql/message';
import type { ApolloServer } from '@apollo/server';
import type { ApolloDriver } from '@nestjs/apollo';
import type { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import assert from 'assert';
import gql from 'graphql-tag';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { prepareTestDb } from '../prisma/utils/functions';

beforeAll(async () => {
	await prepareTestDb();
});

describe('MessageController (e2e)', () => {
	let app: INestApplication;
	let apolloServer: ApolloServer;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [...BaseModules, MessageModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const module = moduleFixture.get<GraphQLModule<ApolloDriver>>(GraphQLModule);

		apolloServer = module.graphQlAdapter.instance;
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', async () => {
		const result = await apolloServer.executeOperation<{ messages: Message[] }>({
			query: gql`
				query {
					messages {
						text
						time
					}
				}
			`,
			// variables: {},
		});

		const data = (function () {
			if (result.body.kind == 'single') {
				return result.body.singleResult.data;
			}
		})();

		assert(data);

		expect(Array.isArray(data.messages)).toBe(true);
		expect(data.messages.length).toBe(3);

		data.messages.forEach((message: any) => {
			expect(message).toEqual({
				text: expect.any(String),
				time: expect.any(String),
			});
		});
	});
});
