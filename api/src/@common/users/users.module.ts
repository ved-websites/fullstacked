import { AuthModule } from '$auth/auth.module';
import { RolesModule } from '$auth/roles/roles.module';
import { EmailModule } from '$email/email.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { SettingsModule } from './settings/settings.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
	imports: [PrismaModule, AuthModule, RolesModule, EmailModule, SettingsModule],
	providers: [UsersResolver, UsersService],
})
export class UsersModule {}
