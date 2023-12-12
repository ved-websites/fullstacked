import { AuthModule } from '$users/auth/auth.module';
import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';

@Module({
	imports: [AuthModule],
	controllers: [OnboardingController],
})
export class OnboardingModule {}
