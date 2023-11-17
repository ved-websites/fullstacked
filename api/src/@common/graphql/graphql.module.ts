import { UsersModule } from '$users/users.module';
import { UsersService } from '$users/users.service';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { join } from 'path';
import { Environment, EnvironmentConfig } from '~/env.validation';
import { ConfigModule } from '../configs/config.module';
import { ContextModule } from './context/context.module';
import { ContextService, type CommonContext, type TypedSubscriptionContext } from './context/context.service';

export const schemaPath = join(process.cwd(), 'src/_generated/nestjs-graphql/schema.gql');

export const GraphQLModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	imports: [ConfigModule, ContextModule, UsersModule],
	useFactory: (env: EnvironmentConfig, contextService: ContextService, usersService: UsersService) => {
		const isDev = env.NODE_ENV == Environment.Development;

		return {
			autoSchemaFile: schemaPath,
			installSubscriptionHandlers: true,
			subscriptions: {
				'graphql-ws': {
					onConnect: async (context) => {
						const {
							req: { session },
						} = await contextService.setupGqlContext(context as TypedSubscriptionContext | CommonContext);

						if (session) {
							usersService.onConnect(session);
						}
					},
					onDisconnect: async (context) => {
						const {
							req: { session },
						} = contextService.extractRawGqlContext(context as TypedSubscriptionContext | CommonContext);

						if (session) {
							usersService.onDisconnect(session);
						}
					},
				},
			},
			debug: isDev,
			playground: false,
			plugins: isDev ? [ApolloServerPluginLandingPageLocalDefault()] : undefined,
			validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
			context: (context: TypedSubscriptionContext | CommonContext) => contextService.setupGqlContext(context),
		};
	},
	inject: [EnvironmentConfig, ContextService, UsersService],
});
