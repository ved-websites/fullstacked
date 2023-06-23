import { ConfigModule } from '$common/configs/config.module';
import { GraphQLModule } from '$common/graphql.module';
import { OnboardingController } from '$common/onboarding/onboarding.controller';
import { OnboardingModule } from '$common/onboarding/onboarding.module';
import { PrismaModule } from '$common/prisma/prisma.module';
import { Module, type ModuleMetadata } from '@nestjs/common';
import { AuthModule } from './@common/auth/auth.module';
import { AppController } from './app.controller';
import { MessageModule } from './message/message.module';

const AppImports: ModuleMetadata['imports'] = [MessageModule];

@Module({
	imports: [ConfigModule, PrismaModule, OnboardingModule, GraphQLModule, AuthModule, ...AppImports],
	providers: [],
	controllers: [OnboardingController, AppController],
})
export class AppModule {}
