import { Module } from '@nestjs/common';
import { SettingsModule } from './settings/settings.module';

@Module({
	imports: [SettingsModule],
})
export class UserModule {}
