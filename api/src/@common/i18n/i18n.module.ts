import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
	AcceptLanguageResolver,
	GraphQLWebsocketResolver,
	HeaderResolver,
	I18nMiddleware,
	I18nModule as NestI18nModule,
	QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { SessionI18nResolver } from './session.i18n-resolver';

@Module({
	imports: [
		NestI18nModule.forRootAsync({
			useFactory: () => ({
				fallbackLanguage: 'en',
				loaderOptions: {
					path: path.resolve('.', 'src/i18n'),
					watch: true,
					includeSubfolders: true,
				},
				throwOnMissingKey: false,
				disableMiddleware: true,
				typesOutputPath: path.resolve('.', 'src/_generated/nestjs-i18n/i18n.generated.ts'),
			}),
			resolvers: [SessionI18nResolver, GraphQLWebsocketResolver, QueryResolver, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
			inject: [],
		}),
	],
})
export class I18nModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(I18nMiddleware).forRoutes('(.*)');
	}
}
