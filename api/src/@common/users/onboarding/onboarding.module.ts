import { PrismaModule } from '$prisma/prisma.module';
import { AuthModule } from '$users/auth/auth.module';
import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [OnboardingController],
})
export class OnboardingModule {}
