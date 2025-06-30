import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import parserFactory from '@sveltekit-i18n/parser-default';
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nMiddleware,
	I18nModule as NestI18nModule,
	I18nService as NestI18nService,
	QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { Environment, EnvironmentConfig } from '~env';
import { TypedI18nService, TypedI18nServiceFactory } from './i18n.service';
import { SessionI18nResolver } from './session.i18n-resolver';

export const fallbackLanguage = 'en';

const templateParser = parserFactory();

@Global()
@Module({
	imports: [
		NestI18nModule.forRootAsync({
			useFactory: (env: EnvironmentConfig) => ({
				disableMiddleware: true,
				fallbackLanguage,
				loaderOptions: {
					path: path.resolve('.', env.NODE_ENV === Environment.Production ? 'dist' : 'src', 'i18n'),
					watch: true,
					includeSubfolders: true,
				},
				formatter: (template: string, ...args: unknown[]) => {
					const { __lang: lang, ...payload } = args[0] as {
						__lang: string;
						[x: string]: unknown;
					};

					return templateParser.parse(template, [payload], lang, '');
				},
				throwOnMissingKey: false,
				// typesOutputPath: path.resolve('.', env.NODE_ENV === Environment.Production ? 'dist' : 'src', '@common/i18n/@generated/i18n.generated.ts'),
			}),
			inject: [EnvironmentConfig],
			resolvers: [
				new SessionI18nResolver(),
				new QueryResolver(),
				new AcceptLanguageResolver({ matchType: 'loose' }),
				new HeaderResolver(['x-lang']),
			],
		}),
	],
	providers: [
		{
			provide: TypedI18nService,
			useFactory: TypedI18nServiceFactory,
			inject: [NestI18nService],
		},
	],
	exports: [TypedI18nService],
})
export class TypedI18nModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(I18nMiddleware).forRoutes('{*slug}');
	}
}
