import { ConfigModule } from '$configs/config.module';
import { isLocal } from '$configs/helpers';
import { LocalEnvironmentConfig } from '$configs/local-env.validation';
import { TypedI18nModule } from '$i18n/i18n.module';
import { PrismaModule } from '$prisma/prisma.module';
import { SocketModule } from '$socket/socket.module';
import { type ModuleMetadata } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { EnvironmentConfig } from '~env';

export interface TestOptions {
	metadata?: ModuleMetadata;
}

export class TestManager<Options extends TestOptions = TestOptions> {
	public readonly module!: TestingModule;

	protected options?: Options;

	constructor(options?: Options) {
		this.options = options;
	}

	async setupTestModule(): Promise<void> {
		const metadata = this.options?.metadata;

		const sharedImports: NonNullable<typeof metadata>['imports'] = [
			ConfigModule,
			PrismaModule,
			TypedI18nModule,
			EventEmitterModule.forRoot({
				global: true,
				verboseMemoryLeak: true,
			}),
			SocketModule,
		];

		const sharedProviders: NonNullable<typeof metadata>['providers'] = [
			{
				provide: EnvironmentConfig,
				useClass: isLocal ? LocalEnvironmentConfig : EnvironmentConfig,
			},
		];

		const moduleBuilder = Test.createTestingModule({
			...metadata,
			imports: metadata?.imports ? [...sharedImports, ...metadata.imports] : sharedImports,
			providers: metadata?.providers ? [...sharedProviders, ...metadata.providers] : sharedProviders,
		});

		const moduleRef = await this.testingModuleSetup(moduleBuilder).compile();

		(this.module as TestingModule) = moduleRef;
	}

	protected testingModuleSetup(moduleBuilder: TestingModuleBuilder): TestingModuleBuilder {
		return moduleBuilder;
	}
}
