import { CryptoModule } from '$crypto/crypto.module';
import { EmailModule } from '$email/email.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RolesModule } from './roles/roles.module';
import { SessionModule } from './session/session.module';

@Module({
	imports: [SessionModule, CryptoModule, RolesModule, EmailModule, PresenceModule],
	providers: [
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
