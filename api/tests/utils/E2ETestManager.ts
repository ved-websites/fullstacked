import 'lucia/polyfill/node';

import { setupApp } from '$app/setupApp';
import { GraphQLModule } from '$graphql/graphql.module';
import { ensureGraphQLSchema } from '$graphql/schema/schema.manager';
import { PrismaService } from '$prisma/prisma.service';
import { AuthModule } from '$users/auth/auth.module';
import { AuthService } from '$users/auth/auth.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TestingModuleBuilder } from '@nestjs/testing';
import { User } from 'lucia';
import supertest from 'supertest';
import supertestGQL, { Variables } from 'supertest-graphql';
import { AppModule } from '~app-module';
import { ADMIN } from '~utils/roles';
import { TestManager, type TestOptions } from '~utils/tests/TestManager';
import { prepareTestDb } from '../../prisma/utils/functions';
import { TestGraphqlModule } from '../mocks/graphql.module';

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

export interface E2ETestOptions extends TestOptions {
	defaultUser?: keyof typeof users | null;
	createUser?: Partial<Record<keyof typeof users, boolean>>;
}

export class E2ETestManager extends TestManager<E2ETestOptions> {
	#authToken?: string;
	get authToken(): string | undefined {
		return this.#authToken;
	}
	protected set authToken(authToken: string) {
		this.#authToken = authToken;
	}

	public httpServer: any;
	public readonly prisma!: PrismaService;

	private app!: NestExpressApplication;
	private authService!: AuthService;

	constructor(options?: E2ETestOptions) {
		const metadata = options?.metadata;

		const importsOnDefined = [GraphQLModule, AuthModule];

		super({
			...options,
			metadata: {
				...metadata,
				imports: metadata?.imports ? [...importsOnDefined, ...metadata.imports] : [AppModule],
			},
		});
	}

	protected override testingModuleSetup(moduleBuilder: TestingModuleBuilder): TestingModuleBuilder {
		return super.testingModuleSetup(moduleBuilder).overrideModule(GraphQLModule).useModule(TestGraphqlModule);
	}

	async beforeAll(): Promise<void> {
		super.setupTestModule();

		await prepareTestDb();

		await ensureGraphQLSchema();

		this.app = this.module.createNestApplication();

		setupApp(this.app);

		await this.app.init();

		this.httpServer = this.app.getHttpServer();
		(this.prisma as PrismaService) = this.app.get<PrismaService>(PrismaService);

		await this.prisma.role.create({
			data: {
				text: ADMIN,
			},
		});

		this.authService = this.app.get<AuthService>(AuthService);

		const creationSteps = Object.entries({
			admin: true,
			...this.options?.createUser,
		} satisfies E2ETestOptions['createUser']) as [keyof typeof userDefinitions, boolean][];

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
