import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { UserModule } from './user/user.module';

/**
 * The module responsible to handle all common users handling.
 */
@Module({
	imports: [OnboardingModule, EmailModule, AuthModule, AdminModule, UserModule],
	exports: [AuthModule],
})
export class UsersModule {}
