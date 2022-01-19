import type { IGraphQLConfig } from 'graphql-config';
import { env } from './src/@common/configs/config.module';

const config: IGraphQLConfig = {
	schema: `http://localhost:${env.PORT}/graphql`,
};

export default config;
