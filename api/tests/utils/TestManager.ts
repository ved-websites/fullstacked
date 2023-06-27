import 'lucia/polyfill/node';

import { AppModule } from '$/app.module';
import { AuthModule } from '$auth/auth.module';
import { AuthService } from '$auth/auth.service';
import { ConfigModule } from '$configs/config.module';
import { GraphQLModule, schemaPath } from '$graphql.module';
import { PrismaModule } from '$prisma/prisma.module';
import { PrismaService } from '$prisma/prisma.service';
import { INestApplication, ValidationPipe, type ModuleMetadata } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { existsSync } from 'fs';
import { User } from 'lucia';
import supertest from 'supertest';
import supertestGQL, { Variables } from 'supertest-graphql';
import { prepareTestDb } from '../../prisma/utils/functions';
import { TestGraphqlModule } from '../mocks/graphql/graphql.module';

type TestUser = {
	email: string;
	password?: string;
	instance?: User;
	roles?: string[];
};
const userDefinitions = {
	admin: {
		email: 'admin@test.com',
		password: '12345',
		roles: ['admin'],
	},
	testing: {
		email: 'testing@test.com',
		password: '09876',
	},
} satisfies Record<string, TestUser>;

export const users: Record<keyof typeof userDefinitions, TestUser> = userDefinitions;

type TestOptions = {
	metadata?: ModuleMetadata;
	defaultUser?: keyof typeof users | null;
	createUser?: Partial<Record<keyof typeof users, boolean>>;
};

export class TestManager {
	#authToken?: string;
	get authToken(): string | undefined {
		return this.#authToken;
	}
	protected set authToken(authToken: string) {
		this.#authToken = authToken;
	}

	public httpServer: any;
	public readonly prisma!: PrismaService;

	private app!: INestApplication;
	private authService!: AuthService;

	constructor(private options?: TestOptions) {}

	async beforeAll(): Promise<void> {
		await prepareTestDb();

		await ensureGraphQLSchema();

		const moduleRef = await Test.createTestingModule({
			...this.options?.metadata,
			imports: this.options?.metadata?.imports
				? [ConfigModule, GraphQLModule, AuthModule, PrismaModule, ...this.options.metadata.imports]
				: [AppModule],
		})
			.overrideModule(GraphQLModule)
			.useModule(TestGraphqlModule)
			.compile();

		this.app = moduleRef.createNestApplication();
		this.app.useGlobalPipes(new ValidationPipe({ transform: true }));

		await this.app.init();

		this.httpServer = this.app.getHttpServer();
		(this.prisma as PrismaService) = this.app.get<PrismaService>(PrismaService);

		await this.prisma.role.create({
			data: {
				text: 'admin',
			},
		});

		this.authService = this.app.get<AuthService>(AuthService);

		const creationSteps = Object.entries({
			admin: true,
			...this.options?.createUser,
		} satisfies TestOptions['createUser']) as [keyof typeof userDefinitions, boolean][];

		const userCreationPromises = creationSteps.map(async ([user, doCreate]) => {
			if (!doCreate) {
				return;
			}

			const userDef = users[user];

			const newUser = await this.createUser(userDef.email, userDef.password ?? null);

			if (userDef.roles) {
				await Promise.all(
					userDef.roles.map(async (role) => {
						await this.prisma.role.update({
							data: {
								users: {
									connect: {
										email: userDef.email,
									},
								},
							},
							where: {
								text: role,
							},
						});
					}),
				);
			}

			users[user].instance = newUser;
		});

		await Promise.all(userCreationPromises);
	}

	async afterAll() {
		await this.app.close();
	}

	async beforeEach() {
		const defaultUser = this.options?.defaultUser === undefined ? ('admin' satisfies keyof typeof users) : this.options?.defaultUser;

		if (defaultUser && users[defaultUser].instance) {
			await this.login(defaultUser);
		}
	}

	rest(method: 'get' | 'post' | 'delete' | 'put' | 'patch' | 'options', route: `/${string}`) {
		const test = supertest(this.httpServer)[method](route);

		return test.set('authorization', `Bearer ${this.authToken}`);
	}
	gql<TData, TVariables extends Variables = Variables>() {
		const test = supertestGQL<TData, TVariables>(this.httpServer);

		return test.set('authorization', `Bearer ${this.authToken}`);
	}

	async createUser(...args: Parameters<AuthService['createUser']>) {
		const user = await this.authService.createUser(...args);

		return user as User;
	}

	async login(user: keyof typeof users) {
		const session = await this.authService.loginUser(users[user].instance!.id);

		this.authToken = session.sessionId;
	}
}

export async function ensureGraphQLSchema() {
	if (!existsSync(schemaPath)) {
		// If schema file doesn't exist, run app once to generate schema
		const tempGqlApp = await NestFactory.create(AppModule);

		await tempGqlApp.init();
		await tempGqlApp.close();
	}
}
