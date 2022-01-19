import { defineJestConfig } from './base';

const specsConfigs = defineJestConfig({
	testRegex: '.*\\.spec\\.ts$',
	coveragePathIgnorePatterns: ['<rootDir>/tests/'],
});

export default specsConfigs;
