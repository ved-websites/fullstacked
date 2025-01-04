import { mergeConfig } from 'vitest/config';
import vitestBaseConfig from './base.mjs';
import e2eConfigs from './vitest.config.e2e.mjs';
import specsConfigs from './vitest.config.specs.mjs';

const allConfigs = mergeConfig(vitestBaseConfig, mergeConfig(specsConfigs, e2eConfigs));

export default allConfigs;
