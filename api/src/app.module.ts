import { OnboardingController } from '$onboarding/onboarding.controller';
import { OnboardingModule } from '$onboarding/onboarding.module';
import { Module, type ModuleMetadata } from '@nestjs/common';
import { AppController } from './@common/app/app.controller';
import { BaseModules } from './@common/app/app.helpers';
import { MessageModule } from './message/message.module';
import { UsersModule } from './users/users.module';

const AppImports = [MessageModule, UsersModule] satisfies ModuleMetadata['imports'];

@Module({
	imports: [...BaseModules, OnboardingModule, ...AppImports],
	providers: [],
	controllers: [OnboardingController, AppController],
})
export class AppModule {}
