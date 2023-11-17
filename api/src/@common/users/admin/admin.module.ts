import { EmailModule } from '$email/email.module';
import { TypedI18nModule } from '$i18n/i18n.module';
import { PrismaModule } from '$prisma/prisma.module';
import { AuthModule } from '$users/auth/auth.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { UsersService } from '$users/users.service';
import { Module } from '@nestjs/common';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { AdminListener } from './listeners/admin.listener';

@Module({
	imports: [TypedI18nModule, PrismaModule, AuthModule, RolesModule, EmailModule],
	providers: [AdminResolver, AdminService, AdminListener, UsersService],
})
export class AdminModule {}
