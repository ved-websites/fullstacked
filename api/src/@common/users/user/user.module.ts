import { Module } from '@nestjs/common';
import { UserProfileModule } from './profile/profile.module';
import { UserSecurityModule } from './security/security.module';

@Module({
	imports: [UserProfileModule, UserSecurityModule],
})
export class UserModule {}
