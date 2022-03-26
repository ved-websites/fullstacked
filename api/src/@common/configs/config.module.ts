import { createConfigModule, selectEnvConfig } from './helpers';

export const ConfigModule = createConfigModule();

export const env = selectEnvConfig(ConfigModule);
