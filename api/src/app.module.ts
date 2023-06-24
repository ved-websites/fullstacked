import { AuthModule } from '$auth/auth.module';
import { ConfigModule } from '$configs/config.module';
import { GraphQLModule } from '$graphql.module';
import { OnboardingController } from '$onboarding/onboarding.controller';
import { OnboardingModule } from '$onboarding/onboarding.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module, type ModuleMetadata } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessageModule } from './message/message.module';

const AppImports: ModuleMetadata['imports'] = [MessageModule];

@Module({
	imports: [ConfigModule, PrismaModule, OnboardingModule, GraphQLModule, AuthModule, ...AppImports],
	providers: [],
	controllers: [OnboardingController, AppController],
})
export class AppModule {}
