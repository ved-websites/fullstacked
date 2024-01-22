import { AuthModule } from '$users/auth/auth.module';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { Module } from '@nestjs/common';
import { UserSecurityResolver } from './security.resolver';
import { UserSecurityService } from './security.service';
import { SecurityController } from './security.controller';

@Module({
	imports: [LuciaModule, AuthModule],
	providers: [UserSecurityService, UserSecurityResolver],
	controllers: [SecurityController],
})
export class UserSecurityModule {}
