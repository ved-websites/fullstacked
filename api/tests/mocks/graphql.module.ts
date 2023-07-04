import { schemaPath } from '$graphql/graphql.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';

export const TestGraphqlModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
	driver: ApolloDriver,
	useFactory: async () => {
		return {
			typePaths: [schemaPath],
			installSubscriptionHandlers: true,
			subscriptions: {
				'graphql-ws': true,
			},
			playground: false,
			validationRules: [depthLimit(10)],
		};
	},
});
