import { CryptoModule } from '$crypto/crypto.module';
import { EmailModule } from '$email/email.module';
import { AuthModule } from '$users/auth/auth.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { UserSecurityService } from './security.service';

@Module({
	imports: [CryptoModule, AuthModule, PresenceModule, EmailModule],
	providers: [UserSecurityService],
	controllers: [SecurityController],
	exports: [UserSecurityService],
})
export class UserSecurityModule {}
