import { AppModule } from '$/app.module';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { ApolloServerBase } from 'apollo-server-core';
import gql from 'graphql-tag';
import { prepareTestDb } from '../prisma/functions';

beforeAll(async () => {
	await prepareTestDb();
});

describe('MessageController (e2e)', () => {
	let app: INestApplication;
	let apolloServer: ApolloServerBase;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const module = moduleFixture.get(GraphQLModule);

		apolloServer = module.apolloServer;
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', async () => {
		const result = await apolloServer.executeOperation({
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

		expect(result.data).toBeDefined();

		expect(Array.isArray(result.data!.messages)).toBe(true);
		expect(result.data!.messages.length).toBe(3);

		result.data!.messages.forEach((message: any) => {
			expect(message).toEqual({
				text: expect.any(String),
				time: expect.any(String),
			});
		});
	});
});
