import { Global, Module } from '@nestjs/common';
import parserFactory from '@sveltekit-i18n/parser-default';
import {
	AcceptLanguageResolver,
	GraphQLWebsocketResolver,
	HeaderResolver,
	I18nModule as NestI18nModule,
	I18nService as NestI18nService,
	QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { TypedI18nService, TypedI18nServiceFactory } from './i18n.service';
import { SessionI18nResolver } from './session.i18n-resolver';

export const fallbackLanguage = 'en';

const templateParser = parserFactory();

@Global()
@Module({
	imports: [
		NestI18nModule.forRootAsync({
			useFactory: () => ({
				fallbackLanguage,
				loaderOptions: {
					path: path.resolve('.', 'src/i18n'),
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
				// typesOutputPath: path.resolve('.', 'src/@common/i18n/@generated/i18n.generated.ts'),
			}),
			resolvers: [
				SessionI18nResolver,
				GraphQLWebsocketResolver,
				QueryResolver,
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
export class TypedI18nModule {}
