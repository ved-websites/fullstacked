import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LangInterceptor } from './lang.interceptor';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PresenceModule } from './presence/presence.module';
import { UserModule } from './user/user.module';

/**
 * The module responsible to handle all common users handling.
 */
@Module({
	imports: [PrismaModule, OnboardingModule, AuthModule, AdminModule, UserModule, PresenceModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: LangInterceptor,
		},
	],
	exports: [AuthModule],
})
export class UsersModule {}
