import { TypedI18nModule } from '$i18n/i18n.module';
import { PrismaModule } from '$prisma/prisma.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { ProfilePictureModule } from './profile-picture/profile-picture.module';
import { UserProfileResolver } from './profile.resolver';
import { UserProfileService } from './profile.service';

@Module({
	imports: [PrismaModule, RolesModule, ProfilePictureModule, PresenceModule, TypedI18nModule],
	providers: [UserProfileResolver, UserProfileService],
})
export class UserProfileModule {}
