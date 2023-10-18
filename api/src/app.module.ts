import { ThrottlerGuard } from '$app/throttler.guard';
import { Module, type ModuleMetadata } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { BaseModules } from './@common/app/app.helpers';
import { MessageModule } from './message/message.module';

const AppImports = [MessageModule] satisfies ModuleMetadata['imports'];

@Module({
	imports: [...BaseModules, ...AppImports],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
