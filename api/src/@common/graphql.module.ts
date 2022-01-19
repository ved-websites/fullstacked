import { env } from '$common/configs/config.module';
import { Environment } from '$common/configs/env.validation';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';

const isProd = env.NODE_ENV == Environment.Production;

export const GraphQLModule = NestGraphQLModule.forRoot({
	autoSchemaFile: true,
	installSubscriptionHandlers: true,
	subscriptions: {
		'graphql-ws': true,
	},
	debug: !isProd,
	playground: !isProd,
	validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
});
