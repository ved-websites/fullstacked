import { Environment, EnvironmentConfig } from '$configs/env.validation';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { ConfigModule } from './configs/config.module';

export const GraphQLModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	imports: [ConfigModule],
	useFactory: (env: EnvironmentConfig) => {
		const isProd = env.NODE_ENV == Environment.Production;

		return {
			autoSchemaFile: true,
			installSubscriptionHandlers: true,
			subscriptions: {
				'graphql-ws': true,
			},
			debug: !isProd,
			playground: false,
			plugins: [ApolloServerPluginLandingPageLocalDefault()],
			validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
		};
	},
	inject: [EnvironmentConfig],
});
