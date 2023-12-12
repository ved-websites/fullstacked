import { TypedI18nModule } from '$i18n/i18n.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

@Module({
	imports: [PrismaModule, TypedI18nModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		RolesResolver,
		RolesService,
	],
	exports: [RolesService],
})
export class RolesModule {}
