import { RolesModule } from '$auth/roles/roles.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProfilePictureModule } from './profile-picture/profile-picture.module';
import { SettingsResolver } from './settings.resolver';
import { SettingsService } from './settings.service';

@Module({
	imports: [PrismaModule, RolesModule, ProfilePictureModule],
	providers: [SettingsResolver, SettingsService],
})
export class SettingsModule {}
