import { LuciaFactory } from '$auth/lucia/lucia.factory';
import { LuciaModule } from '$auth/lucia/lucia.module';
import { ConfigModule } from '$configs/config.module';
import { setupContext } from '$graphql/graphql.helper';
import { schemaPath } from '$graphql/graphql.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { Auth } from 'lucia';
import { EnvironmentConfig } from '~/env.validation';

export const TestGraphqlModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	imports: [ConfigModule, LuciaModule],
	useFactory: async (env: EnvironmentConfig, auth: Auth) => {
		return {
			typePaths: [schemaPath],
			installSubscriptionHandlers: true,
			subscriptions: {
				'graphql-ws': true,
			},
			playground: false,
			validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
			context: setupContext(auth),
		};
	},
	inject: [EnvironmentConfig, LuciaFactory],
});
