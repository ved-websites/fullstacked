import { EmailModule } from '$email/email.module';
import { PrismaModule } from '$prisma/prisma.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LuciaModule } from './lucia/lucia.module';
import { RolesModule } from './roles/roles.module';

@Module({
	imports: [PrismaModule, LuciaModule, RolesModule, EmailModule, PresenceModule],
	providers: [
		AuthResolver,
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	exports: [AuthService],
})
export class AuthModule {}
