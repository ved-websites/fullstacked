import { Module } from '@nestjs/common';
import { UserSecurityModule } from './security/security.module';
import { UserSettingsModule } from './settings/settings.module';

@Module({
	imports: [UserSettingsModule, UserSecurityModule],
})
export class UserModule {}
