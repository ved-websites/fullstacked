import { setupApp } from '$app/setupApp';
import { User } from '$prisma-client';
import { PrismaService } from '$prisma/prisma.service';
import { TestManager, TestOptions } from '$tests/TestManager';
import { AuthModule } from '$users/auth/auth.module';
import { AuthService } from '$users/auth/auth.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TestingModuleBuilder } from '@nestjs/testing';
import { AppRoute } from '@ts-rest/core';
import supertest from 'supertest';
import { AppModule } from '~app-module';
import { RoleSpec, Roles } from '~shared';
import { prepareTestDb } from '../../prisma/utils/functions';

type TestUser = {
	email: string;
	password?: string;
	instance?: User;
	roles?: RoleSpec[];
};
const userDefinitions = {
	admin: {
		email: 'admin@test.com',
		password: '12345',
		roles: [Roles.ADMIN],
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

		const importsOnDefined = [AuthModule];

		super({
			...options,
			metadata: {
				...metadata,
				imports: metadata?.imports ? [...importsOnDefined, ...metadata.imports] : [AppModule],
			},
		});
	}

	protected override testingModuleSetup(moduleBuilder: TestingModuleBuilder): TestingModuleBuilder {
		return super.testingModuleSetup(moduleBuilder);
	}

	async beforeAll(): Promise<void> {
		super.setupTestModule();

		await prepareTestDb();

		this.app = this.module.createNestApplication();

		setupApp(this.app);

		await this.app.init();

		this.httpServer = this.app.getHttpServer();
		(this.prisma as PrismaService) = this.app.get<PrismaService>(PrismaService);

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
						await this.prisma.user.update({
							data: {
								roles: {
									connect: {
										text: role.name,
									},
								},
							},
							where: {
								email: userDef.email,
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
	tsrest(route: AppRoute) {
		const method = route.method.toLowerCase() as Lowercase<AppRoute['method']>;

		return this.rest(method, route.path as `/${string}`);
	}

	async createUser(...args: Parameters<AuthService['createUser']>) {
		const user = await this.authService.createUser(...args);

		return user;
	}

	async login(user: keyof typeof users) {
		const { session } = await this.authService.loginUser(users[user].instance!.id);

		this.authToken = session.token;
	}
}
