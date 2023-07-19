import { CIEnvironmentConfig } from '$configs/ci-env.validation';
import { ConfigModule } from '$configs/config.module';
import { type ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { EnvironmentConfig } from '~/env.validation';

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

		const sharedImports: NonNullable<typeof metadata>['imports'] = [ConfigModule];

		const sharedProviders: NonNullable<typeof metadata>['providers'] = [
			{
				provide: EnvironmentConfig,
				useClass: process.env.CI == 'true' ? CIEnvironmentConfig : EnvironmentConfig,
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