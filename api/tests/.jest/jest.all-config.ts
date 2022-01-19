import { defineJestConfig } from './base';
import e2eConfigs from './jest.e2e-config';
import specsConfigs from './jest.specs-config';

const allConfigs = defineJestConfig({
	testRegex: [e2eConfigs.testRegex, specsConfigs.testRegex],
});

allConfigs.coveragePathIgnorePatterns = [
	...new Set([...specsConfigs.coveragePathIgnorePatterns, ...e2eConfigs.coveragePathIgnorePatterns]),
];

export default allConfigs;
