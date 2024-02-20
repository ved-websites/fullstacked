import { EmailModule } from '$email/email.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { ProfilePictureModule } from './profile-picture/profile-picture.module';
import { ProfileController } from './profile.controller';
import { UserProfileService } from './profile.service';

@Module({
	imports: [RolesModule, ProfilePictureModule, PresenceModule, EmailModule],
	providers: [UserProfileService],
	controllers: [ProfileController],
	exports: [UserProfileService],
})
export class UserProfileModule {}
