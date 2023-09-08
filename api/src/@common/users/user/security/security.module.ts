import { PrismaModule } from '$prisma/prisma.module';
import { AuthModule } from '$users/auth/auth.module';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { Module } from '@nestjs/common';
import { UserSecurityResolver } from './security.resolver';
import { UserSecurityService } from './security.service';

@Module({
	imports: [PrismaModule, LuciaModule, AuthModule],
	providers: [UserSecurityService, UserSecurityResolver],
})
export class UserSecurityModule {}
