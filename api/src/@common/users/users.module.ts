import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LangInterceptor } from './lang.interceptor';
import { OnboardingModule } from './onboarding/onboarding.module';
import { UserModule } from './user/user.module';
import { UsersService } from './users.service';

/**
 * The module responsible to handle all common users handling.
 */
@Module({
	imports: [PrismaModule, OnboardingModule, AuthModule, AdminModule, UserModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: LangInterceptor,
		},
		UsersService,
	],
	exports: [AuthModule, UsersService],
})
export class UsersModule {}
