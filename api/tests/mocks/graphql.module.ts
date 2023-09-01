import { ConfigModule } from '$configs/config.module';
import { ContextModule } from '$graphql/context/context.module';
import { CommonContext, ContextService, TypedSubscriptionContext } from '$graphql/context/context.service';
import { schemaPath } from '$graphql/graphql.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { EnvironmentConfig } from '~/env.validation';

export const TestGraphqlModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	imports: [ConfigModule, ContextModule],
	useFactory: async (env: EnvironmentConfig, contextService: ContextService) => {
		return {
			typePaths: [schemaPath],
			installSubscriptionHandlers: true,
			subscriptions: {
				'graphql-ws': true,
			},
			playground: false,
			validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
			context: (context: TypedSubscriptionContext | CommonContext) => contextService.setupGqlContext(context),
		};
	},
	inject: [EnvironmentConfig, ContextService],
});
