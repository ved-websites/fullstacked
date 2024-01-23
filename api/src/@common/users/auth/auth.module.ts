import { EmailModule } from '$email/email.module';
import { TypedI18nModule } from '$i18n/i18n.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LuciaModule } from './lucia/lucia.module';
import { RolesModule } from './roles/roles.module';

@Module({
	imports: [LuciaModule, RolesModule, EmailModule, PresenceModule, TypedI18nModule],
	providers: [
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
