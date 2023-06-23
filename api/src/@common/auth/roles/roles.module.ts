import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
	imports: [PrismaModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
	exports: [],
})
export class RolesModule {}
