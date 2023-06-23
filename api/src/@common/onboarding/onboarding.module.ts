import { AuthModule } from '$common/auth/auth.module';
import { PrismaModule } from '$common/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [OnboardingController],
})
export class OnboardingModule {}
