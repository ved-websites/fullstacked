import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesController } from './roles.controller';
import { RolesGuard } from './roles.guard';
import { RolesService } from './roles.service';

@Module({
	providers: [
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		RolesService,
	],
	exports: [RolesService],
	controllers: [RolesController],
})
export class RolesModule {}
