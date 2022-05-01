import { env } from '$common/configs';
import { Environment } from '$common/configs/env.validation';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';

const isProd = env.NODE_ENV == Environment.Production;

export const GraphQLModule = NestGraphQLModule.forRoot<ApolloDriverConfig>({
	driver: ApolloDriver,
	autoSchemaFile: true,
	installSubscriptionHandlers: true,
	subscriptions: {
		'graphql-ws': true,
	},
	debug: !isProd,
	playground: !isProd,
	validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
});
