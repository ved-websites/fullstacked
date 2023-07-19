import { CIEnvironmentConfig } from '$configs/ci-env.validation';
import { Provider, type ModuleMetadata } from '@nestjs/common';
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

		const ciEnv: Provider = {
			provide: EnvironmentConfig,
			useClass: process.env.CI == 'true' ? CIEnvironmentConfig : EnvironmentConfig,
		};

		const moduleBuilder = Test.createTestingModule({
			...metadata,
			providers: metadata?.providers ? [ciEnv, ...metadata.providers] : [ciEnv],
		});

		const moduleRef = await this.testingModuleSetup(moduleBuilder).compile();

		(this.module as TestingModule) = moduleRef;
	}

	protected testingModuleSetup(moduleBuilder: TestingModuleBuilder): TestingModuleBuilder {
		return moduleBuilder;
	}
}
