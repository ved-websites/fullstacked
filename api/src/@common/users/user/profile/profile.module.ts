import { PrismaModule } from '$prisma/prisma.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { Module } from '@nestjs/common';
import { ProfilePictureModule } from './profile-picture/profile-picture.module';
import { UserProfileResolver } from './profile.resolver';
import { UserProfileService } from './profile.service';

@Module({
	imports: [PrismaModule, RolesModule, ProfilePictureModule],
	providers: [UserProfileResolver, UserProfileService],
})
export class UserProfileModule {}
