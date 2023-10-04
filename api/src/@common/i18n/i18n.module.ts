import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import {
	AcceptLanguageResolver,
	GraphQLWebsocketResolver,
	HeaderResolver,
	I18nModule as NestI18nModule,
	I18nService as NestI18nService,
	QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { I18nService, I18nServiceFactory } from './i18n.service';
import { SessionI18nResolver } from './session.i18n-resolver';

export const fallbackLanguage = 'en';

@Module({
	imports: [
		PrismaModule,
		NestI18nModule.forRootAsync({
			useFactory: () => ({
				fallbackLanguage,
				loaderOptions: {
					path: path.resolve('.', 'src/i18n'),
					watch: true,
					includeSubfolders: true,
				},
				throwOnMissingKey: false,
				typesOutputPath: path.resolve('.', 'src/@common/i18n/@generated/i18n.generated.ts'),
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
			provide: I18nService,
			useFactory: I18nServiceFactory,
			inject: [NestI18nService],
		},
	],
	exports: [I18nService],
})
export class I18nModule {}
