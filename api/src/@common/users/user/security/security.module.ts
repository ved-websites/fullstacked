import { AuthModule } from '$users/auth/auth.module';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { UserSecurityResolver } from './security.resolver';
import { UserSecurityService } from './security.service';

@Module({
	imports: [LuciaModule, AuthModule],
	providers: [UserSecurityService, UserSecurityResolver],
	controllers: [SecurityController],
	exports: [UserSecurityService],
})
export class UserSecurityModule {}
