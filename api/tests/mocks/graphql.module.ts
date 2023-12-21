import { ConfigModule } from '$configs/config.module';
import { ContextModule } from '$graphql/context/context.module';
import { CommonGQLContext, ContextService, TypedSubscriptionContext } from '$graphql/context/context.service';
import { schemaPath } from '$graphql/graphql.module';
import { PresenceModule } from '$users/presence/presence.module';
import { PresenceService } from '$users/presence/presence.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { EnvironmentConfig } from '~env';

export const TestGraphqlModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	imports: [ConfigModule, ContextModule, PresenceModule],
	useFactory: async (env: EnvironmentConfig, contextService: ContextService, presenceService: PresenceService) => {
		return {
			typePaths: [schemaPath],
			installSubscriptionHandlers: true,
			subscriptions: {
				'graphql-ws': {
					onConnect: async (context) => {
						const {
							req: { session },
						} = await contextService.setupGqlContext(context as TypedSubscriptionContext | CommonGQLContext);

						if (session) {
							presenceService.onConnect(session);
						}
					},
					onDisconnect: async (context) => {
						const {
							req: { session },
						} = contextService.extractRawGqlContext(context as TypedSubscriptionContext | CommonGQLContext);

						if (session) {
							presenceService.onDisconnect(session);
						}
					},
				},
			},
			playground: false,
			validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
			context: (context: TypedSubscriptionContext | CommonGQLContext) => contextService.setupGqlContext(context),
		};
	},
	inject: [EnvironmentConfig, ContextService, PresenceService],
});
