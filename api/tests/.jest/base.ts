import type { Config } from '@jest/types';
import deepmerge from 'deepmerge';
import fs from 'fs';
import JSON5 from 'json5';
import { pathsToModuleNameMapper } from 'ts-jest';

const tsConfig = JSON5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

function defineBaseJestConfig<T extends Config.InitialOptions>(config: T) {
	return config;
}

const baseConfig = defineBaseJestConfig({
	rootDir: '../../',
	testEnvironment: '<rootDir>/prisma/prisma.test-environment.ts',
	moduleFileExtensions: ['js', 'json', 'ts'],
	moduleDirectories: ['../../node_modules', '<rootDir>'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testPathIgnorePatterns: ['<rootDir>/dist/'],
	collectCoverageFrom: ['**/*.ts', '!**/*.d.ts', '!.graphqlrc.ts', '!gulpfile.ts', '!<rootDir>/src/_generated/**/*'],
	coverageDirectory: '<rootDir>/coverage',
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/prisma/', '<rootDir>/dist/'],
	moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
	testTimeout: 30000,
	passWithNoTests: true,
});

export function defineJestConfig<T extends Config.InitialOptions>(config: T): T & typeof baseConfig {
	return deepmerge(config, baseConfig) as T & typeof baseConfig;
}

export default baseConfig;
