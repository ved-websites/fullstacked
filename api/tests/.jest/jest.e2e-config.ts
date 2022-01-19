import { defineJestConfig } from './base';

const e2eConfigs = defineJestConfig({
	testRegex: '\\.e2e-spec\\.ts$',
	coveragePathIgnorePatterns: ['<rootDir>/tests/fixtures/'],
});

export default e2eConfigs;
