import { TypedI18nModule } from '$i18n/i18n.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LangInterceptor } from './lang.interceptor';
import { UsersListener } from './listeners/users.listener';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PresenceModule } from './presence/presence.module';
import { UserModule } from './user/user.module';
import { UsersGateway } from './users.gateway';

/**
 * The module responsible to handle all common users handling.
 */
@Module({
	imports: [OnboardingModule, AuthModule, AdminModule, UserModule, PresenceModule, TypedI18nModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: LangInterceptor,
		},
		UsersListener,
		UsersGateway,
	],
	exports: [AuthModule],
})
export class UsersModule {}
