import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsResolver } from './settings.resolver';

describe('SettingsResolver', () => {
	let resolver: SettingsResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SettingsResolver],
		}).compile();

		resolver = module.get<SettingsResolver>(SettingsResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
