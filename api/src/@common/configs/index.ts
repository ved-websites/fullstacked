import { ConfigModule } from './config.module';
import { selectEnvConfig } from './helpers';

export const env = selectEnvConfig(ConfigModule);
