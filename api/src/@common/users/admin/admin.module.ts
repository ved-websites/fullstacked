import { EmailModule } from '$email/email.module';
import { TypedI18nModule } from '$i18n/i18n.module';
import { AuthModule } from '$users/auth/auth.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { AdminListener } from './listeners/admin.listener';

@Module({
	imports: [AuthModule, RolesModule, EmailModule, PresenceModule, TypedI18nModule],
	providers: [AdminResolver, AdminService, AdminListener],
})
export class AdminModule {}
