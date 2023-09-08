import { PrismaModule } from '$prisma/prisma.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { Module } from '@nestjs/common';
import { ProfilePictureModule } from './profile-picture/profile-picture.module';
import { UserSettingsResolver } from './settings.resolver';
import { UserSettingsService } from './settings.service';

@Module({
	imports: [PrismaModule, RolesModule, ProfilePictureModule],
	providers: [UserSettingsResolver, UserSettingsService],
})
export class UserSettingsModule {}
