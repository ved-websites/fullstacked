import { mergeConfig } from 'vitest/config';
import vitestBaseConfig from './base';
import e2eConfigs from './vitest.config.e2e';
import specsConfigs from './vitest.config.specs';

const allConfigs = mergeConfig(vitestBaseConfig, mergeConfig(specsConfigs, e2eConfigs));

export default allConfigs;
