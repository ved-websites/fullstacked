import { AuthModule } from '$auth/auth.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [OnboardingController],
})
export class OnboardingModule {}
