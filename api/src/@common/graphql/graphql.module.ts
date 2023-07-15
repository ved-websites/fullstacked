import { Auth, LuciaFactory } from '$auth/lucia/lucia.factory';
import { LuciaModule } from '$auth/lucia/lucia.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { join } from 'path';
import { Environment, EnvironmentConfig } from '~/env.validation';
import { ConfigModule } from '../configs/config.module';
import { setupContext } from './graphql.helper';

export const schemaPath = join(process.cwd(), 'src/_generated/nestjs-graphql/schema.gql');

export const GraphQLModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	imports: [ConfigModule, LuciaModule],
	useFactory: (env: EnvironmentConfig, auth: Auth) => {
		const isDev = env.NODE_ENV == Environment.Development;

		return {
			autoSchemaFile: schemaPath,
			installSubscriptionHandlers: true,
			subscriptions: {
				'graphql-ws': true,
			},
			debug: isDev,
			playground: false,
			plugins: isDev ? [ApolloServerPluginLandingPageLocalDefault()] : undefined,
			validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
			context: setupContext(auth),
		};
	},
	inject: [EnvironmentConfig, LuciaFactory],
});
