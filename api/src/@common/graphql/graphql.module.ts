import { PresenceModule } from '$users/presence/presence.module';
import { PresenceService } from '$users/presence/presence.service';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { join } from 'path';
import { Environment, EnvironmentConfig } from '~env';
import { ConfigModule } from '../configs/config.module';
import { ContextModule } from './context/context.module';
import { ContextService, type CommonGQLContext, type TypedSubscriptionContext } from './context/context.service';

export const schemaPath = join(process.cwd(), 'src/_generated/nestjs-graphql/schema.gql');

export const GraphQLModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	imports: [ConfigModule, ContextModule, PresenceModule],
	useFactory: (env: EnvironmentConfig, contextService: ContextService, presenceService: PresenceService) => {
		const isDev = env.NODE_ENV == Environment.Development;

		return {
			autoSchemaFile: schemaPath,
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
			debug: isDev,
			playground: false,
			plugins: isDev ? [ApolloServerPluginLandingPageLocalDefault()] : undefined,
			validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
			context: (context: TypedSubscriptionContext | CommonGQLContext) => contextService.setupGqlContext(context),
		};
	},
	inject: [EnvironmentConfig, ContextService, PresenceService],
});
