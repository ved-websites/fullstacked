import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule as SentryModuleNestJS } from '@sentry/nestjs/setup';

@Module({
	imports: [SentryModuleNestJS.forRoot()],
	providers: [
		{
			provide: APP_FILTER,
			useClass: SentryGlobalFilter,
		},
	],
})
export class SentryModule {}
